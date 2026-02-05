import React from 'react';

const StageBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#2a0a0a]">
      {/* 1. Spotlights (CSS Gradients) */}
      {/* Main Center Light - Brightened */}
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150%] h-[200%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,230,200,0.15)_0%,transparent_60%)] pointer-events-none animate-pulse-slow" />
      
      {/* Left Beam - Brightened */}
      <div className="absolute top-[-20%] left-[20%] w-[200px] h-[150%] bg-[linear-gradient(180deg,rgba(120,120,255,0.06)_0%,transparent_70%)] blur-2xl transform -skew-x-12 origin-top pointer-events-none" />
      
      {/* Right Beam - Brightened */}
      <div className="absolute top-[-20%] right-[20%] w-[200px] h-[150%] bg-[linear-gradient(180deg,rgba(255,120,120,0.06)_0%,transparent_70%)] blur-2xl transform skew-x-12 origin-top pointer-events-none" />

      {/* 2. Back Wall / Depth - Lighter */}
      <div className="absolute top-0 left-0 right-0 h-[75%] bg-[#3a1010] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.8)]"></div>

      {/* 3. Stage Floor (Perspective) - Lighter Wood */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[30%] bg-[#5d4037] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        style={{
          clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)",
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 48px, rgba(0,0,0,0.2) 49px, rgba(0,0,0,0.2) 50px)"
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* 4. Proscenium Arch (The Frame) - Richer Red & Gold */}
      {/* Left Pillar */}
      <div className="absolute top-0 left-0 w-[6%] md:w-[10%] h-full bg-gradient-to-r from-[#2a0505] to-[#5a1010] border-r-[6px] border-[#d4af37] shadow-2xl z-20 flex flex-col justify-center gap-10">
         {/* Gold accents on pillar */}
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
      </div>
      
      {/* Right Pillar */}
      <div className="absolute top-0 right-0 w-[6%] md:w-[10%] h-full bg-gradient-to-l from-[#2a0505] to-[#5a1010] border-l-[6px] border-[#d4af37] shadow-2xl z-20 flex flex-col justify-center gap-10">
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
         <div className="w-full h-2 bg-[#d4af37]/40"></div>
      </div>
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full h-[12%] md:h-[15%] bg-gradient-to-b from-[#3a0505] to-[#6a1010] border-b-[6px] border-[#d4af37] z-30 flex justify-center items-end shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
         {/* Decorative Centerpiece - Banner */}
         <div className="px-6 py-2 md:px-10 md:py-3 bg-gradient-to-b from-[#e6b800] to-[#b8860b] rounded-lg translate-y-1/2 shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-[#8B4513] relative">
            {/* Screw accents */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#654321] shadow-inner" />
            
            <div className="text-lg md:text-3xl font-black font-comic text-[#4a0e0e] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)] tracking-widest whitespace-nowrap">
              笑话鉴赏大赛
            </div>
         </div>
      </div>

      {/* 5. Curtains - Brighter Red */}
      {/* Left Drape */}
      <div className="absolute top-[10%] left-0 w-[18%] h-[80%] bg-[#8b0000] z-10 origin-top-left transition-transform duration-1000 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
           style={{ borderRadius: '0 0 80% 0' }}>
         <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.3)_30px,rgba(255,255,255,0.08)_35px)]" />
      </div>
      {/* Right Drape */}
      <div className="absolute top-[10%] right-0 w-[18%] h-[80%] bg-[#8b0000] z-10 origin-top-right shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
           style={{ borderRadius: '0 0 0 80%' }}>
         <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.3)_30px,rgba(255,255,255,0.08)_35px)]" />
      </div>
      
      {/* Top Valance (Scalloped) */}
      <div className="absolute top-[12%] md:top-[15%] left-0 w-full h-[8%] z-10 flex">
         {[...Array(12)].map((_, i) => (
           <div key={i} className="flex-1 bg-[#8b0000] rounded-b-full shadow-[inset_0_-5px_10px_rgba(0,0,0,0.5)] border-b border-[#5a0000] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.2))]" />
           </div>
         ))}
      </div>

      {/* 6. Dust Particles (CSS Animation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
         {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full opacity-30 animate-float"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
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
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StageBackground;
