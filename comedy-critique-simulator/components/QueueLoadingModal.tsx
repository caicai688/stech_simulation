import React, { useEffect, useState } from 'react';

interface QueueLoadingModalProps {
  isOpen: boolean;
}

const funnyMessages = [
  "正在后台帮您挠模型的痒痒肉...",
  "AI 导师正在抽烟思考中... 💭",
  "模型在做深蹲热身，马上来...",
  "正在贿赂 GPU 插队... 🎰",
  "导师在数观众人数... 1, 2, 3...",
  "AI 正在回忆上个段子为啥扣了一分...",
  "模型卡在厕所了，正在解决中... 🚽",
  "正在给 AI 泡咖啡提神... ☕",
  "导师在翻找她的黑框眼镜...",
  "模型正在重新理解什么叫幽默..."
];

const QueueLoadingModal: React.FC<QueueLoadingModalProps> = ({ isOpen }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  // 每 2 秒切换一条搞笑消息
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // 动态的省略号效果
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border-4 border-yellow-500 animate-slideUp">
        
        {/* 搞笑图标动画 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 旋转的笑脸 */}
            <div className="text-7xl animate-spin-slow">
              🤡
            </div>
            {/* 周围的小星星 */}
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-150">⭐</div>
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-3xl font-black text-center mb-4 text-yellow-300 drop-shadow-lg">
          🎪 排队中 🎪
        </h2>

        {/* 搞笑消息 */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 min-h-[80px] flex items-center justify-center">
          <p className="text-white text-lg font-bold text-center leading-relaxed">
            {funnyMessages[messageIndex]}{dots}
          </p>
        </div>

        {/* 进度条动画 */}
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-loading-bar"></div>
        </div>

        {/* 提示文字 */}
        <p className="text-yellow-200 text-sm text-center font-medium">
          由于并发量较高，我们正在为您排队处理<br/>
          <span className="text-yellow-400 font-bold">每 2 秒自动重试一次</span>
        </p>

        {/* 跳动的小人 */}
        <div className="flex justify-center mt-6 gap-2">
          <span className="text-2xl animate-bounce">🎭</span>
          <span className="text-2xl animate-bounce delay-100">🎪</span>
          <span className="text-2xl animate-bounce delay-200">🎨</span>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-150 {
          animation-delay: 0.15s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default QueueLoadingModal;
