import React from 'react';

const StageBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#2a0a0a]">
      {/* 1. Spotlights (CSS Gradients) */}
      {/* Main Center Light - Brightened with Golden Hue */}
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150%] h-[200%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.12)_0%,transparent_60%)] pointer-events-none animate-pulse-slow" />
      
      {/* Left Beam - Golden */}
      <div className="absolute top-[-20%] left-[20%] w-[200px] h-[150%] bg-[linear-gradient(180deg,rgba(255,200,100,0.08)_0%,transparent_70%)] blur-2xl transform -skew-x-12 origin-top pointer-events-none" />
      
      {/* Right Beam - Golden */}
      <div className="absolute top-[-20%] right-[20%] w-[200px] h-[150%] bg-[linear-gradient(180deg,rgba(255,200,100,0.08)_0%,transparent_70%)] blur-2xl transform skew-x-12 origin-top pointer-events-none" />

      {/* 2. Back Wall / Depth - Warmer Red */}
      <div className="absolute top-0 left-0 right-0 h-[75%] bg-[#4a1010] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.8)]"></div>

      {/* 3. Stage Floor (Perspective) - Warmer Wood */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[30%] bg-[#6d4037] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        style={{
          clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)",
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 48px, rgba(0,0,0,0.2) 49px, rgba(0,0,0,0.2) 50px)"
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* 春节装饰：红灯笼 */}
      {/* Left Lantern */}
      <div className="absolute top-[15%] left-[8%] md:left-[12%] z-25 animate-swing">
        <div className="w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-16 bg-gradient-to-b from-red-600 to-red-700 rounded-[40%] shadow-xl relative border-2 border-red-800">
          {/* Lantern Top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-yellow-600 rounded-t-lg" />
          {/* Lantern Bottom Tassel */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-yellow-500" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-600 rounded-full" />
          {/* 福字 */}
          <div className="absolute inset-0 flex items-center justify-center text-yellow-400 font-black text-xs md:text-sm">福</div>
        </div>
      </div>
      
      {/* Right Lantern */}
      <div className="absolute top-[15%] right-[8%] md:right-[12%] z-25 animate-swing" style={{ animationDelay: '0.3s' }}>
        <div className="w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-16 bg-gradient-to-b from-red-600 to-red-700 rounded-[40%] shadow-xl relative border-2 border-red-800">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-yellow-600 rounded-t-lg" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-yellow-500" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-600 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center text-yellow-400 font-black text-xs md:text-sm">春</div>
        </div>
      </div>

      {/* 春节装饰：中国结 (小型，两侧) */}
      <div className="absolute top-[35%] left-[10%] z-25 opacity-80">
        <div className="w-4 h-6 sm:w-5 sm:h-8 bg-red-600 rotate-45 rounded-sm shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 opacity-70" />
        </div>
      </div>
      <div className="absolute top-[35%] right-[10%] z-25 opacity-80">
        <div className="w-4 h-6 sm:w-5 sm:h-8 bg-red-600 rotate-45 rounded-sm shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 opacity-70" />
        </div>
      </div>

      {/* 4. Proscenium Arch (The Frame) - Richer Red & Gold */}
      {/* Left Pillar */}
      <div className="absolute top-0 left-0 w-[6%] md:w-[10%] h-full bg-gradient-to-r from-[#3a0505] to-[#6a1010] border-r-[6px] border-[#d4af37] shadow-2xl z-20 flex flex-col justify-center gap-10">
         {/* Gold accents on pillar */}
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
      </div>
      
      {/* Right Pillar */}
      <div className="absolute top-0 right-0 w-[6%] md:w-[10%] h-full bg-gradient-to-l from-[#3a0505] to-[#6a1010] border-l-[6px] border-[#d4af37] shadow-2xl z-20 flex flex-col justify-center gap-10">
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
         <div className="w-full h-2 bg-[#d4af37]/50"></div>
      </div>
      
      {/* Top Header - iOS 安全区域适配 */}
      <div className="absolute left-0 w-full h-[12%] md:h-[15%] bg-gradient-to-b from-[#4a0505] to-[#7a1010] border-b-[6px] border-[#d4af37] z-30 flex justify-center items-end shadow-[0_10px_30px_rgba(0,0,0,0.6)]" 
           style={{ top: 'max(0px, env(safe-area-inset-top))' }}>
         {/* Decorative Centerpiece - Banner */}
         <div className="px-6 py-2 md:px-10 md:py-3 bg-gradient-to-b from-[#e6b800] to-[#c8960b] rounded-lg translate-y-1/2 shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-[#8B4513] relative">
            {/* Screw accents */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            
            <div className="text-base sm:text-lg md:text-3xl font-black font-comic text-[#4a0e0e] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)] tracking-widest whitespace-nowrap">
              段子鉴赏大赛
            </div>
         </div>
      </div>

      {/* 5. Curtains - Chinese Red */}
      {/* Left Drape */}
      <div className="absolute top-[10%] left-0 w-[18%] h-[80%] bg-gradient-to-r from-red-700 to-red-600 z-10 origin-top-left transition-transform duration-1000 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
           style={{ borderRadius: '0 0 80% 0' }}>
         <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.2)_30px,rgba(255,215,0,0.1)_35px)]" />
      </div>
      {/* Right Drape */}
      <div className="absolute top-[10%] right-0 w-[18%] h-[80%] bg-gradient-to-l from-red-700 to-red-600 z-10 origin-top-right shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
           style={{ borderRadius: '0 0 0 80%' }}>
         <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.2)_30px,rgba(255,215,0,0.1)_35px)]" />
      </div>
      
      {/* Top Valance (Scalloped) - iOS 安全区域适配 */}
      <div className="absolute left-0 w-full h-[8%] z-10 flex" 
           style={{ top: 'calc(max(0px, env(safe-area-inset-top)) + 12%)' }}>
         {[...Array(12)].map((_, i) => (
           <div key={i} className="flex-1 bg-gradient-to-b from-red-700 to-red-600 rounded-b-full shadow-[inset_0_-5px_10px_rgba(0,0,0,0.5)] border-b border-red-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.2))]" />
           </div>
         ))}
      </div>

      {/* 6. Golden Particles (春节金粉效果) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
         {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-40 animate-float"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFA500' : '#FFFFFF',
                animationDuration: Math.random() * 10 + 15 + 's',
                animationDelay: '-' + Math.random() * 20 + 's',
              }}
            />
         ))}
      </div>

      {/* Keyframes style injection */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default StageBackground;
