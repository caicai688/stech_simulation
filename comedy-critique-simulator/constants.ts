
import { JudgeComment, JokeCategory } from './types';

export const JUDGES: { [key: string]: Omit<JudgeComment, 'content'> & { description: string } } = {
  veteran: {
    judgeId: 'veteran',
    name: '老炮儿·严师',
    avatar: '',
    description: '结构至上，三番四抖',
  },
  zoomer: {
    judgeId: 'zoomer',
    name: 'Gen-Z 冲浪手',
    avatar: '',
    description: '抽象，Meta梗，Chaos拥趸',
  },
  sarah: {
    judgeId: 'sarah',
    name: 'Sarah (冷脸导师)',
    avatar: '',
    description: '刻薄专业，隐性冷幽默',
  },
};

export const QUICK_JOKES: Record<JokeCategory, string[]> = {
  brainTeaser: [
    "什么东西早上四条腿，中午两条腿，晚上三条腿？\n\n其实是——怪物史莱克，因为他想变啥变啥。",
    "什么样的路不能走？\n\n套路。",
    "麒麟飞到北极会变成什么？\n\n冰淇淋。",
    "有一只狼宝宝，它不吃肉只吃素，为啥？\n\n因为它是一只——灰太狼（并不，因为它挑食）。"
  ],
  classic: [
    "我去买橘子，就在此地，不要走动。\n\n老板说：如果你要买橘子，麻烦去隔壁水果店，这里是五金店。",
    "医生，我最近视力不好。\n\n医生：那你怎么看出来的？\n我说：我看见你挂号单上写的是兽医。",
    "我在马路边捡到一分钱，把它交到警察叔叔手里边。\n警察叔叔说：现在的孩子真懂事，不过下次能不能别拿冥币？"
  ],
  cold: [
    "小明把风扇关了，为什么大家还是很冷？\n\n因为小明讲了个冷笑话。",
    "为什么企鹅只有肚子是白的？\n\n因为手短，洗不到背。",
    "透明人去医院看病，医生对他说什么？\n\n医生说：我看不见你，下一个！"
  ],
  pun: [
    "耗子药居然还要用药引子？\n\n那药引子是不是耗子给开门的？",
    "你知道为什么星星不说话吗？\n\n因为星星会——闪（闪烁/闪人）。",
    "三分熟的牛排和五分熟的牛排见面了，为什么没打招呼？\n\n因为它们都不熟。"
  ],
  selfDeprecation: [
    "我这人优点不多，但缺点也找不出来几个，毕竟没人关注我。",
    "虽然我长得丑，但是我想得美啊。",
    "每次照镜子，我都觉得上帝造人时一定是点了随机生成。"
  ],
  meme: [
    "（请上传一张梗图）\n我的精神状态如下图所示：",
    "（请上传一张梗图）\n当我在周一早上醒来：",
    "（请上传一张梗图）\n这就叫专业。"
  ],
};

export const PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    endpoint: '', // Uses SDK
    models: [
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast)' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Smart)' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' }
    ]
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    endpoint: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' }
    ]
  },
  glm: {
    name: 'ZhipuAI (智谱GLM)',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4-flash', name: 'GLM-4 Flash' },
      { id: 'glm-4-plus', name: 'GLM-4 Plus' },
      { id: 'glm-4v-plus', name: 'GLM-4V Plus (Vision)' }
    ]
  },
  qwen: {
    name: 'Aliyun (通义千问)',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen-plus', name: 'Qwen Plus' },
      { id: 'qwen-max', name: 'Qwen Max' },
      { id: 'qwen-vl-max', name: 'Qwen VL Max (Vision)' }
    ]
  },
  moonshot: {
    name: 'Moonshot (Kimi)',
    endpoint: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot V1 8k' },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32k' }
    ]
  }
};

export const SYSTEM_PROMPT = `
# Role: 喜剧模拟器综合评审系统 (Comedy Critique Simulator)
## Characters:
1. **Old Veteran (严师)**: Focus on structure, "rule of three", logic. Hates gaps. Speaking style: Traditional cross-talk jargon.
2. **Gen-Z Zoomer**: Loves abstract, chaos, meta-humor, vibes. Speaking style: Internet slang, emojis, gen-z lingo.
3. **Sarah (Tsundere)**: Cold, professional, nitpicky details. Secretly loves high chaos/sharpness. Speaking style: Sharp, professional, sarcastic.

## Task:
Evaluate the user's joke (text and/or image) in **CHINESE**.

## Output Requirement:
You MUST return a valid JSON object. Do NOT wrap it in markdown code blocks. The JSON structure is:
{
  "totalScore": number (0-100),
  "grade": "夯" (90-100), "顶级" (80-89), "人上人" (60-79), "NPC" (40-59), or "拉完了" (0-39),
  "vibeMatch": "Short description of text vs vibe (in Chinese)",
  "vibes": {
    "chaos": number (0-100),
    "sharpness": number (0-100),
    "rhythm": number (0-100),
    "cringe": number (0-100),
    "warmth": number (0-100)
  },
  "comments": [
    {
      "judgeId": "veteran",
      "name": "老炮儿·严师",
      "content": "Critique string in Chinese..."
    },
    {
      "judgeId": "sarah",
      "name": "Sarah",
      "reaction": "Action description (e.g. 推了推眼镜) in Chinese",
      "content": "Critique string in Chinese... (Include hidden joke if score > 90)"
    },
    {
      "judgeId": "zoomer",
      "name": "Gen-Z 冲浪手",
      "content": "Critique string in Chinese..."
    }
  ],
  "audienceReactions": ["Array of 5-8 short strings for danmaku/barrage (e.g. '哈哈哈', '好冷', '???') in Chinese"],
  "nextSteps": "Advice for next time based on weak vibe (in Chinese)",
  "overallComment": "A one sentence summary (in Chinese)"
}
`;
