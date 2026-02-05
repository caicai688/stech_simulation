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
    <div className="flex-1 bg-gray-800 border-t border-gray-700 p-4 flex flex-col gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] relative z-20">
      
      {/* Quick Actions */}
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
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs md:text-sm text-gray-200 border border-gray-600 transition-colors shadow-sm active:scale-95 transform"
            disabled={isLoading}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input Container */}
      <div className="flex gap-4 max-w-4xl mx-auto w-full h-full">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请开始你的表演... (输入段子或点击上方按钮随机生成)"
            className="w-full h-24 md:h-32 bg-gray-900/60 text-white p-4 rounded-xl border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          {selectedImage && (
            <div className="absolute bottom-2 right-2 w-12 h-12 rounded overflow-hidden border border-gray-500 group">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 justify-between">
           <button
             onClick={() => fileInputRef.current?.click()}
             className="p-3 bg-gray-700 rounded-xl hover:bg-gray-600 text-gray-300 hover:text-white transition-colors border border-gray-600 shadow-md"
             title="上传图片 (Upload Image)"
             disabled={isLoading}
           >
             <Image size={24} />
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
             className={`p-3 rounded-xl flex items-center justify-center transition-all ${
               isLoading 
                 ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                 : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-[0_0_15px_rgba(202,138,4,0.5)]'
             }`}
           >
             {isLoading ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <Send size={24} />
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;