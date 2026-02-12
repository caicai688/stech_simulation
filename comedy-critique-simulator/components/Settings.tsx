
import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Cpu } from 'lucide-react';
import { AppConfig, AIProvider } from '../types';
import { PROVIDERS } from '../constants';

interface SettingsProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave, isOpen, onClose }) => {
  const [provider, setProvider] = useState<AIProvider>(config.provider || 'gemini');
  const [model, setModel] = useState(config.model);

  // Sync with props when opened
  useEffect(() => {
    if (isOpen) {
        setProvider(config.provider || 'gemini');
        setModel(config.model);
    }
  }, [config, isOpen]);

  // When provider changes, reset model to the first available one for that provider
  const handleProviderChange = (newProvider: AIProvider) => {
      setProvider(newProvider);
      const defaultModel = PROVIDERS[newProvider].models[0].id;
      setModel(defaultModel);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ provider, apiKey: '', model }); // apiKey 留空，由后端使用内置 Key
    onClose();
  };

  const currentProviderInfo = PROVIDERS[provider];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SettingsIcon size={20} className="text-yellow-500" /> 
            选择模型 (Model Selection)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Cpu size={16} className="text-purple-400" /> 模型厂商 (Provider)
            </label>
            <div className="grid grid-cols-1 gap-2">
                {(['gemini', 'glm', 'qwen'] as AIProvider[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => handleProviderChange(key)}
                        className={`px-4 py-3 rounded-lg text-sm border transition-all flex justify-between items-center ${
                            provider === key 
                            ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span className="font-bold">{PROVIDERS[key].name}</span>
                        {provider === key && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 已内置 API Key，无需配置，直接选择即可使用
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Cpu size={16} className="text-green-400" /> 选择模型 (Model)
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
               {currentProviderInfo.models.map((m) => (
                   <button 
                     key={m.id}
                     onClick={() => setModel(m.id)}
                     className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center ${
                         model === m.id 
                         ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' 
                         : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                     }`}
                   >
                     <span className="font-bold text-sm">{m.name}</span>
                     {model === m.id && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                   </button>
               ))}
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-end shrink-0">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-colors shadow-md"
          >
            保存配置
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
