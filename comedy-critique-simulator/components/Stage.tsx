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

  // Character Components (Color Block Style)
  const VeteranAvatar = () => (
    <div className="flex flex-col items-center animate-bounce-slow">
       {/* Hat */}
       <div className="w-12 h-6 md:w-16 md:h-8 bg-gray-600 rounded-t-lg mb-[-2px] z-10" />
       {/* Head */}
       <div className="w-14 h-12 md:w-20 md:h-16 bg-[#e6b880] rounded-lg relative flex justify-center items-center shadow-lg border-2 border-black/20">
          <div className="flex gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded-sm opacity-80" />
            <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded-sm opacity-80" />
          </div>
          <div className="absolute bottom-2 w-6 h-1 bg-white/50 rounded-full" /> {/* Mustache */}
       </div>
       {/* Body */}
       <div className="w-20 h-24 md:w-28 md:h-32 bg-slate-700 rounded-t-xl mt-[-5px] relative">
          <div className="absolute top-0 w-full h-full flex justify-center">
             <div className="w-4 h-full bg-slate-500" /> {/* Tie area */}
          </div>
       </div>
    </div>
  );

  const SarahAvatar = () => (
    <div className="flex flex-col items-center transform scale-105">
      {/* Hair/Head */}
      <div className="w-14 h-28 md:w-20 md:h-40 bg-indigo-800 rounded-full relative flex flex-col items-center overflow-hidden border-2 border-indigo-900 shadow-xl">
         <div className="w-full h-1/3 bg-indigo-900 absolute top-0" /> {/* Bangs */}
         <div className="mt-10 flex gap-2 z-10">
            <div className="w-4 h-2 bg-white/90 rounded-sm border border-black" />
            <div className="w-1 bg-black h-1 mt-1" />
            <div className="w-4 h-2 bg-white/90 rounded-sm border border-black" />
         </div>
         <div className="mt-4 w-6 h-[2px] bg-red-400" /> {/* Mouth */}
      </div>
      {/* Body */}
      <div className="w-12 h-20 md:w-16 md:h-24 bg-gray-100 rounded-t-lg mt-[-10px] z-[-1] relative">
         <div className="absolute top-0 left-0 w-full h-full border-x-8 border-black" /> {/* Blazer */}
      </div>
    </div>
  );

  const ZoomerAvatar = () => (
    <div className="relative w-24 h-32 md:w-32 md:h-40 flex items-end justify-center">
       {/* Floating Elements */}
       <div className="absolute top-0 left-2 w-8 h-8 bg-pink-500 rounded-full mix-blend-screen animate-bounce opacity-80" />
       <div className="absolute top-4 right-2 w-10 h-10 bg-green-400 rounded-tr-3xl animate-pulse opacity-80" />
       
       {/* Main Body */}
       <div className="w-16 h-20 md:w-20 md:h-24 bg-purple-600 rounded-xl rotate-3 transform shadow-lg relative z-10 border-2 border-white/20">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-300 rounded-full" /> {/* Head */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full" /> {/* Headphones */}
          <div className="absolute top-4 w-full flex justify-center text-xs font-bold text-white">VIBE</div>
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

    // Determine Bubble Position based on request "put comments on the right side"
    // Left & Center Judges: Push bubble to the right of the avatar.
    // Right Judge: Keep right aligned to avoid overflow.
    let bubblePositionClasses = '';
    let tailPositionClasses = '';

    if (align === 'left') {
        // Veteran: Shift bubble to right, tail points bottom-left
        bubblePositionClasses = 'left-[30%] md:left-[50%] origin-bottom-left text-left';
        tailPositionClasses = 'left-6'; 
    } else if (align === 'center') {
        // Sarah: Shift bubble right of center, tail points bottom-left
        bubblePositionClasses = 'left-[45%] md:left-[55%] origin-bottom-left text-left';
        tailPositionClasses = 'left-6';
    } else {
        // Zoomer: Right aligned (can't go further right), tail points bottom-right
        bubblePositionClasses = 'right-0 origin-bottom-right text-right';
        tailPositionClasses = 'right-8';
    }

    return (
      <div className={`flex flex-col items-center justify-end relative h-full w-1/3 px-2 ${isEvaluating ? 'opacity-90' : ''}`}>
        
        {/* Speech Bubble - Lowered bottom value */}
        <div className={`
            absolute bottom-[100px] md:bottom-[150px] z-20 transition-all duration-300
            ${shouldShowBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            ${bubblePositionClasses}
            w-auto max-w-[280px] md:max-w-[350px] min-w-[180px]
        `}>
          <div className={`
              inline-block bg-white text-black p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-4 border-gray-800 font-comic
              text-sm md:text-lg leading-snug
              max-h-[160px] md:max-h-[200px] overflow-y-auto custom-scrollbar
              w-full text-left
          `}>
             {feedback?.reaction && (
              <div className="text-xs text-gray-500 italic mb-2 border-b border-gray-200 pb-1 sticky top-0 bg-white">
                 {feedback.reaction}
              </div>
            )}
            <p className="whitespace-pre-wrap">{typedText}</p>
            {/* Tail */}
            <div className={`
                absolute -bottom-3 w-6 h-6 bg-white rotate-45 border-b-4 border-r-4 border-gray-800
                ${tailPositionClasses}
            `}></div>
          </div>
        </div>

        {/* Character */}
        <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 origin-bottom">
           <AvatarComponent />
           
           {/* Name Plate */}
           <div className="mt-4 bg-black/80 text-yellow-400 px-3 py-1 rounded-full text-xs md:text-sm font-bold border border-yellow-500 shadow-lg text-center whitespace-nowrap">
             {JUDGES[id].name.split(' ')[0]} 
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[65vh] overflow-hidden flex flex-col">
       {/* Background */}
       <StageBackground />

       {/* Danmaku Layer */}
       <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
         {visibleDanmaku.map(item => (
           <div 
            key={item.id} 
            className="danmaku-item text-xl md:text-3xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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

       {/* Judges Container */}
       <div className="flex-1 flex items-end justify-center pb-8 px-4 w-full max-w-6xl mx-auto z-10 gap-2 md:gap-12">
         {renderJudge('veteran', 'left')}
         {renderJudge('sarah', 'center')}
         {renderJudge('zoomer', 'right')}
       </div>
    </div>
  );
};

export default Stage;