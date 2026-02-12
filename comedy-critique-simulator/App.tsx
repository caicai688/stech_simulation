
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { History, Music, Settings as SettingsIcon, Activity } from 'lucide-react';
import { HistoryItem, EvaluationResult, AppConfig, JudgeFeedback } from './types';
import { evaluateJoke } from './services/geminiService';
import Stage from './components/Stage';
import InputArea from './components/InputArea';
import ScoreModal from './components/ScoreModal';
import HistoryDrawer from './components/HistoryDrawer';
import Settings from './components/Settings';
import BGMPlayer from './components/BGMPlayer';
import MusicWarningModal from './components/MusicWarningModal';
import SchedulerDebugPanel from './components/SchedulerDebugPanel';
import QueueLoadingModal from './components/QueueLoadingModal';

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
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showMusicWarning, setShowMusicWarning] = useState(false);
  const [showQueueLoading, setShowQueueLoading] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(() => {
    return localStorage.getItem('has_submitted_joke') === 'true';
  }); 

  // Data State
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [currentEvaluationId, setCurrentEvaluationId] = useState<string | null>(null); // 当前评审ID
  const [danmakuList, setDanmakuList] = useState<string[]>([]);
  
  // Input State (Lifted up to support clearing)
  const [inputText, setInputText] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);

  // 重试状态
  const [retryCount, setRetryCount] = useState(0);
  const [pendingRequest, setPendingRequest] = useState<{text: string, image?: string} | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('joke_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('app_config', JSON.stringify(config));
  }, [config]);

  // 自动重试逻辑
  useEffect(() => {
    if (!showQueueLoading || !pendingRequest) return;

    const retryTimer = setTimeout(async () => {
      console.log(`[App] 自动重试第 ${retryCount + 1} 次...`);
      setRetryCount(prev => prev + 1);
      
      try {
        const result = await evaluateJoke(
          pendingRequest.text, 
          config, 
          pendingRequest.image,
          () => {
            // 排队回调 - 保持显示排队动画
            console.log('[App] 仍在排队中...');
          }
        );
        
        // 成功获取结果，关闭排队动画
        setShowQueueLoading(false);
        setPendingRequest(null);
        setRetryCount(0);
        
        // 更新结果
        setCurrentResult(result);
        setDanmakuList(result.audienceReactions || ["...", "???"]);
        
        // 保存历史
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          input: pendingRequest.text,
          image: pendingRequest.image,
          result
        };
        setHistory(prev => [newHistoryItem, ...prev]);
        
      } catch (error: any) {
        console.error('[App] 重试失败:', error);
        // 继续重试，不关闭排队动画
      }
    }, 2000); // 每 2 秒重试一次

    return () => clearTimeout(retryTimer);
  }, [showQueueLoading, pendingRequest, retryCount, config, setHistory]);

  // Use useCallback to maintain function reference stability
  const handleReviewSubmission = useCallback(async (text: string, image?: string) => {
    // 首次提交时显示音乐警告
    if (!hasSubmittedOnce) {
      setShowMusicWarning(true);
      // 保存待处理的提交
      (window as any).__pendingSubmission = { text, image };
      return;
    }

    setIsEvaluating(true);
    setCurrentResult(null);
    setCurrentEvaluationId(null); // 重置评审ID
    
    try {
      const result = await evaluateJoke(text, config, image, () => {
        // 触发排队回调
        console.log('[App] 检测到排队状态');
        setShowQueueLoading(true);
        setPendingRequest({ text, image });
      }, history); // 传递历史记录用于反馈指导
      
      // 如果直接成功（没有排队），更新状态
      const evaluationId = Date.now().toString();
      setCurrentResult(result);
      setCurrentEvaluationId(evaluationId);
      setDanmakuList(result.audienceReactions || ["...", "???"]);
      
      // Save to History (without feedback initially)
      const newHistoryItem: HistoryItem = {
        id: evaluationId,
        timestamp: Date.now(),
        input: text,
        image,
        result,
        feedbacks: [] // 初始为空数组（每个导师都没有反馈）
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error: any) {
      alert(error.message || "评审失败，请稍后再试。");
      console.error(error);
      setIsEvaluating(false); 
      setShowQueueLoading(false);
      setPendingRequest(null);
    }
  }, [config, hasSubmittedOnce, history]);

  // 处理音乐按钮点击
  const handleMusicToggle = useCallback(() => {
    // 如果首次使用且要开启音乐，显示警告
    if (!hasSubmittedOnce && !isPlayingMusic) {
      setShowMusicWarning(true);
      return;
    }
    // 已经看过警告，直接切换
    setIsPlayingMusic(!isPlayingMusic);
  }, [hasSubmittedOnce, isPlayingMusic]);

  // 处理音乐警告确认
  const handleMusicWarningConfirm = useCallback((enableMusic: boolean) => {
    setShowMusicWarning(false);
    setIsPlayingMusic(enableMusic);
    setHasSubmittedOnce(true);
    localStorage.setItem('has_submitted_joke', 'true');

    // 执行之前待处理的提交
    const pending = (window as any).__pendingSubmission;
    if (pending) {
      delete (window as any).__pendingSubmission;
      // 使用 setTimeout 确保状态更新后再提交
      setTimeout(() => {
        handleReviewSubmission(pending.text, pending.image);
      }, 100);
    }
  }, [handleReviewSubmission]);

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
    setCurrentEvaluationId(null);
  }, []);

  // 处理玩家反馈（按导师独立）
  const handleFeedback = useCallback((judgeId: 'veteran' | 'zoomer' | 'sarah', type: 'rose' | 'egg' | null) => {
    if (!currentEvaluationId) return;

    setHistory(prev => prev.map(item => {
      if (item.id === currentEvaluationId) {
        const currentFeedbacks = item.feedbacks || [];
        
        // 移除该导师的旧反馈
        const filteredFeedbacks = currentFeedbacks.filter(f => f.judgeId !== judgeId);
        
        // 如果 type 不为 null，添加新反馈
        const newFeedbacks = type 
          ? [...filteredFeedbacks, { judgeId, type, timestamp: Date.now() }]
          : filteredFeedbacks;
        
        return {
          ...item,
          feedbacks: newFeedbacks
        };
      }
      return item;
    }));

    const judgeName = judgeId === 'veteran' ? '老炮儿·严师' : judgeId === 'zoomer' ? 'Gen-Z 冲浪手' : '冷脸导师豆豆';
    const emoji = type === 'rose' ? '🌹' : type === 'egg' ? '🥚' : '❌';
    console.log(`[Feedback] 对 ${judgeName} 的反馈: ${emoji}`);
  }, [currentEvaluationId]);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gray-900 text-white overflow-hidden font-sans">
      
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
             onClick={handleMusicToggle}
             className={`p-2 backdrop-blur rounded-full transition-colors border border-gray-600 shadow-lg ${isPlayingMusic ? 'bg-green-600/80 text-white' : 'bg-gray-800/80 text-gray-400'}`}
             title="BGM 开关"
           >
             <Music size={20} />
           </button>
        </div>
        
        <div className="pointer-events-auto">
           <button 
             onClick={() => setIsDebugOpen(true)}
             className="p-2 bg-gray-800/80 backdrop-blur rounded-full hover:bg-gray-700 transition-colors border border-gray-600 text-green-400 shadow-lg mr-2"
             title="调度器监控"
           >
             <Activity size={20} />
           </button>
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="p-2 bg-gray-800/80 backdrop-blur rounded-full hover:bg-gray-700 transition-colors border border-gray-600 text-gray-300 shadow-lg"
             title="设置 API Key & 模型"
           >
             <SettingsIcon size={20} />
           </button>
        </div>
      </header>

      {/* Main Stage Area - 固定高度，消除中间空白 */}
      <main className="flex-shrink-0" style={{ height: 'calc(100dvh - 220px)' }}>
        <Stage 
          currentFeedback={currentResult?.comments || null} 
          danmakuList={danmakuList}
          isEvaluating={isEvaluating}
          onFeedbackComplete={handleFeedbackComplete}
        />
      </main>

      {/* Input Area - 固定在底部，适配 iOS 安全区域 */}
      <div className="flex-shrink-0 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
        currentFeedbacks={currentEvaluationId ? history.find(h => h.id === currentEvaluationId)?.feedbacks : undefined}
        onFeedback={handleFeedback}
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

      {/* Scheduler Debug Panel */}
      <SchedulerDebugPanel 
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
      />
      
      {/* BGM Visual Indicator (Optional) */}
      {isPlayingMusic && (
        <div className="absolute top-20 right-4 text-xs text-green-400 animate-pulse pointer-events-none font-bold drop-shadow-md">
          ♫ Now Playing: 哈吉米曼波（春节版）♫
        </div>
      )}

      {/* BGM Player Component */}
      <BGMPlayer isPlaying={isPlayingMusic} volume={0.25} />

      {/* Music Warning Modal */}
      <MusicWarningModal 
        isOpen={showMusicWarning}
        onConfirm={handleMusicWarningConfirm}
      />

      {/* Queue Loading Modal */}
      <QueueLoadingModal isOpen={showQueueLoading} />

    </div>
  );
};

export default App;
