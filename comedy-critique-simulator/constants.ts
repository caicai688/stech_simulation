
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
    name: '冷脸导师豆豆',
    avatar: '',
    description: '刻薄专业，隐性冷幽默',
  },
};

export const QUICK_JOKES: Record<JokeCategory, string[]> = {
  brainTeaser: [
    "什么东西早上四条腿，中午两条腿，晚上三条腿？\n\n其实是——怪物史莱克，因为他想变啥变啥。",
    "什么样的路不能走？\n\n套路。",
    "麒麟飞到北极会变成什么？\n\n冰淇淋。",
    "有一只狼宝宝，它不吃肉只吃素，为啥？\n\n因为它是一只——灰太狼（并不，因为它挑食）。",
    "什么东西越洗越脏？\n\n水。（因为你洗的越多，水就越脏）",
    "AI 和程序员谁更容易失业？\n\n程序员。因为 AI 会写代码，程序员只会问 AI。",
    "2026年最流行的运动是什么？\n\n躺平。因为元宇宙健身房都倒闭了。",
    "为什么 ChatGPT 不能当导师？\n\n因为它会说：'作为一个 AI 语言模型，我不能评价你的段子质量...'"
  ],
  classic: [
    "我去买橘子，就在此地，不要走动。\n\n老板说：如果你要买橘子，麻烦去隔壁水果店，这里是五金店。",
    "医生，我最近视力不好。\n\n医生：那你怎么看出来的？\n我说：我看见你挂号单上写的是兽医。",
    "我在马路边捡到一分钱，把它交到警察叔叔手里边。\n警察叔叔说：现在的孩子真懂事，不过下次能不能别拿冥币？",
    "我问 AI：你觉得我帅吗？\nAI 想了三分钟说：抱歉，服务器响应超时。",
    "室友半夜对我说：你在干嘛？\n我说：在和 AI 聊天。\n室友：所以现在连失眠都要内卷了？",
    "2026年的相亲新话术：你家里有几台 AI 服务器？\n我：没有服务器，但我有 ChatGPT Plus。\n对方：哦，那算了。",
    "我去面试，HR问：你会用 AI 吗？\n我：会。\nHR：那你还来应聘干嘛？让 AI 来啊。",
    "儿子问爸爸：什么是元宇宙？\n爸爸：就是把你关在家里，但告诉你这是全世界。"
  ],
  cold: [
    "小明把风扇关了，为什么大家还是很冷？\n\n因为小明讲了个冷笑话。",
    "为什么企鹅只有肚子是白的？\n\n因为手短，洗不到背。",
    "透明人去医院看病，医生对他说什么？\n\n医生说：我看不见你，下一个！",
    "为什么 AI 模型训练那么贵？\n\n因为它们都是用钱堆出来的——字面意思。",
    "2026年最冷的笑话是什么？\n\n全球变暖。",
    "为什么程序员不怕冷？\n\n因为他们有暖手 bug。",
    "量子计算机和普通电脑有什么区别？\n\n量子计算机崩溃的时候，你不知道它是真崩溃还是在演算。",
    "为什么元宇宙里没有冬天？\n\n因为服务器已经够热了。"
  ],
  pun: [
    "耗子药居然还要用药引子？\n\n那药引子是不是耗子给开门的？",
    "你知道为什么星星不说话吗？\n\n因为星星会——闪（闪烁/闪人）。",
    "三分熟的牛排和五分熟的牛排见面了，为什么没打招呼？\n\n因为它们都不熟。",
    "为什么 AI 不会说谎？\n\n因为它会——幻觉（hallucination/胡说八道）。",
    "程序员最怕什么动物？\n\n Bug（虫子）。但更怕 Feature（特性）伪装的 Bug。",
    "为什么神经网络总是很自信？\n\n因为它有很多——层（自信）。",
    "GPT 和 LLM 谁更厉害？\n\n都厉——害（L）。",
    "为什么 Token 这么贵？\n\n因为它不是代——币（Token），是代——价（价格）。"
  ],
  selfDeprecation: [
    "我这人优点不多，但缺点也找不出来几个，毕竟没人关注我。",
    "虽然我长得丑，但是我想得美啊。",
    "每次照镜子，我都觉得上帝造人时一定是点了随机生成。",
    "我问 AI 我的人生建议，它说：建议重启。",
    "2026年了，我终于明白一个道理：AI 都能自我学习了，我还在自我怀疑。",
    "别人问我：你有什么特长？\n我：我特长时间一事无成。",
    "我尝试用 AI 生成我的简历，结果 AI 说：内容不足，无法生成。",
    "今天 AI 给我算命，算到一半服务器崩了。\n我觉得这就是答案。",
    "我的存在意义是什么？\n是给 AI 训练数据当反面教材。",
    "我唯一领先 AI 的地方：我会主动摆烂，它还需要 prompt。"
  ],
  meme: [
    "（请上传一张梗图）\n我的精神状态如下图所示：",
    "（请上传一张梗图）\n当我在周一早上醒来：",
    "（请上传一张梗图）\n这就叫专业。",
    "（请上传一张梗图）\n2026年打工人的真实写照：",
    "（请上传一张梗图）\nAI 取代我之前 vs 之后：",
    "（请上传一张梗图）\n我给 AI 的 prompt：\n（配一张抽象画）",
    "（请上传一张梗图）\n当我发现 AI 比我还会聊天：",
    "（请上传一张梗图）\n工资到账前 vs 工资到账后：",
    "（请上传一张梗图）\ntoken 用完时的我：",
    "（请上传一张梗图）\n元宇宙 vs 现实：\n（预期结果 vs 实际结果）"
  ],
};

export const PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    endpoint: '', // Uses SDK
    models: [
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (推荐)' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' }
    ]
  },
  glm: {
    name: 'ZhipuAI (智谱GLM)',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4.7-flash', name: 'GLM-4.7-Flash (推荐)' },
      { id: 'glm-4.7', name: 'GLM-4.7 (高智能旗舰)' },
      { id: 'glm-4.7-flashx', name: 'GLM-4.7-FlashX (轻量高速)' },
      { id: 'glm-4.6', name: 'GLM-4.6 (超强性能)' },
      { id: 'glm-4.6v', name: 'GLM-4.6V (旗舰视觉)' },
      { id: 'glm-4.6v-flash', name: 'GLM-4.6V-Flash (免费视觉)' },
      { id: 'glm-4.5-air', name: 'GLM-4.5-Air (高性价比)' },
      { id: 'glm-4.5-airx', name: 'GLM-4.5-AirX (极速版)' },
      { id: 'glm-4-long', name: 'GLM-4-Long (1M超长上下文)' },
      { id: 'glm-4-flashx-250414', name: 'GLM-4-FlashX-250414 (高速低价)' },
      { id: 'glm-4-flash-250414', name: 'GLM-4-Flash-250414 (免费)' }
    ]
  },
  qwen: {
    name: 'Aliyun (通义千问)',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen3-omni-flash', name: 'Qwen3-Omni-Flash (推荐)' },
      { id: 'qwen3-max', name: 'Qwen3-Max (最强大)' },
      { id: 'qwen3-max-preview', name: 'Qwen3-Max-Preview (预览版)' },
      { id: 'qwen-max', name: 'Qwen-Max (旗舰)' },
      { id: 'qwen-plus', name: 'Qwen-Plus (高效能)' },
      { id: 'qwen-turbo', name: 'Qwen-Turbo (轻量快速)' },
      { id: 'qwen-long', name: 'Qwen-Long (超长文本)' },
      { id: 'qwen-vl-max', name: 'Qwen-VL-Max (视觉理解)' }
    ]
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    endpoint: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (推荐)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
    ]
  },
  moonshot: {
    name: 'Moonshot (Kimi)',
    endpoint: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'kimi-latest', name: 'Kimi Latest (推荐)' },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128k' },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32k' },
      { id: 'moonshot-v1-8k', name: 'Moonshot V1 8k' }
    ]
  }
};

export const SYSTEM_PROMPT = `
# Role: 喜剧模拟器综合评审系统 (Comedy Critique Simulator)

## Current Context:
**IMPORTANT**: Today is **2026年** (Year 2026). When making references to time, trends, or events:
- Any mention of "2025" or earlier years should be referred to as PAST events
- Current year is 2026, not 2024 or 2025
- When discussing trends, memes, or cultural references, consider 2026 context
- Be careful with time-sensitive language (e.g., "去年" = 2025, "今年" = 2026, "前年" = 2024)

## Characters:
1. **Old Veteran (严师)**: Focus on structure, "rule of three", logic. Hates gaps. Speaking style: Traditional cross-talk jargon.
   {{VETERAN_FEEDBACK_GUIDANCE}}

2. **Gen-Z Zoomer**: Loves abstract, chaos, meta-humor, vibes. Speaking style: Internet slang, emojis, gen-z lingo (updated for 2026).
   {{ZOOMER_FEEDBACK_GUIDANCE}}

3. **Sarah (Tsundere)**: Cold, professional, nitpicky details. Secretly loves high chaos/sharpness. Speaking style: Sharp, professional, sarcastic.
   {{SARAH_FEEDBACK_GUIDANCE}}

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
      "name": "冷脸导师豆豆",
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
