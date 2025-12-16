import React from 'react';
import { LayoutGrid, Bookmark, Settings, Layers, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, savedCount }) => {
  const navItems = [
    { id: 'feed', label: 'Content Feed', icon: LayoutGrid },
    { id: 'saved', label: 'Saved Items', icon: Bookmark, count: savedCount },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-10 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tight mb-8">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
            <Layers size={18} />
          </div>
          CurateOS
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                  {item.label}
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
            <Zap size={14} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs font-semibold text-purple-900">N8N Connected</p>
            <p className="text-[10px] text-purple-700">Workflow Active</p>
          </div>
          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <button 
           onClick={() => onChangeView('settings')}
           className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
             currentView === 'settings' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
           }`}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
};