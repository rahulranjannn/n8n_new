import React, { useState, useEffect } from 'react';
import { X, Copy, Wand2, RefreshCw, Check } from 'lucide-react';
import { ContentItem, GeneratedHook } from '../types';
import { generateAIHooks } from '../services/mockDataService';

interface HookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ContentItem | null;
}

export const HookDrawer: React.FC<HookDrawerProps> = ({ isOpen, onClose, selectedItem }) => {
  const [hooks, setHooks] = useState<GeneratedHook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && selectedItem) {
      handleGenerate();
    } else {
      setHooks([]);
    }
  }, [isOpen, selectedItem]);

  const handleGenerate = async () => {
    if (!selectedItem) return;
    setIsLoading(true);
    try {
      // Simulate API Call to Gemini/LLM
      const newHooks = await generateAIHooks(selectedItem.fullContent);
      setHooks(newHooks);
    } catch (err) {
      console.error("Failed to generate hooks", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 size={20} className="text-purple-600" />
              Hook Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">Transform content into social posts</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
          {selectedItem && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Source Context</p>
              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{selectedItem.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-3">{selectedItem.previewText}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-xl border border-gray-200">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mt-4">
                <RefreshCw size={16} className="animate-spin" />
                Generating ideas...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {hooks.map((hook) => (
                <div key={hook.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:border-purple-200 transition-colors">
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {hook.platform}
                    </span>
                    <button 
                      onClick={() => handleCopy(hook.text, hook.id)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 rounded-md hover:bg-white transition-all"
                      title="Copy to clipboard"
                    >
                      {copiedId === hook.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap font-medium">{hook.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Regenerate Hooks
          </button>
        </div>
      </div>
    </>
  );
};