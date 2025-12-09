export enum Category {
  ECONOMY = 'economy_finance',
  STOCK_MARKET = 'stock_market',
  POLITICS = 'politics_policy',
  MILITARY = 'military_security',
  
  TRADE_SMART_DEVICES = 'trade_smart_devices',
  TRADE_SUPPLY_CHAIN = 'trade_supply_chain',
  TRADE_CROSS_BORDER = 'trade_cross_border',
  CONSUMER_ALPHA = 'trade_toys_kids',
  AI_TECH = 'ai_technology',
  TITANS = 'industry_titans',

  RISK_COMPLIANCE = 'risk_compliance',
  CONSUMER_SENTIMENT = 'consumer_sentiment', 
  ESG_GREEN_TECH = 'esg_green_tech'
}

export type Language = 'en' | 'zh' | 'ja' | 'es' | 'fr' | 'de' | 'ru' | 'ar';

export const CategoryLabels: Record<Category, Record<Language, string>> = {
  [Category.ECONOMY]: { en: 'Global Macro', zh: '全球宏观经济', ja: '世界経済マクロ', es: 'Macroeconomía', fr: 'Macroéconomie', de: 'Global Makro', ru: 'Глобальная макроэкономика', ar: 'الاقتصاد الكلي' },
  [Category.STOCK_MARKET]: { en: 'Capital Markets', zh: '全球资本市场', ja: '資本市場', es: 'Mercados de Capital', fr: 'Marchés des Capitaux', de: 'Kapitalmärkte', ru: 'Рынки капитала', ar: 'أسواق المال' },
  [Category.POLITICS]: { en: 'Geopolitics', zh: '地缘政治博弈', ja: '地政学', es: 'Geopolítica', fr: 'Géopolitique', de: 'Geopolitik', ru: 'Геополитика', ar: 'الجيوسياسية' },
  [Category.MILITARY]: { en: 'Defense & Security', zh: '国防与安全情报', ja: '防衛・安全保障', es: 'Defensa y Seguridad', fr: 'Défense et Sécurité', de: 'Verteidigung', ru: 'Оборона и безопасность', ar: 'الدفاع والأمن' },
  [Category.TRADE_SMART_DEVICES]: { en: 'Tech Hardware Alpha', zh: '硬科技Alpha趋势', ja: 'ハードウェア動向', es: 'Alpha en Hardware', fr: 'Alpha Matériel', de: 'Tech-Hardware', ru: 'Технологии и устройства', ar: 'أجهزة التكنولوجيا' },
  [Category.TRADE_SUPPLY_CHAIN]: { en: 'Global Supply Chain', zh: '全球供应链动态', ja: 'サプライチェーン', es: 'Cadena de Suministro', fr: 'Chaîne Logistique', de: 'Globale Lieferkette', ru: 'Глобальные поставки', ar: 'سلسلة التوريد العالمية' },
  [Category.TRADE_CROSS_BORDER]: { en: 'Cross-Border Policy', zh: '跨境政策与合规', ja: '越境政策', es: 'Política Transfronteriza', fr: 'Politique Transfrontalière', de: 'Grenzüberschreitende Politik', ru: 'Трансграничная политика', ar: 'السياسات عبر الحدود' },
  [Category.CONSUMER_ALPHA]: { en: 'Consumer High Growth', zh: '高增长消费品(爆品)', ja: '高成長消費財', es: 'Consumo de Alto Crecimiento', fr: 'Biens de Consommation', de: 'Konsumgüter-Wachstum', ru: 'Потребительский рост', ar: 'النمو الاستهلاكي' },
  [Category.AI_TECH]: { en: 'Deep Tech & AI', zh: '深度科技与AI', ja: 'ディープテックとAI', es: 'Deep Tech e IA', fr: 'Deep Tech et IA', de: 'Deep Tech & KI', ru: 'Deep Tech и ИИ', ar: 'التكنولوجيا العميقة والذكاء الاصطناعي' },
  [Category.TITANS]: { en: 'Global Elites Watch', zh: '全球领袖动态', ja: '世界的エリート', es: 'Élite Global', fr: 'Élites Mondiales', de: 'Globale Eliten', ru: 'Мировая элита', ar: 'النخبة العالمية' },
  [Category.RISK_COMPLIANCE]: { en: 'Asymmetric Threats', zh: '非对称风险与黑名单', ja: '非対称的脅威', es: 'Amenazas Asimétricas', fr: 'Menaces Asymétriques', de: 'Asymmetrische Bedrohungen', ru: 'Асимметричные угрозы', ar: 'التهديدات غير المتماثلة' },
  [Category.CONSUMER_SENTIMENT]: { en: 'Grassroots Sentiment', zh: '基层市场舆情', ja: '草の根の感情', es: 'Sentimiento Popular', fr: 'Sentiment Populaire', de: 'Basisstimmung', ru: 'Настроения масс', ar: 'المشاعر الشعبية' },
  [Category.ESG_GREEN_TECH]: { en: 'ESG & Regulatory Walls', zh: 'ESG与绿色壁垒', ja: 'ESGと規制の壁', es: 'ESG y Barreras', fr: 'ESG et Barrières', de: 'ESG & Regulierung', ru: 'ESG и барьеры', ar: 'ESG والجدران التنظيمية' }
};

export const LanguageLabels: Record<Language, string> = {
  en: 'English (US)', zh: '中文 (简体)', ja: '日本語', es: 'Español', fr: 'Français', de: 'Deutsch', ru: 'Русский', ar: 'العربية'
};

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  region: string; 
  perspective: string; 
  strategicTakeaway: string; 
  opportunities?: string; 
  risks?: string;        
  publishedTime?: string;
  originalUrl?: string;
  url?: string;
  citations?: string[];
  accountType?: 'Official Media' | 'Govt Account' | 'Personal Account' | 'Corporate' | 'Consumer Voice' | 'Watchdog';
}

export interface NewsResponse {
  items: NewsItem[];
}

export const UITranslations = {
  appTitleTop: { en: "CAPITAL", zh: "资本", ja: "キャピタル", es: "CAPITAL", fr: "CAPITAL", de: "KAPITAL", ru: "КАПИТАЛ", ar: "رأس المال" },
  appTitleBottom: { en: "INTELLIGENCE", zh: "情报", ja: "インテリジェンス", es: "INTELIGENCIA", fr: "INTELLIGENCE", de: "INTELLIGENZ", ru: "ИНТЕЛЛЕКТ", ar: "الاستخبارات" },
  privateDashboard: { en: "Private Office Dashboard", zh: "私人办公室决策台", ja: "プライベートオフィス・ダッシュボード", es: "Panel de Oficina Privada", fr: "Tableau de Bord Privé", de: "Privates Büro-Dashboard", ru: "Панель частного офиса", ar: "لوحة تحكم المكتب الخاص" },
  language: { en: "Language", zh: "语言选择", ja: "言語", es: "Idioma", fr: "Langue", de: "Sprache", ru: "Язык", ar: "اللغة" },
  sysConfig: { en: "System Configuration", zh: "系统配置", ja: "システム設定", es: "Configuración del Sistema", fr: "Configuration Système", de: "Systemkonfiguration", ru: "Конфигурация системы", ar: "تكوين النظام" },
  apiKeyPlaceholder: { en: "Google API Key...", zh: "输入 Google API Key...", ja: "Google APIキー...", es: "Clave API de Google...", fr: "Clé API Google...", de: "Google API-Schlüssel...", ru: "Ключ Google API...", ar: "مفتاح Google API..." },
  saveConfig: { en: "Save Config", zh: "保存配置", ja: "設定を保存", es: "Guardar", fr: "Enregistrer", de: "Speichern", ru: "Сохранить", ar: "حفظ" },
  reset: { en: "Reset", zh: "重置", ja: "リセット", es: "Restablecer", fr: "Réinitialiser", de: "Zurücksetzen", ru: "Сброс", ar: "إعادة تعيين" },
  contrarianMode: { en: "Contrarian Mode", zh: "逆向思维模式", ja: "逆張りモード", es: "Modo Contrario", fr: "Mode Contrarien", de: "Konträr-Modus", ru: "Контрарный режим", ar: "الوضع المعاكس" },
  standardFeed: { en: "Standard Feed", zh: "标准情报流", ja: "標準フィード", es: "Feed Estándar", fr: "Flux Standard", de: "Standard-Feed", ru: "Стандартный поток", ar: "التغذية القياسية" },
  liveFeed: { en: "Live Feed", zh: "实时情报", ja: "ライブフィード", es: "Feed en Vivo", fr: "Flux en Direct", de: "Live-Feed", ru: "Живой поток", ar: "بث مباشر" },
  systemOffline: { en: "System Offline", zh: "系统离线", ja: "システムオフライン", es: "Sistema Offline", fr: "Système Hors Ligne", de: "System Offline", ru: "Система оффлайн", ar: "النظام غير متصل" },
  update: { en: "Update", zh: "更新当前情报", ja: "更新", es: "Actualizar", fr: "Mettre à jour", de: "Aktualisieren", ru: "Обновить", ar: "تحديث" },
  startAggregate: { en: "Start Aggregate Scan", zh: "开始全域采集", ja: "一括スキャン開始", es: "Iniciar Escaneo Total", fr: "Lancer le Scan Global", de: "Gesamtscan Starten", ru: "Начать полный скан", ar: "بدء المسح الشامل" },
  updating: { en: "Acquiring...", zh: "采集情报中...", ja: "取得中...", es: "Adquiriendo...", fr: "Acquisition...", de: "Erwerben...", ru: "Получение...", ar: "جارٍ الحصول..." },
  scanning: { en: "Global Scanning...", zh: "全域扫描中...", ja: "グローバルスキャン中...", es: "Escaneando...", fr: "Scan en cours...", de: "Scannen...", ru: "Сканирование...", ar: "جارٍ المسح..." },
  cioBriefing: { en: "CIO Briefing", zh: "首席战略官简报", ja: "CIOブリーフィング", es: "Informe del CIO", fr: "Briefing CIO", de: "CIO-Briefing", ru: "Брифинг CIO", ar: "موجز CIO" },
  noDataTitle: { en: "No Intelligence Data", zh: "暂无情报数据", ja: "インテリジェンスデータなし", es: "Sin Datos de Inteligencia", fr: "Aucune Donnée", de: "Keine Daten", ru: "Нет данных разведки", ar: "لا توجد بيانات استخباراتية" },
  awaitingAuth: { en: "Awaiting Authorization", zh: "等待授权", ja: "承認待ち", es: "Esperando Autorización", fr: "En Attente d'Autorisation", de: "Warte auf Autorisierung", ru: "Ожидание авторизации", ar: "في انتظار التفويض" },
  noDataDesc: { en: "No data collected. Click 'Start Aggregate Scan' or 'Update'.", zh: "暂无数据。请点击“开始全域采集”或“更新”。", ja: "データがありません。「一括スキャン開始」をクリックしてください。", es: "Sin datos. Haga clic en 'Iniciar Escaneo'.", fr: "Aucune donnée. Cliquez sur 'Lancer le Scan'.", de: "Keine Daten. Klicken Sie auf 'Scan Starten'.", ru: "Нет данных. Нажмите 'Начать скан'.", ar: "لا توجد بيانات. انقر فوق 'بدء المسح'." },
  configDesc: { en: "Please configure your API credentials in the sidebar.", zh: "请在侧边栏配置您的 API 凭证。", ja: "サイドバーでAPI認証情報を設定してください。", es: "Configure sus credenciales API en la barra lateral.", fr: "Veuillez configurer vos identifiants API dans la barre latérale.", de: "Bitte konfigurieren Sie Ihre API-Anmeldeinformationen.", ru: "Пожалуйста, настройте учетные данные API.", ar: "يرجى تكوين بيانات اعتماد API الخاصة بك في الشريط الجانبي." },
  footer: { en: "Private Office Intelligence System", zh: "私人办公室情报系统", ja: "プライベートオフィス・インテリジェンス・システム", es: "Sistema de Inteligencia de Oficina Privada", fr: "Système de Renseignement de Bureau Privé", de: "Private Office Intelligence System", ru: "Система разведки частного офиса", ar: "نظام استخبارات المكتب الخاص" },
  strategicImplication: { en: "Strategic Implication", zh: "战略启示", ja: "戦略的示唆", es: "Implicación Estratégica", fr: "Implication Stratégique", de: "Strategische Auswirkung", ru: "Стратегическое значение", ar: "الآثار الاستراتيجية" },
  opportunityScout: { en: "Opportunity Scout", zh: "机会挖掘", ja: "機会スカウト", es: "Oportunidades", fr: "Éclaireur d'Opportunités", de: "Chancen-Scout", ru: "Поиск возможностей", ar: "كشاف الفرص" },
  riskAssessment: { en: "Risk Assessment", zh: "风险评估", ja: "リスク評価", es: "Evaluación de Riesgos", fr: "Évaluation des Risques", de: "Risikobewertung", ru: "Оценка рисков", ar: "تقييم المخاطر" },
  verifiedSources: { en: "Verified Source", zh: "信源验证", ja: "検証済みの情報源", es: "Fuente Verificada", fr: "Source Vérifiée", de: "Verifizierte Quelle", ru: "Проверенный источник", ar: "مصدر تم التحقق منه" },
  angle: { en: "Angle", zh: "视角", ja: "視点", es: "Ángulo", fr: "Angle", de: "Winkel", ru: "Ракурс", ar: "زاوية" },
  noOpp: { en: "No immediate arbitrage identified.", zh: "未发现立即套利机会。", ja: "即時の裁定機会は特定されませんでした。", es: "No se identificó arbitraje inmediato.", fr: "Aucun arbitrage immédiat identifié.", de: "Keine unmittelbare Arbitrage identifiziert.", ru: "Немедленный арбитраж не выявлен.", ar: "لم يتم تحديد مراجحة فورية." },
  noRisk: { en: "Standard market risks apply.", zh: "适用标准市场风险。", ja: "標準的な市場リスクが適用されます。", es: "Se aplican riesgos de mercado estándar.", fr: "Les risques de marché standard s'appliquent.", de: "Es gelten Standardmarktrisiken.", ru: "Применяются стандартные рыночные риски.", ar: "تطبق مخاطر السوق القياسية." },
  asymmetricIntel: { en: "Asymmetric Intelligence", zh: "非对称情报", ja: "非対称インテリジェンス", es: "Inteligencia Asimétrica", fr: "Intelligence Asymétrique", de: "Asymmetrische Intelligenz", ru: "Асимметричная разведка", ar: "الاستخبارات غير المتماثلة" }
};