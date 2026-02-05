import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronLeft } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect }) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock size={18} className="text-yellow-500" /> 历史记录
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded transition-colors">
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="overflow-y-auto h-full pb-20 p-2 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-sm">暂无评价记录。</p>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-3 mb-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer border border-transparent hover:border-gray-600 transition-all group shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                 <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.result.grade === 'S' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600 text-gray-300'}`}>
                   评级 {item.result.grade}
                 </span>
                 <span className="text-[10px] text-gray-400">
                   {new Date(item.timestamp).toLocaleTimeString()}
                 </span>
              </div>
              <p className="text-sm text-gray-200 line-clamp-2">{item.input || "(仅图片)"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
