import React, { useState } from 'react';
import { FeedbackType } from '../types';

interface FeedbackButtonsProps {
  judgeId: 'veteran' | 'zoomer' | 'sarah';
  judgeName: string;
  onFeedback: (judgeId: 'veteran' | 'zoomer' | 'sarah', type: FeedbackType) => void;
  currentFeedback?: FeedbackType;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ 
  judgeId, 
  judgeName, 
  onFeedback, 
  currentFeedback 
}) => {
  const [hoveredType, setHoveredType] = useState<FeedbackType>(null);

  const handleClick = (type: FeedbackType) => {
    if (currentFeedback === type) {
      // 如果已经选中，点击取消
      onFeedback(judgeId, null);
    } else {
      onFeedback(judgeId, type);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 mt-2">
      {/* 玫瑰花按钮 - 紧凑版 */}
      <button
        onClick={() => handleClick('rose')}
        onMouseEnter={() => setHoveredType('rose')}
        onMouseLeave={() => setHoveredType(null)}
        className={`
          group relative flex items-center gap-1 px-2 py-1 rounded-lg 
          transition-all duration-300 transform
          ${currentFeedback === 'rose' 
            ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white scale-105' 
            : 'bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-pink-600/30 hover:to-red-600/30 hover:scale-105'
          }
          border ${currentFeedback === 'rose' ? 'border-pink-400' : 'border-gray-600 hover:border-pink-500'}
        `}
        title={`满意 ${judgeName} 的点评`}
      >
        <span className={`text-base transition-transform duration-300 ${hoveredType === 'rose' || currentFeedback === 'rose' ? 'scale-110' : ''}`}>
          🌹
        </span>
        {currentFeedback === 'rose' && (
          <span className="text-xs font-bold">已送</span>
        )}
      </button>

      {/* 鸡蛋按钮 - 紧凑版 */}
      <button
        onClick={() => handleClick('egg')}
        onMouseEnter={() => setHoveredType('egg')}
        onMouseLeave={() => setHoveredType(null)}
        className={`
          group relative flex items-center gap-1 px-2 py-1 rounded-lg 
          transition-all duration-300 transform
          ${currentFeedback === 'egg' 
            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white scale-105' 
            : 'bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-yellow-600/30 hover:to-orange-600/30 hover:scale-105'
          }
          border ${currentFeedback === 'egg' ? 'border-yellow-400' : 'border-gray-600 hover:border-yellow-500'}
        `}
        title={`不满 ${judgeName} 的点评`}
      >
        <span className={`text-base transition-transform duration-300 ${hoveredType === 'egg' || currentFeedback === 'egg' ? 'scale-110' : ''}`}>
          🥚
        </span>
        {currentFeedback === 'egg' && (
          <span className="text-xs font-bold">已扔</span>
        )}
      </button>
    </div>
  );
};

export default FeedbackButtons;
