/**
 * 🎭 喜剧鉴赏调度器 (Comedy Analysis Scheduler)
 * 
 * 核心功能:
 * 1. 用户优先策略 (User-First): 优先使用用户在配置页选择的模型
 * 2. 智能降级 (Smart Fallback): 用户模型限频后自动降级到备用模型
 * 3. 内存缓存 (Memory Cache): 24小时有效期
 * 4. 请求限流 (Throttle): 控制每个模型的并发数
 * 5. 统一输出格式
 * 6. 健壮的错误处理
 * 
 * 调度策略:
 * - 第一优先级: 用户配置的模型（如果有 API Key）
 * - 备用降级: 环境变量中的其他模型（按 Gemini -> 千问 -> 智谱 顺序）
 * - 限频触发: 遇到 429/timeout/quota 错误时自动切换下一个模型
 */

import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, PROVIDERS } from '../constants';
import { EvaluationResult, AppConfig, HistoryItem } from '../types';
import { generateAllJudgesFeedbackGuidance } from './feedbackService';

// ==================== 配置常量 ====================

/** 模型配置 */
interface ModelConfig {
  name: string;
  apiKey: string | null;
  endpoint?: string;
  modelName: string;
  maxConcurrent: number; // 最大并发数
  timeout: number; // 超时时间 (ms)
  isUserPreferred?: boolean; // 是否为用户优先选择的模型
}

/** 缓存项 */
interface CacheItem {
  data: EvaluationResult;
  timestamp: number;
  sourceModel: string;
}

/** 请求队列项 */
interface QueueItem {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  execute: () => Promise<any>;
}

// ==================== 全局状态 ====================

/** 内存缓存 Map (24小时有效) */
const cache = new Map<string, CacheItem>();

/** 每个模型的并发计数器 */
const concurrentCounts = {
  gemini: 0,
  qwen: 0,
  glm: 0
};

/** 每个模型的请求队列 */
const requestQueues: {
  gemini: QueueItem[];
  qwen: QueueItem[];
  glm: QueueItem[];
} = {
  gemini: [],
  qwen: [],
  glm: []
};

// ==================== 工具函数 ====================

/**
 * 生成缓存 Key
 * 基于段子内容和图片生成唯一标识
 */
function getCacheKey(text: string, imageBase64?: string): string {
  const imageHash = imageBase64 
    ? imageBase64.substring(0, 50) 
    : 'no-image';
  return `comedy_${text.substring(0, 100)}_${imageHash}`;
}

/**
 * 从缓存获取结果
 * 如果缓存超过24小时，自动清除
 */
function getFromCache(key: string): EvaluationResult | null {
  const item = cache.get(key);
  if (!item) return null;
  
  const now = Date.now();
  const age = now - item.timestamp;
  const MAX_AGE = 24 * 60 * 60 * 1000; // 24小时
  
  if (age > MAX_AGE) {
    cache.delete(key);
    console.log(`[Cache] 缓存已过期: ${key}`);
    return null;
  }
  
  console.log(`[Cache] 命中缓存 (${item.sourceModel}): ${key}`);
  return item.data;
}

/**
 * 保存到缓存
 */
function saveToCache(key: string, data: EvaluationResult, sourceModel: string): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    sourceModel
  });
  console.log(`[Cache] 已缓存结果 (${sourceModel}): ${key}`);
}

/**
 * 获取环境变量中的 API Key
 */
function getApiKey(provider: 'gemini' | 'qwen' | 'glm'): string | null {
  try {
    // @ts-ignore - Vite env variables
    const env = typeof import.meta !== 'undefined' ? import.meta.env : {};
    
    if (provider === 'gemini') {
      return env.VITE_GEMINI_API_KEY || null;
    } else if (provider === 'qwen') {
      return env.VITE_QWEN_API_KEY || null;
    } else if (provider === 'glm') {
      return env.VITE_GLM_API_KEY || null;
    }
  } catch (error) {
    console.error(`[Config] 获取 ${provider} API Key 失败:`, error);
  }
  return null;
}

/**
 * 初始化模型配置
 * 优先使用用户配置的模型，然后加入备用模型
 * 
 * @param userConfig - 用户配置（可选）
 */
function initModelConfigs(userConfig?: AppConfig): ModelConfig[] {
  const configs: ModelConfig[] = [];
  
  // 1. 优先加入用户配置的模型
  // 用户可以选择 provider 但不填 API Key（使用环境变量的 Key）
  if (userConfig?.provider) {
    const provider = userConfig.provider;
    const userApiKey = userConfig.apiKey; // 用户填写的 Key（可能为空）
    const envApiKey = getApiKey(provider); // 环境变量中的 Key
    const apiKey = userApiKey || envApiKey; // 优先用户 Key，否则用环境 Key
    const modelName = userConfig.model;
    
    if (apiKey) {
      console.log(`[Scheduler] 用户优先选择: ${provider} (${modelName}) - API Key 来源: ${userApiKey ? '用户配置' : '环境变量'}`);
      
      if (provider === 'gemini') {
        configs.push({
          name: 'gemini',
          apiKey: apiKey,
          modelName: modelName,
          maxConcurrent: 2,
          timeout: 30000,
          isUserPreferred: true
        });
      } else if (provider === 'qwen') {
        configs.push({
          name: 'qwen',
          apiKey: apiKey,
          endpoint: PROVIDERS.qwen.endpoint,
          modelName: modelName,
          maxConcurrent: 5,
          timeout: 25000,
          isUserPreferred: true
        });
      } else if (provider === 'glm') {
        configs.push({
          name: 'glm',
          apiKey: apiKey,
          endpoint: PROVIDERS.glm.endpoint,
          modelName: modelName,
          maxConcurrent: 10,
          timeout: 20000,
          isUserPreferred: true
        });
      }
    } else {
      console.warn(`[Scheduler] 用户选择了 ${provider}，但没有找到可用的 API Key`);
    }
  }
  
  // 2. 添加环境变量中的备用模型（排除已添加的用户模型）
  const userProvider = userConfig?.provider;
  
  // Gemini 备用配置
  if (userProvider !== 'gemini') {
    const geminiKey = getApiKey('gemini');
    if (geminiKey) {
      configs.push({
        name: 'gemini',
        apiKey: geminiKey,
        modelName: 'gemini-2.0-flash-exp',
        maxConcurrent: 2,
        timeout: 30000,
        isUserPreferred: false
      });
    }
  }
  
  // 千问备用配置
  if (userProvider !== 'qwen') {
    const qwenKey = getApiKey('qwen');
    if (qwenKey) {
      configs.push({
        name: 'qwen',
        apiKey: qwenKey,
        endpoint: PROVIDERS.qwen.endpoint,
        modelName: 'qwen-plus',
        maxConcurrent: 5,
        timeout: 25000,
        isUserPreferred: false
      });
    }
  }
  
  // 智谱备用配置
  if (userProvider !== 'glm') {
    const glmKey = getApiKey('glm');
    if (glmKey) {
      configs.push({
        name: 'glm',
        apiKey: glmKey,
        endpoint: PROVIDERS.glm.endpoint,
        modelName: 'glm-4-flash',
        maxConcurrent: 10,
        timeout: 20000,
        isUserPreferred: false
      });
    }
  }
  
  console.log(`[Scheduler] 已配置 ${configs.length} 个模型:`, 
    configs.map(c => `${c.name}${c.isUserPreferred ? ' (用户优先)' : ' (备用)'}`).join(', ')
  );
  
  return configs;
}

// ==================== 限流队列管理 ====================

/**
 * 执行带限流的请求
 * 如果当前并发已满，将请求放入队列等待
 */
async function executeWithThrottle<T>(
  modelName: 'gemini' | 'qwen' | 'glm',
  maxConcurrent: number,
  executor: () => Promise<T>,
  onQueued?: () => void
): Promise<T> {
  
  // 检查当前并发数
  if (concurrentCounts[modelName] >= maxConcurrent) {
    console.log(`[Throttle] ${modelName} 并发已满 (${concurrentCounts[modelName]}/${maxConcurrent})，加入队列`);
    
    // 触发排队回调
    if (onQueued) {
      onQueued();
    }
    
    // 加入队列等待
    return new Promise<T>((resolve, reject) => {
      requestQueues[modelName].push({
        resolve,
        reject,
        execute: executor as () => Promise<any>
      });
    });
  }
  
  // 执行请求
  concurrentCounts[modelName]++;
  console.log(`[Throttle] ${modelName} 并发: ${concurrentCounts[modelName]}/${maxConcurrent}`);
  
  try {
    const result = await executor();
    return result;
  } finally {
    concurrentCounts[modelName]--;
    
    // 处理队列中的下一个请求
    const nextItem = requestQueues[modelName].shift();
    if (nextItem) {
      console.log(`[Throttle] ${modelName} 处理队列中的请求`);
      executeWithThrottle(modelName, maxConcurrent, nextItem.execute)
        .then(nextItem.resolve)
        .catch(nextItem.reject);
    }
  }
}

// ==================== 模型调用函数 ====================

/**
 * 调用 Gemini API
 */
async function callGemini(
  text: string,
  imageBase64: string | undefined,
  config: ModelConfig,
  feedbackGuidances?: { veteran: string; zoomer: string; sarah: string }
): Promise<EvaluationResult> {
  const ai = new GoogleGenAI({ apiKey: config.apiKey! });
  
  const parts: any[] = [];
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64
      }
    });
  }
  
  // 构建完整 Prompt（为每个导师注入独立的反馈指导）
  let fullSystemPrompt = SYSTEM_PROMPT;
  if (feedbackGuidances) {
    fullSystemPrompt = fullSystemPrompt
      .replace('{{VETERAN_FEEDBACK_GUIDANCE}}', feedbackGuidances.veteran)
      .replace('{{ZOOMER_FEEDBACK_GUIDANCE}}', feedbackGuidances.zoomer)
      .replace('{{SARAH_FEEDBACK_GUIDANCE}}', feedbackGuidances.sarah);
  } else {
    // 无反馈数据时，移除占位符
    fullSystemPrompt = fullSystemPrompt
      .replace('{{VETERAN_FEEDBACK_GUIDANCE}}', '')
      .replace('{{ZOOMER_FEEDBACK_GUIDANCE}}', '')
      .replace('{{SARAH_FEEDBACK_GUIDANCE}}', '');
  }
  
  const finalPrompt = `${fullSystemPrompt}\n\n[JOKE CONTENT START]\n${text}\n[JOKE CONTENT END]`;
  parts.push({ text: finalPrompt });
  
  // 设置超时
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), config.timeout);
  });
  
  const requestPromise = ai.models.generateContent({
    model: config.modelName,
    contents: { role: 'user', parts },
    config: {
      responseMimeType: 'application/json',
      temperature: 1,
    }
  });
  
  const response = await Promise.race([requestPromise, timeoutPromise]);
  const responseText = response.text;
  
  if (!responseText) throw new Error("AI 未返回数据");
  
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

/**
 * 调用 OpenAI 兼容 API (千问、智谱)
 */
async function callOpenAICompatible(
  text: string,
  imageBase64: string | undefined,
  config: ModelConfig,
  feedbackGuidances?: { veteran: string; zoomer: string; sarah: string }
): Promise<EvaluationResult> {
  const endpoint = `${config.endpoint}/chat/completions`;
  
  // 构建完整系统 Prompt（为每个导师注入独立的反馈指导）
  let fullSystemPrompt = SYSTEM_PROMPT;
  if (feedbackGuidances) {
    fullSystemPrompt = fullSystemPrompt
      .replace('{{VETERAN_FEEDBACK_GUIDANCE}}', feedbackGuidances.veteran)
      .replace('{{ZOOMER_FEEDBACK_GUIDANCE}}', feedbackGuidances.zoomer)
      .replace('{{SARAH_FEEDBACK_GUIDANCE}}', feedbackGuidances.sarah);
  } else {
    // 无反馈数据时，移除占位符
    fullSystemPrompt = fullSystemPrompt
      .replace('{{VETERAN_FEEDBACK_GUIDANCE}}', '')
      .replace('{{ZOOMER_FEEDBACK_GUIDANCE}}', '')
      .replace('{{SARAH_FEEDBACK_GUIDANCE}}', '');
  }
  
  const messages: any[] = [
    { role: 'system', content: fullSystemPrompt }
  ];
  
  const contentParts: any[] = [
    { type: 'text', text: text || "(No Text provided, purely visual joke)" }
  ];
  
  if (imageBase64) {
    contentParts.push({
      type: 'image_url',
      image_url: { url: imageBase64 }
    });
  }
  
  messages.push({ role: 'user', content: contentParts });
  
  const body = {
    model: config.modelName,
    messages,
    temperature: 0.9,
    stream: false
  };
  
  // 设置超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      
      // 检查是否是 429 错误
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      
      throw new Error(errData?.error?.message || `API Request Failed: ${response.status}`);
    }
    
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    if (!rawContent) throw new Error("AI returned empty content");
    
    const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    throw error;
  }
}

/**
 * 调用单个模型 (带限流)
 */
async function callModel(
  text: string,
  imageBase64: string | undefined,
  config: ModelConfig,
  onQueued?: () => void,
  feedbackGuidances?: { veteran: string; zoomer: string; sarah: string }
): Promise<EvaluationResult> {
  return executeWithThrottle(
    config.name as 'gemini' | 'qwen' | 'glm',
    config.maxConcurrent,
    async () => {
      console.log(`[Model] 调用 ${config.name}...`);
      
      if (config.name === 'gemini') {
        return await callGemini(text, imageBase64, config, feedbackGuidances);
      } else {
        return await callOpenAICompatible(text, imageBase64, config, feedbackGuidances);
      }
    },
    onQueued
  );
}

// ==================== 主调度函数 ====================

/**
 * 🎭 喜剧鉴赏分析 - 主入口函数
 * 
 * 特性:
 * - 优先使用用户配置的模型
 * - 限频后自动多级降级 (用户模型 -> 备用模型)
 * - 24小时缓存
 * - 智能限流
 * - 统一输出格式
 * - 根据玩家反馈调整评判标准
 * 
 * @param text - 段子文本
 * @param imageBase64 - 图片 Base64 (可选)
 * @param onQueued - 排队回调函数 (可选)
 * @param userConfig - 用户配置 (可选，优先使用用户选择的模型)
 * @param history - 历史记录 (可选，用于生成反馈指导)
 * @returns 评审结果
 */
export async function generateComedyAnalysis(
  text: string,
  imageBase64?: string,
  onQueued?: () => void,
  userConfig?: AppConfig,
  history?: HistoryItem[]
): Promise<EvaluationResult> {
  
  // 1. 检查缓存
  const cacheKey = getCacheKey(text, imageBase64);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  // 2. 生成反馈指导（按导师分别生成）
  const feedbackGuidances = history && history.length > 0 
    ? generateAllJudgesFeedbackGuidance(history)
    : undefined;
  
  if (feedbackGuidances) {
    console.log('[Scheduler] 已为每个导师加载独立的反馈指导');
  }
  
  // 3. 初始化可用模型列表（优先用户配置）
  const availableModels = initModelConfigs(userConfig);
  
  if (availableModels.length === 0) {
    throw new Error('没有可用的 API Key，请在设置中配置或联系管理员。');
  }
  
  // 保存配置供监控面板使用
  saveLastUsedConfigs(availableModels);
  
  // 4. 按顺序尝试每个模型（用户优先模型在前）
  const errors: string[] = [];
  
  for (let i = 0; i < availableModels.length; i++) {
    const config = availableModels[i];
    const modelLabel = config.isUserPreferred ? '用户选择' : '备用模型';
    
    try {
      console.log(`[Scheduler] 尝试 ${modelLabel} ${i + 1}/${availableModels.length}: ${config.name} (${config.modelName})`);
      
      const result = await callModel(text, imageBase64, config, onQueued, feedbackGuidances);
      
      // 成功！保存到缓存并返回
      saveToCache(cacheKey, result, config.name);
      
      if (config.isUserPreferred) {
        console.log(`[Scheduler] ✅ 用户优先模型 ${config.name} 调用成功`);
      } else {
        console.log(`[Scheduler] ✅ 备用模型 ${config.name} 调用成功`);
      }
      
      return result;
      
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      console.error(`[Scheduler] ❌ ${config.name} 失败:`, errorMsg);
      
      errors.push(`${config.name}: ${errorMsg}`);
      
      // 如果是 429 或超时错误，尝试下一个模型
      const shouldFallback = 
        errorMsg.includes('RATE_LIMIT_EXCEEDED') ||
        errorMsg.includes('429') ||
        errorMsg.includes('timeout') ||
        errorMsg.includes('quota');
      
      if (shouldFallback && i < availableModels.length - 1) {
        if (config.isUserPreferred) {
          console.log(`[Scheduler] 🔄 用户模型限频，降级到备用模型...`);
        } else {
          console.log(`[Scheduler] 🔄 降级到下一个备用模型...`);
        }
        continue;
      }
      
      // 如果是最后一个模型或不可降级的错误，抛出
      if (i === availableModels.length - 1) {
        throw new Error(
          `所有模型调用失败:\n${errors.join('\n')}`
        );
      }
    }
  }
  
  // 理论上不会到这里
  throw new Error('调度器异常：所有模型均未响应');
}

// ==================== 统计和监控 ====================

// 存储最近使用的模型配置信息
let lastUsedModelConfigs: Array<{name: string, isUserPreferred: boolean, modelName: string}> = [];

/**
 * 保存最近使用的模型配置（供监控面板使用）
 */
function saveLastUsedConfigs(configs: ModelConfig[]) {
  lastUsedModelConfigs = configs.map(c => ({
    name: c.name,
    isUserPreferred: c.isUserPreferred || false,
    modelName: c.modelName
  }));
}

/**
 * 获取调度器统计信息
 */
export function getSchedulerStats() {
  return {
    cacheSize: cache.size,
    concurrentCounts: { ...concurrentCounts },
    queueSizes: {
      gemini: requestQueues.gemini.length,
      qwen: requestQueues.qwen.length,
      glm: requestQueues.glm.length
    },
    modelConfigs: lastUsedModelConfigs // 新增：返回模型配置信息
  };
}

/**
 * 清除缓存
 */
export function clearCache() {
  const size = cache.size;
  cache.clear();
  console.log(`[Cache] 已清除 ${size} 条缓存`);
}

/**
 * 获取缓存详情
 */
export function getCacheDetails() {
  const items: Array<{key: string, age: number, model: string}> = [];
  const now = Date.now();
  
  cache.forEach((value, key) => {
    items.push({
      key: key.substring(0, 50) + '...',
      age: Math.floor((now - value.timestamp) / 1000 / 60), // 分钟
      model: value.sourceModel
    });
  });
  
  return items;
}
