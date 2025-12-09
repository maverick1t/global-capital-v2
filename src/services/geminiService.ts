import { GoogleGenAI } from "@google/genai";
import { NewsResponse, NewsItem, Category, Language, LanguageLabels } from '../types';

const extractJson = (text: string): any[] => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        // continue
      }
    }
    const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch (e3) {
        // continue
      }
    }
    console.warn("Failed to extract JSON from text:", text);
    return [];
  }
};

export const fetchGlobalNews = async (
  apiKey: string,
  category: Category, 
  language: Language,
  breakBubbleMode: boolean = false,
  signal?: AbortSignal
): Promise<NewsResponse> => {
  if (!apiKey) {
    console.warn("API Key is missing in request");
    return { items: [] };
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";
  
  let specificFocus = "";
  switch (category) {
      case Category.TRADE_SMART_DEVICES:
          specificFocus = "Focus: High-margin hardware trends, disruptive product launches in Shenzhen/Silicon Valley. Identify 'Alpha' in consumer electronics.";
          break;
      case Category.TRADE_SUPPLY_CHAIN:
          specificFocus = "Focus: Critical bottlenecks, shipping index fluctuations, strategic manufacturing shifts (Vietnam/Mexico). Raw material volatility.";
          break;
      case Category.TRADE_CROSS_BORDER:
          specificFocus = "Focus: Regulatory arbitrage, VAT changes, platform policy shifts (Amazon/TikTok), trade war implications.";
          break;
      case Category.CONSUMER_ALPHA:
          specificFocus = "Focus: **HIGH VELOCITY COMMODITIES**. Identify explosive sales trends on TikTok Shop, Amazon, Temu. Focus on 'Viral Toys', 'Ed-Tech', and 'Kid's Development' sectors. Analyze WHY they are selling (Price vs. Innovation).";
          break;
      case Category.STOCK_MARKET:
          specificFocus = "Focus: Capital flows, Institutional sentiment, M&A activity, IPO pipeline, hidden correlations between markets.";
          break;
      case Category.POLITICS:
          specificFocus = "Focus: Geopolitical risk assessment. Elections, Sanctions, Legislation affecting capital allocation and trade barriers.";
          break;
      case Category.RISK_COMPLIANCE:
          specificFocus = "Focus: **ASYMMETRIC DOWNSIDE**. Blacklists, seizures, major lawsuits, IP theft, sovereign risk updates.";
          break;
      case Category.CONSUMER_SENTIMENT:
          specificFocus = "Focus: **GROUND TRUTH**. What are people actually saying vs. what corporations report. Reddit/Twitter/Weibo sentiment analysis.";
          break;
      case Category.ESG_GREEN_TECH:
          specificFocus = "Focus: Regulatory moats. Carbon taxes, green mandates that act as trade barriers or investment necessities.";
          break;
      default:
          specificFocus = "Focus: High-impact strategic updates.";
  }

  const bubbleBreakerInstruction = breakBubbleMode 
    ? `CRITICAL: CONTRARIAN VIEW REQUIRED. Ignore consensus. Find off-radar sources, translated local intelligence, and dissenting expert opinions.`
    : `Prioritize: Authoritative Intelligence, Primary Sources, Institutional Research.`;

  const prompt = `
    ROLE: You are the Chief Strategy Officer & Lead Opportunity Scout for a Private Family Office.
    USER: Ultra-High-Net-Worth Manufacturer & Capitalist.
    LANG: ${LanguageLabels[language]}.
    CAT: "${category}".
    ${specificFocus}

    TASK:
    1. Perform a deep Google Search (using the tool) to find the top 5 most critical updates from the last 24 hours.
    2. REGIONS: SE Asia, Middle East, Russia, China, West.
    3. ${bubbleBreakerInstruction}

    FOR EACH ITEM:
    - You MUST identify the specific SOURCE URL. Do not invent URLs. Use the ground truth from the search tool.
    - Provide "Strategic Implication" (Bottom line).
    - Provide "Opportunities" (Alpha/Upside).
    - Provide "Risks" (Downside).

    OUTPUT FORMAT:
    Strictly output a JSON Array. Do not include markdown formatting if possible, but if you do, wrap it in json code blocks.
    
    Structure:
    [
      {
        "title": "Professional Headline",
        "summary": "Data-driven summary.",
        "strategicTakeaway": "Strategic impact sentence.",
        "opportunities": "Where is the money?",
        "risks": "What could go wrong?",
        "source": "Source Name (e.g. Bloomberg)",
        "region": "Region Name",
        "perspective": "Angle",
        "accountType": "Official Media" | "Govt Account" | "Personal Account" | "Corporate" | "Consumer Voice",
        "url": "THE_MAIN_ARTICLE_URL",
        "citations": ["URL_1", "URL_2"]
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
    }

    const text = response.text || "[]";
    const rawItems = extractJson(text);

    const items: NewsItem[] = Array.isArray(rawItems) ? rawItems.map((item: any, index: number) => ({
      id: `${category}-${Date.now()}-${index}`,
      title: item.title || "Intelligence Update",
      summary: item.summary || "Data currently unavailable.",
      strategicTakeaway: item.strategicTakeaway || "Monitor closely.",
      opportunities: item.opportunities || "Potential market entry point identified.",
      risks: item.risks || "Standard operational risk applies.",
      source: item.source || "Intelligence Network",
      region: item.region || "Global",
      perspective: item.perspective || "Neutral",
      publishedTime: "24h",
      accountType: item.accountType || "Official Media",
      url: item.url || item.originalUrl || "",
      citations: Array.isArray(item.citations) ? item.citations : (item.url ? [item.url] : [])
    })) : [];

    return { items };

  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.log('Request aborted');
        throw error;
    }
    console.error(`Gemini API Error for ${category}:`, error);
    return { items: [] };
  }
};

export const generateBriefingAnalysis = async (
  apiKey: string, 
  articles: NewsItem[], 
  language: Language
): Promise<string> => {
     if (!apiKey || articles.length === 0) return "";
     
     const ai = new GoogleGenAI({ apiKey });

     const prompt = `
        Role: Chief Strategy Officer. Lang: ${LanguageLabels[language]}.
        Context: Reviewing these headlines: ${articles.map(a => a.title).join("; ")}.
        Task: Provide a "Directives" style summary. 1-2 concise, high-level strategic sentences. No fluff.
     `;

     try {
         const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
         });
         return response.text || "";
     } catch (e) {
         console.error("Briefing Generation Error:", e);
         return "";
     }
}