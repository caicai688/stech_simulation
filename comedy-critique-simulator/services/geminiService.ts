
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, PROVIDERS } from '../constants';
import { EvaluationResult, AppConfig } from '../types';

export const evaluateJoke = async (
  text: string, 
  config: AppConfig,
  imageBase64?: string
): Promise<EvaluationResult> => {
  
  const provider = config.provider || 'gemini';
  
  // For Gemini, we might fallback to env var. For others, user must provide key.
  const apiKey = config.apiKey || (provider === 'gemini' ? process.env.API_KEY : '');
  
  if (!apiKey) {
    throw new Error(`未配置 ${PROVIDERS[provider].name} 的 API Key。请在右上角设置中输入。`);
  }

  // --- GEMINI HANDLER ---
  if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey });
      const modelName = config.model || 'gemini-3-flash-preview';

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
      const finalPrompt = `${SYSTEM_PROMPT}\n\n[JOKE CONTENT START]\n${text}\n[JOKE CONTENT END]`;
      parts.push({ text: finalPrompt });

      try {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: { role: 'user', parts: parts },
          config: {
            responseMimeType: 'application/json',
            temperature: 1,
          }
        });

        const responseText = response.text;
        if (!responseText) throw new Error("AI 未返回数据");
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (error: any) {
        console.error("Gemini Error:", error);
        if (error.message?.includes('API key')) throw new Error("API Key 无效或已过期。");
        throw error;
      }
  } 
  
  // --- OPENAI COMPATIBLE HANDLER (ChatGPT, GLM, Qwen, Moonshot) ---
  else {
      const providerInfo = PROVIDERS[provider];
      if (!providerInfo) throw new Error("Unknown provider");

      const endpoint = `${providerInfo.endpoint}/chat/completions`;
      
      const messages: any[] = [
          { role: 'system', content: SYSTEM_PROMPT }
      ];

      // Build User Content
      const contentParts: any[] = [{ type: 'text', text: text || "(No Text provided, purely visual joke)" }];
      
      if (imageBase64) {
          // Check if provider generally supports vision or if we should skip
          // Note: Moonshot V1 is text only usually, but let's try standard format. 
          // If it fails, user should switch to vision capable model.
          contentParts.push({
              type: 'image_url',
              image_url: {
                  url: imageBase64 // Standard OpenAI format supports Data URI
              }
          });
      }

      messages.push({ role: 'user', content: contentParts });

      try {
          const body: any = {
              model: config.model,
              messages: messages,
              temperature: 0.9,
              stream: false
          };

          // Some providers support json_object, some strictly rely on prompt
          // OpenAI, Moonshot, newer GLM/Qwen usually support response_format or are smart enough.
          if (provider === 'openai' || provider === 'moonshot') {
             body.response_format = { type: "json_object" };
          }

          const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify(body)
          });

          if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              throw new Error(errData?.error?.message || `API Request Failed: ${response.status}`);
          }

          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content;
          
          if (!rawContent) throw new Error("AI returned empty content");

          const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanJson);

      } catch (error: any) {
          console.error(`${provider} Error:`, error);
          throw new Error(`${providerInfo.name} 调用失败: ${error.message}`);
      }
  }
};
