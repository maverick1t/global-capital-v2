
import React, { useState, useEffect } from 'react';
import { Category, NewsItem, Language, LanguageLabels, CategoryLabels, UITranslations } from './types';
import { fetchGlobalNews, generateBriefingAnalysis } from './services/geminiService';
import NewsCard from './components/NewsCard';
import CategoryFilter from './components/CategoryFilter';
import { GlobeIcon, SparklesIcon, RefreshIcon, MenuIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category>(Category.ECONOMY);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const [newsData, setNewsData] = useState<Record<Category, NewsItem[]>>({} as Record<Category, NewsItem[]>);
  const [briefings, setBriefings] = useState<Record<Category, string>>({} as Record<Category, string>);
  const [loadingStatus, setLoadingStatus] = useState<Record<Category, boolean>>({} as Record<Category, boolean>);
  
  const [breakBubbleMode, setBreakBubbleMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [apiKey, setApiKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);

  const t = UITranslations;

  useEffect(() => {
    const storedKey = localStorage.getItem('user_gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setInputKey(storedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveSettings = () => {
    if (inputKey.trim()) {
      localStorage.setItem('user_gemini_api_key', inputKey.trim());
      setApiKey(inputKey.trim());
      setIsKeySaved(true);
    }
  };

  const handleClearSettings = () => {
    localStorage.removeItem('user_gemini_api_key');
    setApiKey('');
    setInputKey('');
    setIsKeySaved(false);
    setNewsData({} as Record<Category, NewsItem[]>);
    setBriefings({} as Record<Category, string>);
  };

  const fetchCategoryData = async (cat: Category, lang: Language) => {
    if (!apiKey) return;

    setLoadingStatus(prev => ({ ...prev, [cat]: true }));
    
    try {
      const data = await fetchGlobalNews(apiKey, cat, lang, breakBubbleMode);
      
      if (data.items.length > 0) {
        setNewsData(prev => ({ ...prev, [cat]: data.items }));
        const analysis = await generateBriefingAnalysis(apiKey, data.items, lang);
        setBriefings(prev => ({ ...prev, [cat]: analysis }));
      }
    } catch (err) {
      console.error(`Error fetching category ${cat}:`, err);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [cat]: false }));
    }
  };

const handleAggregateScan = async () => {
    if (!apiKey) return;
    
    const categories = Object.values(Category);
    // 初始化所有分类为加载状态
    const initialLoadingState = categories.reduce((acc, cat) => ({
      ...acc, 
      [cat]: true
    }), {} as Record<Category, boolean>);
    
    setLoadingStatus(initialLoadingState);

    // 【修改点】原本是 Promise.all 并发，现在改成 for 循环排队执行
    // 这样每次只发一个请求，就不会触发 Google 的 429 报错了
    for (const cat of categories) {
        try {
            // 请求当前分类的新闻
            const data = await fetchGlobalNews(apiKey, cat, currentLanguage, breakBubbleMode);
            
            if (data.items.length > 0) {
                setNewsData(prev => ({ ...prev, [cat]: data.items }));
                try {
                    // 请求 AI 总结
                    const analysis = await generateBriefingAnalysis(apiKey, data.items, currentLanguage);
                    setBriefings(prev => ({ ...prev, [cat]: analysis }));
                } catch (e) { console.error(e); }
            }
        } catch (err) {
            console.error(`Error fetching category ${cat}:`, err);
        } finally {
            // 加载完一个，取消一个的 loading 状态
            setLoadingStatus(prev => ({ ...prev, [cat]: false }));
        }
        
        // 可选：稍微停顿 0.5 秒，更稳妥
        await new Promise(r => setTimeout(r, 500));
    }
  };

  const handleSingleUpdate = () => {
      fetchCategoryData(currentCategory, currentLanguage);
  };

  const toggleBubbleMode = () => {
    setBreakBubbleMode(prev => !prev);
  };

  const renderConfigForm = () => (
    <div className="space-y-3">
        <input 
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder={t.apiKeyPlaceholder[currentLanguage]}
            className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-gold-400 focus:outline-none focus:border-gold-500 placeholder-slate-600 font-mono"
        />
        <div className="flex gap-2 pt-1">
        <button 
            onClick={handleSaveSettings}
            className="flex-1 px-3 py-2 bg-gold-600 hover:bg-gold-500 text-midnight-950 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
        >
            {t.saveConfig[currentLanguage]}
        </button>
        {isKeySaved && (
            <button 
                onClick={handleClearSettings}
                className="flex-1 px-3 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors border border-slate-700 hover:border-red-800"
            >
            {t.reset[currentLanguage]}
            </button>
        )}
        </div>
    </div>
  );

  const currentNewsItems = newsData[currentCategory] || [];
  const currentBriefing = briefings[currentCategory] || "";
  const isCurrentLoading = loadingStatus[currentCategory] || false;
  const isGlobalScanning = Object.values(loadingStatus).some(status => status === true);

  return (
    <div className="flex h-screen bg-midnight-900 text-slate-200 overflow-hidden font-sans selection:bg-gold-700 selection:text-white">
      
      <aside className="hidden md:flex flex-col w-80 bg-midnight-950 border-r border-slate-800 z-20 relative">
        <div className="p-8 pb-4 border-b border-slate-800/50">
           <div className="flex items-center gap-4 text-slate-100 mb-6">
             <div className="p-2.5 bg-gradient-to-br from-gold-500 to-gold-700 rounded-sm text-black shadow-lg shadow-gold-900/20">
               <GlobeIcon className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-xl font-display font-medium tracking-wide leading-none text-slate-100">
                {t.appTitleTop[currentLanguage]}<br/>
                <span className="text-gold-500">{t.appTitleBottom[currentLanguage]}</span>
               </h1>
             </div>
           </div>
           
           <button 
              onClick={handleAggregateScan}
              disabled={isGlobalScanning || !apiKey}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg ${
                  isGlobalScanning 
                  ? 'bg-slate-800 text-gold-500 border border-gold-500/30 animate-pulse' 
                  : 'bg-gold-600 hover:bg-gold-500 text-black shadow-gold-900/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
           >
              {isGlobalScanning ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    {t.scanning[currentLanguage]}
                  </>
              ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    {t.startAggregate[currentLanguage]}
                  </>
              )}
           </button>
           
           <p className="text-[10px] text-slate-500 mt-4 text-center font-mono uppercase tracking-wider">{t.privateDashboard[currentLanguage]}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-0 custom-scrollbar">
          <div className="mb-8">
             <CategoryFilter 
                selected={currentCategory} 
                language={currentLanguage}
                onSelect={setCurrentCategory} 
                disabled={isGlobalScanning} 
             />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-midnight-950 space-y-4">
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{t.language[currentLanguage]}</label>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="w-full flex items-center justify-between px-5 py-3 bg-slate-900 border border-slate-700 rounded-sm text-sm font-bold uppercase tracking-wider text-slate-400 hover:border-gold-600 hover:text-white transition-colors"
              >
                <span>{LanguageLabels[currentLanguage]}</span>
                <span className="text-slate-600">▼</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 rounded-sm shadow-2xl border border-slate-700 py-1 overflow-hidden z-50">
                  {(Object.keys(LanguageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setCurrentLanguage(lang); setIsLangMenuOpen(false); }}
                      className="w-full text-left px-5 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      {LanguageLabels[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold text-gold-500 uppercase tracking-widest">
                    {t.sysConfig[currentLanguage]}
                    </label>
                </div>
                {renderConfigForm()}
            </div>

            <button 
              onClick={toggleBubbleMode}
              disabled={!apiKey}
              className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${breakBubbleMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/50' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600'}`}
            >
              <SparklesIcon className="w-4 h-4" />
              {breakBubbleMode ? t.contrarianMode[currentLanguage] : t.standardFeed[currentLanguage]}
            </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-midnight-800">

        <div className="bg-black border-b border-slate-800 h-10 flex items-center overflow-hidden whitespace-nowrap relative z-10">
           <div className="flex animate-ticker gap-16 text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
              <span className="text-green-500">NASDAQ +0.4%</span>
              <span className="text-red-500">HKEX -1.2%</span>
              <span className="text-green-500">GOLD 2,410.50</span>
              <span className="text-red-500">BRENT 84.20</span>
              <span className="text-slate-400">EUR/USD 1.08</span>
              <span className="text-green-500">BTC 68,000</span>
              <span className="text-red-500">SHENZHEN COMP -0.8%</span>
              <span className="text-green-500">VIX -5.2%</span>
              <span className="text-slate-400">US 10Y 4.2%</span>
           </div>
        </div>

        <header className="md:hidden flex items-center justify-between p-5 bg-midnight-950 border-b border-slate-800 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-slate-100 text-lg">
                {t.appTitleTop[currentLanguage]} <span className="text-gold-500">{t.appTitleBottom[currentLanguage]}</span>
            </span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon className="w-7 h-7 text-slate-400" />
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="absolute inset-0 z-30 bg-midnight-900 p-8 flex flex-col md:hidden animate-fade-in overflow-y-auto text-slate-200">
             <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-4xl text-slate-500">&times;</span>
                </button>
             </div>
             
             <button 
                  onClick={() => { handleAggregateScan(); setMobileMenuOpen(false); }}
                  disabled={isGlobalScanning || !apiKey}
                  className="w-full mb-8 flex items-center justify-center gap-2 px-4 py-4 rounded-sm bg-gold-600 text-black font-bold uppercase tracking-widest"
             >
                 {isGlobalScanning ? t.scanning[currentLanguage] : t.startAggregate[currentLanguage]}
             </button>

             <div className="mb-8">
               <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t.language[currentLanguage]}</label>
               <div className="grid grid-cols-2 gap-3">
                 {(Object.keys(LanguageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setCurrentLanguage(lang); }}
                      className={`px-4 py-3 rounded-sm text-sm border ${currentLanguage === lang ? 'border-gold-600 bg-gold-900/20 text-gold-400' : 'border-slate-800 bg-slate-900'}`}
                    >
                      {LanguageLabels[lang]}
                    </button>
                 ))}
               </div>
             </div>

             <div className="mb-8 border-t border-b border-slate-800 py-6">
                 <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-gold-500 uppercase tracking-widest">
                    {t.sysConfig[currentLanguage]}
                    </label>
                </div>
                {renderConfigForm()}
             </div>

             <CategoryFilter 
                selected={currentCategory} 
                language={currentLanguage}
                onSelect={(c) => { setCurrentCategory(c); setMobileMenuOpen(false); }} 
                disabled={isGlobalScanning || !apiKey}
             />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 md:p-14 scroll-smooth relative">
           {isCurrentLoading && (
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 z-50">
                <div className="h-full bg-gold-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3"></div>
             </div>
           )}

           <div className="max-w-[1600px] mx-auto">
             
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 pb-8 border-b border-slate-800">
                <div>
                   <div className="flex items-center gap-3 mb-3">
                     <span className={`inline-block w-2 h-2 rounded-full ${apiKey ? (isGlobalScanning || isCurrentLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500') : 'bg-slate-600'}`}></span>
                     <p className="text-xs font-bold text-gold-600 uppercase tracking-[0.2em]">
                       {apiKey 
                        ? (isCurrentLoading ? t.updating[currentLanguage] : (isGlobalScanning ? t.scanning[currentLanguage] : t.liveFeed[currentLanguage]))
                        : t.systemOffline[currentLanguage]}
                     </p>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-display text-slate-100 leading-tight">
                     {breakBubbleMode ? t.contrarianMode[currentLanguage] : CategoryLabels[currentCategory][currentLanguage]}
                   </h2>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleSingleUpdate}
                    className="flex items-center gap-3 px-8 py-3 rounded-sm bg-transparent border border-slate-700 text-slate-400 hover:text-white hover:border-gold-500 hover:bg-gold-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCurrentLoading || !apiKey}
                  >
                    <RefreshIcon className={`w-4 h-4 ${isCurrentLoading ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-widest">{t.update[currentLanguage]}</span>
                  </button>
                </div>
             </div>

             {currentBriefing && (
               <div className={`mb-14 p-[1px] bg-gradient-to-r from-slate-800 via-gold-900/50 to-slate-800 rounded-sm transition-opacity duration-500`}>
                 <div className="bg-slate-900/80 backdrop-blur-sm p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="shrink-0 pt-2">
                         <div className="text-gold-500 text-xs font-bold border border-gold-500/30 px-4 py-1.5 uppercase tracking-[0.2em] inline-block">
                           {t.cioBriefing[currentLanguage]}
                         </div>
                      </div>
                      <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-display font-light italic border-l-[3px] border-gold-700 pl-8">
                        "{currentBriefing}"
                      </p>
                    </div>
                 </div>
               </div>
             )}

             {currentNewsItems.length > 0 && (
               <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500`}>
                  {currentNewsItems.map((item, index) => (
                    <NewsCard key={item.id} item={item} delay={index * 100} language={currentLanguage} />
                  ))}
               </div>
             )}

             {!isCurrentLoading && currentNewsItems.length === 0 && (
               <div className="text-center py-32 border border-dashed border-slate-800 bg-slate-900/50">
                  <h3 className="text-xl font-display text-slate-400">
                    {apiKey ? t.noDataTitle[currentLanguage] : t.awaitingAuth[currentLanguage]}
                  </h3>
                  <p className="text-slate-600 mt-3 text-base">
                    {apiKey ? t.noDataDesc[currentLanguage] : t.configDesc[currentLanguage]}
                  </p>
               </div>
             )}
            
            <footer className="mt-32 text-center text-slate-600 text-xs uppercase tracking-widest py-12">
               <p>{t.footer[currentLanguage]} • v3.1.0 AGGREGATE</p>
            </footer>
           </div>
        </div>
      </main>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #020617;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #fbbf24;
        }
      `}</style>
    </div>
  );
};

export default App;
