import React from 'react';
import { NewsItem, Language, UITranslations } from '../types';

interface NewsCardProps {
  item: NewsItem;
  delay: number;
  language: Language;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, delay, language }) => {
  const getBadgeStyle = (type?: string) => {
    switch(type) {
      case 'Official Media': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'Govt Account': return 'text-slate-300 border-slate-300/30 bg-slate-300/10';
      case 'Watchdog': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gold-400 border-gold-400/30 bg-gold-400/10';
    }
  };

  const t = UITranslations;
  
  let rawUrl = item.citations && item.citations.length > 0 
    ? item.citations[0] 
    : item.url;

  let isFallback = false;
  
  if (!rawUrl || rawUrl.length < 5 || rawUrl.toLowerCase() === 'n/a' || rawUrl.toLowerCase() === 'none') {
    rawUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
    isFallback = true;
  } else {
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        rawUrl = `https://${rawUrl}`;
    }
  }

  const displayUrl = rawUrl;

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-sm p-7 hover:border-gold-500/50 transition-all duration-500 transform group flex flex-col h-full animate-fade-in-up relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border ${getBadgeStyle(item.accountType)}`}>
            {item.accountType || 'Source'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-800">
            {item.region}
            </span>
        </div>
        <span className="text-xs text-slate-500 font-mono pt-1">{item.publishedTime}</span>
      </div>
      
      <h3 className="text-2xl font-display font-medium text-slate-100 mb-4 leading-snug group-hover:text-gold-400 transition-colors">
        {item.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-5 text-xs text-slate-500 border-b border-slate-800 pb-3">
        <span className="font-bold text-slate-400 uppercase tracking-wider">{item.source}</span>
      </div>

      <div className="flex-grow space-y-6">
        <p className="text-base text-slate-400 leading-relaxed font-light">
            {item.summary}
        </p>

        <div className="bg-slate-800/40 border-l-2 border-gold-600 pl-4 py-3 pr-3 rounded-r-sm">
            <p className="text-xs text-gold-600 font-bold uppercase tracking-widest mb-1.5">{t.strategicImplication[language]}</p>
            <p className="text-sm text-slate-300 italic font-serif leading-relaxed">
                "{item.strategicTakeaway}"
            </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 pt-4 border-t border-slate-800/50">
           <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
              </div>
              <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">{t.opportunityScout[language]}</h4>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {item.opportunities || t.noOpp[language]}
                  </p>
              </div>
           </div>

           <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
              </div>
              <div>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">{t.riskAssessment[language]}</h4>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {item.risks || t.noRisk[language]}
                  </p>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-8 pt-5 border-t border-slate-800/50">
         <div className="flex items-center justify-between mb-3">
             <span className={`text-xs font-medium px-2.5 py-1 rounded bg-slate-800 ${item.perspective.includes('Risk') ? 'text-red-400' : 'text-slate-400'}`}>
                 {t.angle[language]}: {item.perspective}
             </span>
             <span className="text-[10px] text-gold-600 uppercase tracking-widest font-bold flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                 {t.verifiedSources[language]}
             </span>
         </div>
         
         <div className="flex flex-col gap-2">
            <a 
                href={displayUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between group bg-slate-950/50 p-2 border border-slate-800 hover:border-gold-600/50 rounded-sm transition-colors"
            >
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] group-hover:text-gold-400 transition-colors">
                    {isFallback ? `Search: ${item.title.substring(0, 20)}...` : (() => {
                        try {
                            return new URL(displayUrl).hostname.replace('www.', '');
                        } catch (e) {
                            return 'External Link';
                        }
                    })()}
                </span>
                <svg className="w-3 h-3 text-slate-600 group-hover:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
         </div>
      </div>
    </div>
  );
};

export default NewsCard;