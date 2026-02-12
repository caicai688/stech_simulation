import React from 'react';
import { EvaluationResult, JudgeFeedback } from '../types';
import { X, Trophy, RotateCcw } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import FeedbackButtons from './FeedbackButtons';

interface ScoreModalProps {
  result: EvaluationResult | null;
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  currentFeedbacks?: JudgeFeedback[];
  onFeedback?: (judgeId: 'veteran' | 'zoomer' | 'sarah', type: 'rose' | 'egg' | null) => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({ 
  result, 
  isOpen, 
  onClose, 
  onReplay, 
  currentFeedbacks, 
  onFeedback 
}) => {
  if (!isOpen || !result) return null;

  // 获取某个导师的当前反馈状态
  const getJudgeFeedback = (judgeId: 'veteran' | 'zoomer' | 'sarah') => {
    return currentFeedbacks?.find(f => f.judgeId === judgeId)?.type;
  };

  // Use Chinese-only labels for the Radar Chart
  const data = [
    { subject: '抽象', A: result.vibes.chaos, fullMark: 100 },
    { subject: '攻击', A: result.vibes.sharpness, fullMark: 100 },
    { subject: '节奏', A: result.vibes.rhythm, fullMark: 100 },
    { subject: '尴尬', A: result.vibes.cringe, fullMark: 100 },
    { subject: '大底', A: result.vibes.warmth, fullMark: 100 },
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case '夯': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case '顶级': return 'text-purple-400';
      case '人上人': return 'text-blue-400';
      case 'NPC': return 'text-orange-400';
      case '拉完了': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-yellow-400';
      if (score >= 80) return 'text-purple-400';
      if (score >= 60) return 'text-blue-400';
      return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Changed max-h to fixed h-[85vh] to force flex container to have a definitive height for scrolling */}
      <div className="bg-gray-800 w-full max-w-4xl rounded-3xl border border-gray-600 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
        
        {/* Left Side: Score & Chart */}
        <div className="md:w-1/2 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-700 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-600 relative shrink-0">
          
          {/* Main Grade and Total Score */}
          <div className="flex flex-col items-center gap-2 mb-2 md:mb-4">
             <div className="text-yellow-400 text-lg md:text-xl font-bold tracking-wider mb-1">最终评级</div>
             <div className="flex items-baseline gap-4">
                <span className={`text-5xl md:text-8xl font-black ${result.grade === 'NPC' ? '' : 'font-comic'} ${getGradeColor(result.grade)}`}>
                    {result.grade}
                </span>
                <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400">综合得分</span>
                    <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(result.totalScore)}`}>
                        {result.totalScore}
                    </span>
                </div>
             </div>
          </div>

          {/* Chart */}
          <div className="w-full h-40 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#4b5563" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 14, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Vibe"
                  dataKey="A"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-1 md:mt-2 px-4">
             <p className="text-xs md:text-sm text-gray-300 italic">"{result.vibeMatch}"</p>
          </div>
        </div>

        {/* Right Side: Details & Comments */}
        <div className="md:w-1/2 flex flex-col h-full bg-gray-800 overflow-hidden min-h-0">
           
           {/* Header (Fixed) */}
           <div className="flex-none p-4 md:p-6 pb-2 flex justify-between items-start bg-gray-800 z-10">
             <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
               <Trophy className="text-yellow-500" size={18} /> 
               评审报告
             </h3>
             <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
               <X size={24} />
             </button>
           </div>

           {/* Scrollable Content (Flex Grow) */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-2">
             {/* Judge Breakdowns */}
             <div className="space-y-3 md:space-y-4">
               {result.comments.map((comment, idx) => (
                 <div key={idx} className="bg-black/20 p-3 md:p-4 rounded-xl border border-gray-700">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold text-yellow-500 text-sm">{comment.name}</span>
                     {comment.reaction && (
                        <span className="text-xs text-gray-400 italic">({comment.reaction})</span>
                     )}
                   </div>
                   <p className="text-sm text-gray-200 leading-relaxed">"{comment.content}"</p>
                   
                   {/* 每个导师下方的独立反馈按钮 */}
                   {onFeedback && (
                     <FeedbackButtons 
                       judgeId={comment.judgeId}
                       judgeName={comment.name}
                       onFeedback={onFeedback}
                       currentFeedback={getJudgeFeedback(comment.judgeId)}
                     />
                   )}
                 </div>
               ))}
             </div>

             <div className="mt-4 pt-4 border-t border-gray-700">
               <h4 className="font-bold text-blue-400 text-sm mb-1">📈 局外养成 (建议)</h4>
               <p className="text-sm text-gray-300 leading-relaxed">{result.nextSteps}</p>
             </div>
             
            <div className="mt-3 md:mt-2">
               <h4 className="font-bold text-white text-sm mb-1">总评</h4>
               <p className="text-sm text-gray-300 italic leading-relaxed">{result.overallComment}</p>
            </div>

            {/* Play Again Button - Moved INSIDE the scrollable area at the bottom */}
            <div className="pt-6 md:pt-8 pb-2">
              <button 
                onClick={onReplay}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <RotateCcw size={18} /> 再来一次
              </button>
           </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ScoreModal;