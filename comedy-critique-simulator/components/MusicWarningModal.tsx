import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicWarningModalProps {
  isOpen: boolean;
  onConfirm: (enableMusic: boolean) => void;
}

const MusicWarningModal: React.FC<MusicWarningModalProps> = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-yellow-500/30 animate-scale-in">
        
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Volume2 size={36} className="text-yellow-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-4 font-comic">
          ⚠️ 慎点警告 ⚠️
        </h2>

        {/* Content */}
        <div className="text-center mb-6 space-y-3">
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            本页面配有<span className="text-red-400 font-bold">极度癫狂</span>的背景音乐
          </p>
          <p className="text-gray-300 text-sm sm:text-base">
            🎵 可能引起：<br/>
            <span className="text-yellow-300">笑到失控 • 魔性洗脑 • 循环上头</span>
          </p>
          <p className="text-gray-400 text-xs sm:text-sm italic">
            建议戴上耳机，独自享受这份快乐 😈
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onConfirm(false)}
            className="flex-1 min-h-[48px] px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 border border-gray-600"
          >
            <VolumeX size={20} />
            静音开始
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="flex-1 min-h-[48px] px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-500 hover:to-red-500 active:from-yellow-700 active:to-red-700 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.5)] border border-yellow-500/50"
          >
            <Volume2 size={20} />
            我已准备好
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-4">
          💡 你可以随时点击左上角音乐图标开关BGM
        </p>
      </div>
    </div>
  );
};

export default MusicWarningModal;
