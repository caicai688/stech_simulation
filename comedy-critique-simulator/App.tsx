
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { History, Music, Settings as SettingsIcon } from 'lucide-react';
import { HistoryItem, EvaluationResult, AppConfig } from './types';
import { evaluateJoke } from './services/geminiService';
import Stage from './components/Stage';
import InputArea from './components/InputArea';
import ScoreModal from './components/ScoreModal';
import HistoryDrawer from './components/HistoryDrawer';
import Settings from './components/Settings';

const App: React.FC = () => {
  // Config State (API Key & Model & Provider)
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('app_config');
    return saved 
        ? JSON.parse(saved) 
        : { provider: 'gemini', apiKey: '', model: 'gemini-3-flash-preview' };
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
      const saved = localStorage.getItem('joke_history');
      return saved ? JSON.parse(saved) : [];
  });
  
  // UI State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false); 

  // Data State
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [danmakuList, setDanmakuList] = useState<string[]>([]);
  
  // Input State (Lifted up to support clearing)
  const [inputText, setInputText] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('joke_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('app_config', JSON.stringify(config));
  }, [config]);

  // Use useCallback to maintain function reference stability
  const handleReviewSubmission = useCallback(async (text: string, image?: string) => {
    setIsEvaluating(true);
    setCurrentResult(null); 
    
    try {
      const result = await evaluateJoke(text, config, image);
      
      // Update State
      setCurrentResult(result);
      setDanmakuList(result.audienceReactions || ["...", "???"]);
      
      // Save to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        input: text,
        image,
        result
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error: any) {
      alert(error.message || "评审失败，请稍后再试。");
      console.error(error);
      setIsEvaluating(false); 
    }
  }, [config]);

  const handleFeedbackComplete = useCallback(() => {
    setIsEvaluating(false);
    setIsScoreModalOpen(true);
  }, []);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setCurrentResult(item.result);
    setIsScoreModalOpen(true);
    setIsHistoryOpen(false);
  }, []);

  const handleReplay = useCallback(() => {
    setInputText('');
    setInputImage(null);
    setIsScoreModalOpen(false);
    setCurrentResult(null);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden font-sans">
      
      {/* Header / Top Controls */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between z-50 pointer-events-none">
        <div className="pointer-events-auto flex gap-2">
           <button 
             onClick={() => setIsHistoryOpen(true)}
             className="p-2 bg-gray-800/80 backdrop-blur rounded-full hover:bg-gray-700 transition-colors border border-gray-600 shadow-lg"
             title="历史记录"
           >
             <History size={20} />
           </button>
           <button 
             onClick={() => setIsPlayingMusic(!isPlayingMusic)}
             className={`p-2 backdrop-blur rounded-full transition-colors border border-gray-600 shadow-lg ${isPlayingMusic ? 'bg-green-600/80 text-white' : 'bg-gray-800/80 text-gray-400'}`}
             title="BGM 开关 (视觉)"
           >
             <Music size={20} />
           </button>
        </div>
        
        <div className="pointer-events-auto">
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="p-2 bg-gray-800/80 backdrop-blur rounded-full hover:bg-gray-700 transition-colors border border-gray-600 text-gray-300 shadow-lg"
             title="设置 API Key & 模型"
           >
             <SettingsIcon size={20} />
           </button>
        </div>
      </header>

      {/* Main Stage Area */}
      <main className="flex-grow relative">
        <Stage 
          currentFeedback={currentResult?.comments || null} 
          danmakuList={danmakuList}
          isEvaluating={isEvaluating}
          onFeedbackComplete={handleFeedbackComplete}
        />
      </main>

      {/* Input Area */}
      <div className="z-40">
        <InputArea 
            onSubmit={handleReviewSubmission} 
            isLoading={isEvaluating}
            onClear={() => { setInputText(''); setInputImage(null); }}
            text={inputText}
            setText={setInputText}
            selectedImage={inputImage}
            setSelectedImage={setInputImage}
        />
      </div>

      {/* Modals & Drawers */}
      <ScoreModal 
        result={currentResult} 
        isOpen={isScoreModalOpen} 
        onClose={() => setIsScoreModalOpen(false)} 
        onReplay={handleReplay}
      />

      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleHistorySelect}
      />

      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={setConfig}
      />
      
      {/* BGM Visual Indicator (Optional) */}
      {isPlayingMusic && (
        <div className="absolute top-20 right-4 text-xs text-green-400 animate-pulse pointer-events-none font-bold drop-shadow-md">
          ♫ Now Playing: Funky Comedy Jam ♫
        </div>
      )}

    </div>
  );
};

export default App;
