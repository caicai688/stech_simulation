import React, { useEffect, useState } from 'react';
import { JUDGES } from '../constants';
import { JudgeComment } from '../types';
import StageBackground from './StageBackground';

interface StageProps {
  currentFeedback: JudgeComment[] | null;
  danmakuList: string[];
  isEvaluating: boolean;
  onFeedbackComplete?: () => void;
}

const DANMAKU_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#facc15', // Yellow
  '#4ade80', // Green
  '#22d3ee', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f472b6', // Pink
  '#ffffff', // White
];

// Generic filler text to bulk up the danmaku if the AI returns too few
const FILLER_DANMAKU = [
  '哈哈哈', '666', '笑死我了', '好活', '这就叫专业', 
  '233333', '?', '妙啊', '这是人能想出来的？', '有点东西',
  '下次一定', '这不得S级？', '一般货色', '严师太严了'
];

const Stage: React.FC<StageProps> = ({ currentFeedback, danmakuList, isEvaluating, onFeedbackComplete }) => {
  const [typedFeedback, setTypedFeedback] = useState<{ [key: string]: string }>({});
  const [visibleDanmaku, setVisibleDanmaku] = useState<{ id: string; text: string; top: number; duration: number; delay: number; color: string }[]>([]);

  // Typing effect logic & Completion Callback
  useEffect(() => {
    if (!currentFeedback) {
      setTypedFeedback({});
      return;
    }

    setTypedFeedback({});
    
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let accumulateDelay = 0;
    
    // Sort logic if needed, but assuming currentFeedback order is the sequence
    const sequence = currentFeedback; 

    sequence.forEach((feedback, index) => {
      const startDelay = accumulateDelay;
      const content = feedback.content;
      // Faster typing speed: 30ms -> 20ms
      const typingDuration = content.length * 20; 
      // Reading pause after typing finishes before next starts: 1500ms
      const pauseDuration = 1500;
      
      accumulateDelay += typingDuration + pauseDuration;

      // Start typing for this judge
      timeouts.push(setTimeout(() => {
         let currentText = "";
         const chars = content.split('');
         chars.forEach((char, charIndex) => {
           timeouts.push(setTimeout(() => {
             setTypedFeedback(prev => ({
               ...prev,
               [feedback.judgeId]: (prev[feedback.judgeId] || "") + char
             }));
           }, charIndex * 20));
         });
      }, startDelay));
    });

    // Trigger completion after the *entire* sequence plus a small buffer
    const totalDuration = accumulateDelay;
    timeouts.push(setTimeout(() => {
      if (onFeedbackComplete) {
        onFeedbackComplete();
      }
    }, totalDuration));

    return () => timeouts.forEach(clearTimeout);
  }, [currentFeedback, onFeedbackComplete]);

  // Danmaku logic
  useEffect(() => {
    if (danmakuList.length > 0) {
      // 1. Expand the list to ensure density (Target at least 25 items)
      let expandedList = [...danmakuList];
      
      // Duplicate original AI comments to make them more visible
      if (expandedList.length < 10) {
         expandedList = [...expandedList, ...expandedList]; 
      }

      // Add fillers until we reach a good amount
      while (expandedList.length < 25) {
        const randomFiller = FILLER_DANMAKU[Math.floor(Math.random() * FILLER_DANMAKU.length)];
        expandedList.push(randomFiller);
      }

      // 2. Map to objects with randomized properties
      const newDanmaku = expandedList.map((text, i) => ({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`, // Robust ID
        text,
        top: Math.random() * 65 + 5, // Top 5% to 70% of screen (more spread out)
        // Slower duration: 12s to 22s (was 5-10s)
        duration: Math.random() * 10 + 12,
        // Staggered start: 0s to 8s delay
        delay: Math.random() * 8, 
        color: DANMAKU_COLORS[Math.floor(Math.random() * DANMAKU_COLORS.length)]
      }));
      
      setVisibleDanmaku(newDanmaku);
      
      // Cleanup after max duration + max delay
      const timer = setTimeout(() => {
        setVisibleDanmaku([]);
      }, 30000); 
      return () => clearTimeout(timer);
    }
  }, [danmakuList]);

  // Character Components (Color Block Style) - iOS HIG: 适配移动端尺寸
  const VeteranAvatar = () => (
    <div className="flex flex-col items-center animate-bounce-slow">
       {/* Hat */}
       <div className="w-8 h-5 sm:w-12 sm:h-6 md:w-16 md:h-8 bg-gray-600 rounded-t-lg mb-[-2px] z-10" />
       {/* Head */}
       <div className="w-10 h-8 sm:w-14 sm:h-12 md:w-20 md:h-16 bg-[#e6b880] rounded-lg relative flex justify-center items-center shadow-lg border-2 border-black/20">
          <div className="flex gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-black rounded-sm opacity-80" />
            <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-black rounded-sm opacity-80" />
          </div>
          <div className="absolute bottom-1 sm:bottom-2 w-4 sm:w-6 h-0.5 sm:h-1 bg-white/50 rounded-full" /> {/* Mustache */}
       </div>
       {/* Body */}
       <div className="w-14 h-16 sm:w-20 sm:h-24 md:w-28 md:h-32 bg-slate-700 rounded-t-xl mt-[-5px] relative">
          <div className="absolute top-0 w-full h-full flex justify-center">
             <div className="w-3 sm:w-4 h-full bg-slate-500" /> {/* Tie area */}
          </div>
       </div>
    </div>
  );

  const SarahAvatar = () => (
    <div className="flex flex-col items-center transform scale-105">
      {/* Head with Hair */}
      <div className="relative w-12 h-16 sm:w-16 sm:h-20 md:w-24 md:h-32 flex flex-col items-center">
        {/* Hair - 黑色齐肩发 */}
        <div className="absolute top-0 w-full h-[70%] bg-[#2a2a2a] rounded-[50%_50%_40%_40%] z-0" />
        
        {/* Face - 简化圆脸 */}
        <div className="absolute top-[18%] w-[75%] h-[60%] bg-[#f5d3b8] rounded-full z-10 flex flex-col items-center justify-center">
          {/* Glasses - 简化黑框眼镜 */}
          <div className="absolute top-[35%] flex gap-1 sm:gap-1.5">
            {/* Left Lens */}
            <div className="w-4 h-3 sm:w-6 sm:h-4 md:w-8 md:h-5 rounded-lg border-2 border-black bg-white/30" />
            {/* Right Lens */}
            <div className="w-4 h-3 sm:w-6 sm:h-4 md:w-8 md:h-5 rounded-lg border-2 border-black bg-white/30" />
          </div>
          
          {/* Mouth - 简化直线嘴 */}
          <div className="absolute top-[70%] w-4 sm:w-6 md:w-8 h-[2px] bg-black/50" />
        </div>
      </div>
      
      {/* Body - 简化职业套装 */}
      <div className="w-10 h-16 sm:w-14 sm:h-22 md:w-20 md:h-28 bg-gray-800 rounded-t-lg mt-[-4px] relative">
        {/* Collar - 简化V领 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white" />
      </div>
    </div>
  );

  const ZoomerAvatar = () => (
    <div className="relative w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 flex items-end justify-center">
       {/* Floating Elements */}
       <div className="absolute top-0 left-1 sm:left-2 w-5 h-5 sm:w-8 sm:h-8 bg-pink-500 rounded-full mix-blend-screen animate-bounce opacity-80" />
       <div className="absolute top-2 sm:top-4 right-1 sm:right-2 w-6 h-6 sm:w-10 sm:h-10 bg-green-400 rounded-tr-3xl animate-pulse opacity-80" />
       
       {/* Main Body */}
       <div className="w-12 h-14 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-purple-600 rounded-xl rotate-3 transform shadow-lg relative z-10 border-2 border-white/20">
          <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-8 sm:h-12 bg-yellow-300 rounded-full" /> {/* Head */}
          <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-10 sm:w-14 h-3 sm:h-4 bg-black rounded-full" /> {/* Headphones */}
          <div className="absolute top-2 sm:top-4 w-full flex justify-center text-[8px] sm:text-xs font-bold text-white">VIBE</div>
       </div>
    </div>
  );

  const renderJudge = (id: string, align: 'left' | 'center' | 'right') => {
    const feedback = currentFeedback?.find(f => f.judgeId === id);
    const typedText = typedFeedback[id] || "";
    // Only show bubble if there is text or if it was the last one speaking
    const shouldShowBubble = typedText.length > 0;
    
    // Avatar Selection
    let AvatarComponent = VeteranAvatar;
    if (id === 'sarah') AvatarComponent = SarahAvatar;
    if (id === 'zoomer') AvatarComponent = ZoomerAvatar;

    // iOS HIG 规范：移动端气泡布局优化，避免重叠
    // 在移动端使用垂直堆叠布局，在大屏使用水平布局
    let bubblePositionClasses = '';
    let tailPositionClasses = '';

    if (align === 'left') {
        // Veteran: 移动端向上偏移更多，桌面端右侧
        bubblePositionClasses = 'bottom-[140px] md:bottom-[180px] left-0 md:left-[50%] origin-bottom-left';
        tailPositionClasses = 'left-6'; 
    } else if (align === 'center') {
        // Sarah: 移动端居中且更高，避免与左右重叠
        bubblePositionClasses = 'bottom-[200px] md:bottom-[180px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[55%] origin-bottom';
        tailPositionClasses = 'left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6';
    } else {
        // Zoomer: 移动端右侧且最高，桌面端右对齐
        bubblePositionClasses = 'bottom-[140px] md:bottom-[180px] right-0 origin-bottom-right';
        tailPositionClasses = 'right-6';
    }

    return (
      <div className={`flex flex-col items-center justify-end relative h-full w-1/3 px-1 md:px-2 ${isEvaluating ? 'opacity-90' : ''}`}>
        
        {/* Speech Bubble - iOS HIG: 优化间距和尺寸 */}
        <div className={`
            absolute z-20 transition-all duration-300
            ${shouldShowBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            ${bubblePositionClasses}
            w-auto max-w-[160px] sm:max-w-[200px] md:max-w-[320px] min-w-[140px] sm:min-w-[160px]
        `}>
          <div className={`
              inline-block bg-white text-black p-3 sm:p-4 md:p-5 rounded-2xl md:rounded-3xl 
              shadow-[0_8px_24px_rgba(0,0,0,0.25)] md:shadow-[0_10px_30px_rgba(0,0,0,0.3)] 
              border-2 md:border-4 border-gray-800 font-comic
              text-xs sm:text-sm md:text-lg leading-relaxed
              max-h-[120px] sm:max-h-[140px] md:max-h-[200px] overflow-y-auto custom-scrollbar
              w-full text-left
          `}>
             {feedback?.reaction && (
              <div className="text-[10px] sm:text-xs text-gray-500 italic mb-1.5 sm:mb-2 border-b border-gray-200 pb-1">
                 {feedback.reaction}
              </div>
            )}
            <p className="whitespace-pre-wrap">{typedText}</p>
            {/* Tail - iOS HIG: 适配移动端 */}
            <div className={`
                absolute -bottom-2 md:-bottom-3 w-4 h-4 md:w-6 md:h-6 bg-white rotate-45 
                border-b-2 border-r-2 md:border-b-4 md:border-r-4 border-gray-800
                ${tailPositionClasses}
            `}></div>
          </div>
        </div>

        {/* Character - iOS HIG: 触控目标至少44x44pt */}
        <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 active:scale-95 origin-bottom min-h-[44px] flex flex-col items-center justify-end">
           <AvatarComponent />
           
           {/* Name Plate - iOS HIG: 文字大小和间距 */}
           <div className="mt-2 md:mt-4 bg-black/80 text-yellow-400 px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-bold border border-yellow-500 shadow-lg text-center whitespace-nowrap">
             {JUDGES[id].name.split(' ')[0]} 
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
       {/* Background */}
       <StageBackground />

       {/* Danmaku Layer */}
       <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
         {visibleDanmaku.map(item => (
           <div 
            key={item.id} 
            className="danmaku-item text-base sm:text-xl md:text-3xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ 
              top: `${item.top}%`, 
              color: item.color,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`
            }}
           >
             {item.text}
           </div>
         ))}
       </div>

       {/* Judges Container - iOS HIG: 边距和间距优化 */}
       <div className="flex-1 flex items-end justify-center pb-4 sm:pb-6 md:pb-8 px-2 sm:px-4 w-full max-w-6xl mx-auto z-10 gap-1 sm:gap-2 md:gap-12">
         {renderJudge('veteran', 'left')}
         {renderJudge('sarah', 'center')}
         {renderJudge('zoomer', 'right')}
       </div>
    </div>
  );
};

export default Stage;