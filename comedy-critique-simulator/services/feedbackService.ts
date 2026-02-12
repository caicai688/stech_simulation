/**
 * 🌹🥚 玩家反馈服务 - 按导师独立分析版本
 * 
 * 功能：
 * 1. 按导师分别统计玩家反馈（玫瑰花 vs 鸡蛋）
 * 2. 分析每个导师的表现和风格偏好
 * 3. 为每个导师生成独立的反馈指导
 */

import { HistoryItem, JudgeFeedback } from '../types';

type JudgeId = 'veteran' | 'zoomer' | 'sarah';

interface JudgeFeedbackStats {
  judgeId: JudgeId;
  name: string;
  roses: number;      // 获得的玫瑰花数量
  eggs: number;       // 获得的鸡蛋数量
  total: number;      // 总评审次数
  satisfaction: number; // 满意度 (0-100)
}

interface JudgeInsight {
  preferredStyle: string;    // 玩家对该导师的风格偏好
  harshnessTolerance: string; // 严厉程度反馈
  contentSuggestion: string;  // 内容建议
}

/**
 * 从历史记录中按导师提取反馈统计
 */
export function analyzeJudgeFeedback(history: HistoryItem[]): {
  judgeStats: JudgeFeedbackStats[];
} {
  // 统计每个评委的反馈
  const judgeMap = new Map<JudgeId, JudgeFeedbackStats>();
  
  // 导师名称映射
  const judgeNames: Record<JudgeId, string> = {
    veteran: '老炮儿·严师',
    zoomer: 'Gen-Z 冲浪手',
    sarah: '冷脸导师豆豆'
  };
  
  // 初始化
  (['veteran', 'zoomer', 'sarah'] as JudgeId[]).forEach(judgeId => {
    judgeMap.set(judgeId, {
      judgeId,
      name: judgeNames[judgeId],
      roses: 0,
      eggs: 0,
      total: 0,
      satisfaction: 0
    });
  });
  
  // 遍历历史记录，统计每个导师的反馈
  history.forEach(item => {
    if (!item.feedbacks || item.feedbacks.length === 0) return;
    
    item.feedbacks.forEach((feedback: JudgeFeedback) => {
      const stats = judgeMap.get(feedback.judgeId)!;
      stats.total++;
      
      if (feedback.type === 'rose') {
        stats.roses++;
      } else if (feedback.type === 'egg') {
        stats.eggs++;
      }
      
      // 更新满意度
      stats.satisfaction = stats.total > 0 
        ? Math.round((stats.roses / stats.total) * 100)
        : 0;
    });
  });
  
  return {
    judgeStats: Array.from(judgeMap.values())
  };
}

/**
 * 为单个导师生成反馈洞察
 */
function generateJudgeInsight(stats: JudgeFeedbackStats): JudgeInsight {
  const { satisfaction, roses, eggs, total } = stats;
  
  if (total === 0) {
    return {
      preferredStyle: '暂无反馈数据',
      harshnessTolerance: '暂无反馈数据',
      contentSuggestion: '请保持你的评判风格'
    };
  }
  
  // 风格偏好分析
  let preferredStyle = '';
  if (satisfaction >= 80) {
    preferredStyle = '玩家非常喜欢你的评判风格！继续保持';
  } else if (satisfaction >= 60) {
    preferredStyle = '玩家总体认可你的风格，可以适当优化';
  } else if (satisfaction >= 40) {
    preferredStyle = '玩家对你的风格有一定意见，建议调整';
  } else {
    preferredStyle = '玩家对你的评判不太满意，需要较大调整';
  }
  
  // 严厉程度反馈
  let harshnessTolerance = '';
  if (eggs > roses) {
    harshnessTolerance = '玩家认为你过于严苛或评语不够有趣';
  } else if (roses > eggs * 2) {
    harshnessTolerance = '玩家很喜欢你的评判尺度和表达方式';
  } else {
    harshnessTolerance = '玩家认为你的严厉程度适中';
  }
  
  // 内容建议
  let contentSuggestion = '';
  if (satisfaction < 60) {
    contentSuggestion = '建议: 评语更幽默、建设性；减少过度严苛或敷衍的评判';
  } else {
    contentSuggestion = '建议: 继续保持当前风格的趣味性和专业性';
  }
  
  return {
    preferredStyle,
    harshnessTolerance,
    contentSuggestion
  };
}

/**
 * 为单个导师生成用于 Prompt 的反馈指导文本
 */
export function generateJudgeFeedbackGuidance(
  judgeId: JudgeId,
  history: HistoryItem[]
): string {
  const analysis = analyzeJudgeFeedback(history);
  const stats = analysis.judgeStats.find(s => s.judgeId === judgeId);
  
  if (!stats || stats.total === 0) {
    return ''; // 该导师无反馈数据
  }
  
  const insight = generateJudgeInsight(stats);
  
  return `
### 🌹🥚 你的个人反馈数据 (仅针对 ${stats.name})

**IMPORTANT**: 以下是玩家专门针对你的评价的反馈统计！

- 评审次数: ${stats.total}
- 玫瑰花 🌹: ${stats.roses} (${stats.satisfaction}%)
- 鸡蛋 🥚: ${stats.eggs} (${100 - stats.satisfaction}%)

**玩家对你的评价:**
- ${insight.preferredStyle}
- ${insight.harshnessTolerance}

**优化建议:**
- ${insight.contentSuggestion}

${stats.satisfaction < 50 ? `
⚠️ 你的满意度较低！请调整评判策略以获得更多玫瑰花！
` : `
✅ 你的表现很受欢迎，继续保持！
`}
`;
}

/**
 * 为所有导师生成反馈指导映射
 */
export function generateAllJudgesFeedbackGuidance(history: HistoryItem[]): {
  veteran: string;
  zoomer: string;
  sarah: string;
} {
  return {
    veteran: generateJudgeFeedbackGuidance('veteran', history),
    zoomer: generateJudgeFeedbackGuidance('zoomer', history),
    sarah: generateJudgeFeedbackGuidance('sarah', history)
  };
}
