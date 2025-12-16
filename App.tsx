import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentCard } from './components/ContentCard';
import { HookDrawer } from './components/HookDrawer';
import { ContentItem, ViewState, ScrapeStatus } from './types';
import { MOCK_INITIAL_ITEMS } from './constants';
import { triggerN8NScrape, saveToSupabase, unsaveFromSupabase } from './services/mockDataService';
import { Download, Filter, Search, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_INITIAL_ITEMS);
  const [view, setView] = useState<ViewState>('feed');
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>({
    isScraping: false,
    lastScraped: new Date().toISOString(),
    error: null
  });
  
  // Hook Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItemForHooks, setSelectedItemForHooks] = useState<ContentItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'reddit' | 'newsletter'>('all');

  const savedItems = items.filter(item => item.isSaved);

  const handleScrape = async () => {
    setScrapeStatus(prev => ({ ...prev, isScraping: true, error: null }));
    try {
      const newItems = await triggerN8NScrape();
      setItems(prev => [...newItems, ...prev]);
      setScrapeStatus({
        isScraping: false,
        lastScraped: new Date().toISOString(),
        error: null
      });
    } catch (err) {
      setScrapeStatus(prev => ({ ...prev, isScraping: false, error: 'Failed to connect to N8N webhook' }));
    }
  };

  const toggleSave = async (item: ContentItem) => {
    // Optimistic UI Update
    const originalState = item.isSaved;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSaved: !i.isSaved } : i));

    try {
      if (!originalState) {
        await saveToSupabase(item);
      } else {
        await unsaveFromSupabase(item);
      }
    } catch (err) {
      // Revert on failure
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSaved: originalState } : i));
      console.error("Supabase sync failed", err);
    }
  };

  const openHookGenerator = (item: ContentItem) => {
    setSelectedItemForHooks(item);
    setIsDrawerOpen(true);
  };

  const filteredItems = (view === 'feed' ? items : savedItems).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.previewText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar 
        currentView={view} 
        onChangeView={setView} 
        savedCount={savedItems.length}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {view === 'feed' ? 'Content Feed' : view === 'saved' ? 'Saved Library' : 'Settings'}
            </h1>
            <p className="text-gray-500 mt-1">
              {view === 'feed' 
                ? 'Latest curated updates from Reddit & Newsletters' 
                : 'Your collection of high-signal content'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {view === 'feed' && (
              <button 
                onClick={handleScrape}
                disabled={scrapeStatus.isScraping}
                className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {scrapeStatus.isScraping ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Scrape Now
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {view !== 'settings' && (
          <>
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={18} className="text-gray-400 mx-2" />
                {(['all', 'reddit', 'newsletter'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSourceFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                      sourceFilter === filter 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ContentCard 
                    key={item.id} 
                    item={item} 
                    onSave={toggleSave}
                    onGenerateHook={openHookGenerator}
                    onDelete={view === 'saved' ? toggleSave : undefined} 
                  />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} />
                  </div>
                  <p className="text-lg font-medium text-gray-600">No items found</p>
                  <p className="text-sm max-w-xs mx-auto mt-2">Try adjusting your filters or triggering a new scrape.</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl">
            <h2 className="text-lg font-semibold mb-6">Integrations</h2>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Supabase Database</h3>
                  <p className="text-sm text-gray-500 mt-1">Store curated content and user preferences.</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </div>
              </div>

              <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">N8N Workflow</h3>
                  <p className="text-sm text-gray-500 mt-1">External scraper triggering via Webhook/MCP.</p>
                </div>
                 <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">AI Model</h3>
                  <p className="text-sm text-gray-500 mt-1">Gemini Pro configured for hook generation.</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Configure Key
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawers/Modals */}
      <HookDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        selectedItem={selectedItemForHooks} 
      />
    </div>
  );
};

export default App;