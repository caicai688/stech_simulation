import React, { useRef, useState } from 'react';
import { JokeCategory } from '../types';
import { QUICK_JOKES } from '../constants';
import { Image, Send, Wand2, Trash2 } from 'lucide-react';

interface InputAreaProps {
  onSubmit: (text: string, image?: string) => void;
  isLoading: boolean;
  onClear: () => void;
  text: string;
  setText: (s: string) => void;
  selectedImage: string | null;
  setSelectedImage: (s: string | null) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  onSubmit, isLoading, text, setText, selectedImage, setSelectedImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickJoke = (category: JokeCategory) => {
    const jokes = QUICK_JOKES[category];
    // Filter out the currently displayed text to ensure a new joke is picked if possible
    const availableJokes = jokes.filter(j => j !== text);
    // If we've exhausted options (or only 1 exists), use the full list
    const pool = availableJokes.length > 0 ? availableJokes : jokes;
    
    const randomJoke = pool[Math.floor(Math.random() * pool.length)];
    setText(randomJoke);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && !selectedImage) return;
    onSubmit(text, selectedImage || undefined);
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] relative z-20">
      
      {/* Quick Actions - iOS HIG: 最小触控目标44x44pt */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries({
          brainTeaser: '🧠 脑筋急转弯',
          classic: '📜 经典',
          cold: '🧊 冷笑话',
          pun: '🍎 谐音梗',
          selfDeprecation: '🤡 自嘲',
          meme: '🖼️ 梗图'
        }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleQuickJoke(key as JokeCategory)}
            className="min-h-[44px] px-3 py-2 sm:py-1.5 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full text-xs sm:text-sm text-gray-200 border border-gray-600 transition-colors shadow-sm active:scale-95 transform"
            disabled={isLoading}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input Container - iOS HIG: 响应式布局 */}
      <div className="flex gap-2 sm:gap-3 max-w-4xl mx-auto w-full">
        {/* Text Input - iOS HIG: 适配移动端输入框 */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请开始你的表演... (输入段子或点击上方按钮随机生成)"
            className="w-full h-16 sm:h-20 md:h-24 bg-gray-900/60 text-white p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 resize-none outline-none placeholder-gray-400 text-base"
            disabled={isLoading}
          />
          {selectedImage && (
            <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden border border-gray-500 group">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity min-h-[44px] min-w-[44px]"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        {/* Controls - iOS HIG: 最小触控目标44x44pt */}
        <div className="flex flex-col gap-2 justify-between">
           <button
             onClick={() => fileInputRef.current?.click()}
             className="min-h-[44px] min-w-[44px] p-2.5 sm:p-3 bg-gray-700 rounded-xl hover:bg-gray-600 active:bg-gray-500 text-gray-300 hover:text-white transition-colors border border-gray-600 shadow-md flex items-center justify-center"
             title="上传图片 (Upload Image)"
             disabled={isLoading}
           >
             <Image size={20} className="sm:w-6 sm:h-6" />
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleImageUpload}
           />

           <button
             onClick={handleSubmit}
             disabled={isLoading || (!text && !selectedImage)}
             className={`min-h-[44px] min-w-[44px] p-2.5 sm:p-3 rounded-xl flex items-center justify-center transition-all ${
               isLoading 
                 ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                 : 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white shadow-[0_0_15px_rgba(202,138,4,0.5)]'
             }`}
           >
             {isLoading ? (
               <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <Send size={20} className="sm:w-6 sm:h-6" />
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;