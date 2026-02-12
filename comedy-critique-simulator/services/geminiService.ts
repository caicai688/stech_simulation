
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, PROVIDERS } from '../constants';
import { EvaluationResult, AppConfig, HistoryItem } from '../types';
import { generateComedyAnalysis } from './comedyScheduler';

/**
 * 评估段子 - 主入口函数
 * 
 * 现在使用健壮的调度器系统：
 * - 优先使用用户配置的模型
 * - 限频后自动多级降级 (用户模型 -> 其他备用模型)
 * - 智能缓存 (24小时)
 * - 并发限流
 * - 统一输出格式
 * - 根据玩家反馈智能调整评判标准
 * 
 * @param text - 段子文本
 * @param config - 用户配置 (优先使用用户选择的模型)
 * @param imageBase64 - 图片 Base64
 * @param onQueued - 排队回调函数 (可选)
 * @param history - 历史记录 (用于生成反馈指导)
 * @returns 评审结果
 */
export const evaluateJoke = async (
  text: string, 
  config: AppConfig,
  imageBase64?: string,
  onQueued?: () => void,
  history?: HistoryItem[]
): Promise<EvaluationResult> => {
  
  // 传递用户配置和历史记录到调度器
  return await generateComedyAnalysis(text, imageBase64, onQueued, config, history);
};
