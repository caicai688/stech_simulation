import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, Zap } from 'lucide-react';
import { getSchedulerStats, getCacheDetails, clearCache } from '../services/comedyScheduler';

interface SchedulerDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulerDebugPanel: React.FC<SchedulerDebugPanelProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<any>(null);
  const [cacheDetails, setCacheDetails] = useState<any[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      updateStats();
      const interval = setInterval(updateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  const updateStats = () => {
    setStats(getSchedulerStats());
    setCacheDetails(getCacheDetails());
  };
  
  const handleClearCache = () => {
    if (confirm('确定要清除所有缓存吗？')) {
      clearCache();
      updateStats();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-green-500/30 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold text-green-400">调度器监控面板</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        {stats && (
          <>
            {/* 并发统计 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-yellow-400" size={20} />
                <h3 className="text-lg font-bold text-white">当前并发</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(stats.concurrentCounts).map(([model, count]: [string, any]) => (
                  <div key={model} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{model.toUpperCase()}</div>
                    <div className="text-2xl font-bold text-green-400">{count}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      队列: {stats.queueSizes[model]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 缓存统计 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="text-blue-400" size={20} />
                  <h3 className="text-lg font-bold text-white">缓存统计</h3>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm text-white transition-colors"
                >
                  清除缓存
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-3">
                <div className="text-3xl font-bold text-blue-400 mb-1">{stats.cacheSize}</div>
                <div className="text-sm text-gray-400">已缓存的段子评审结果</div>
              </div>
              
              {/* 缓存详情 */}
              {cacheDetails.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-60 overflow-y-auto">
                  {cacheDetails.map((item, idx) => (
                    <div key={idx} className="p-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-green-400 font-mono">{item.model}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {item.age} 分钟前
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 truncate">{item.key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 系统信息 */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/30">
              <h4 className="text-sm font-bold text-green-400 mb-3">💡 当前调度策略</h4>
              
              {/* 显示实际的模型配置 */}
              {stats.modelConfigs && stats.modelConfigs.length > 0 ? (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-2">调度顺序（按优先级）:</div>
                  <div className="space-y-2">
                    {stats.modelConfigs.map((config: any, idx: number) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2 text-xs p-2 rounded ${
                          config.isUserPreferred 
                            ? 'bg-green-900/30 border border-green-500/50' 
                            : 'bg-gray-800/50 border border-gray-700'
                        }`}
                      >
                        <span className="font-bold text-white">{idx + 1}.</span>
                        <span className={`font-mono ${config.isUserPreferred ? 'text-green-400' : 'text-gray-300'}`}>
                          {config.name.toUpperCase()}
                        </span>
                        {config.isUserPreferred && (
                          <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-[10px] font-bold">
                            用户优先
                          </span>
                        )}
                        <span className="text-gray-500 ml-auto text-[10px]">
                          {config.modelName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 mb-3">
                  降级顺序: Gemini (并发2) → 千问 (并发5) → 智谱 (并发10)
                </div>
              )}
              
              <ul className="text-xs text-gray-300 space-y-1 mt-3 pt-3 border-t border-gray-700">
                <li>• 优先使用用户在设置中配置的模型</li>
                <li>• 缓存有效期: 24小时</li>
                <li>• 遇到 429/超时自动切换下一个模型</li>
                <li>• 队列排队机制避免直接失败</li>
              </ul>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default SchedulerDebugPanel;
