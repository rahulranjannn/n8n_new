import React, { useState } from 'react';
import { Bookmark, MessageSquarePlus, Share2, ExternalLink, ChevronDown, ChevronUp, Trash2, Mail, MessageCircle } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onSave: (item: ContentItem) => void;
  onGenerateHook: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onSave, onGenerateHook, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col gap-3">
        {/* Header: Source & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              item.source === 'reddit' 
                ? 'bg-orange-50 text-orange-700' 
                : 'bg-indigo-50 text-indigo-700'
            }`}>
              {item.source === 'reddit' ? <MessageCircle size={12} /> : <Mail size={12} />}
              {item.sourceName}
            </span>
            <span className="text-gray-400 text-xs">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {isExpanded ? item.fullContent : item.previewText}
          </p>
          
          {item.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {item.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onSave(item)}
            className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
              item.isSaved 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Bookmark size={16} className={item.isSaved ? "fill-white" : ""} />
            {item.isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button 
            onClick={() => onGenerateHook(item)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <MessageSquarePlus size={16} />
            Hooks
          </button>
        </div>

        <div className="flex items-center gap-1">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-900 rounded-md hover:bg-white transition-all"
            title="Open Original"
          >
            <ExternalLink size={16} />
          </a>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-md hover:bg-white transition-all"
          >
             {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};