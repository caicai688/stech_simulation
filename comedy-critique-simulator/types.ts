
export interface VibeScores {
  chaos: number;
  sharpness: number;
  rhythm: number;
  cringe: number;
  warmth: number;
}

export interface JudgeComment {
  judgeId: 'veteran' | 'zoomer' | 'sarah';
  name: string;
  avatar: string; // URL or emoji
  content: string;
  reaction?: string; // For Sarah's specific actions
}

export interface EvaluationResult {
  totalScore: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  vibeMatch: string; // Description of vibe match
  vibes: VibeScores;
  comments: JudgeComment[];
  audienceReactions: string[]; // Danmaku text
  nextSteps: string;
  overallComment: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string; // The joke text
  image?: string; // Base64 of uploaded meme
  result: EvaluationResult;
}

export type JokeCategory = 'brainTeaser' | 'classic' | 'cold' | 'pun' | 'selfDeprecation' | 'meme';

export type AIProvider = 'gemini' | 'openai' | 'glm' | 'qwen' | 'moonshot';

export interface AppConfig {
  provider: AIProvider;
  apiKey?: string;
  model: string;
}
