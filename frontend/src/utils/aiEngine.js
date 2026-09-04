// ─── RainAI Engine — Full Multilingual Weather Intelligence ─────────────────

// ── RTL languages ─────────────────────────────────────────────────────────────
export const RTL_LANGS = ['ur', 'ar'];
export const isRTL = (lang) => RTL_LANGS.includes(lang);

// ── Language persistence ──────────────────────────────────────────────────────
export const getSavedLang = () => {
  try { return localStorage.getItem('rainai_lang') || 'en'; } catch { return 'en'; }
};
export const saveLang = (lang) => {
  try { localStorage.setItem('rainai_lang', lang); } catch {}
};

// ── Languages ─────────────────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', label: 'English',   flag: '🇬🇧', speechCode: 'en-US', dir: 'ltr' },
  { code: 'hi', label: 'हिंदी',     flag: '🇮🇳', speechCode: 'hi-IN', dir: 'ltr' },
  { code: 'mr', label: 'मराठी',     flag: '🇮🇳', speechCode: 'mr-IN', dir: 'ltr' },
  { code: 'ur', label: 'اردو',      flag: '🇵🇰', speechCode: 'ur-PK', dir: 'rtl' },
  { code: 'ar', label: 'العربية',   flag: '🇸🇦', speechCode: 'ar-SA', dir: 'rtl' },
];

export const LANG_SPEECH_CODES = {
  en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ur: 'ur-PK', ar: 'ar-SA',
};

// ── Full UI Translations ──────────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    prediction: 'Prediction', rain: 'RAIN', noRain: 'NO RAIN',
    confidence: 'Confidence Score', explanation: 'AI Explanation',
    suggestions: 'Suggested Actions', insights: 'Weather Insights',
    simpleMode: 'Simple Mode', techMode: 'Technical Mode',
    speakResult: 'Speak Result', stopNarration: 'Stop Narration',
    rainLikely: 'Rain is likely tomorrow.',
    rainUnlikely: 'No significant rain expected tomorrow.',
    verifiedBy: 'Verified by Random Forest AI',
    generatePrediction: 'Generate AI Prediction',
    analyzingAI: 'Analyzing with AI...',
    weatherParams: 'Weather Parameters',
    fillParams: 'Fill in all 17 parameters for accurate prediction',
    loading: 'Loading...', noHistory: 'No History Found',
    noHistoryDesc: 'Try making a prediction first!',
    totalRecords: 'Total Records', viewDetails: 'View Details',
    dashboard: 'Dashboard', predict: 'Predict',
    history: 'History', analytics: 'Analytics',
    settings: 'Settings', logout: 'Logout',
    aiInsight: 'AI Insight', aiSummary: 'AI Summary',
    whyConfidence: 'Why this confidence?',
    technicalDetails: 'Technical Details',
    factorInfluence: 'Factor Influence',
    modelAccuracy: 'Model Accuracy', totalPredictions: 'Total Predictions',
    rainPredictions: 'Rain Predictions', dryPredictions: 'Dry Predictions',
    confidenceTrend: 'Confidence Trend', distribution: 'Distribution',
    advancedInsights: 'Advanced Insights', modelPerformance: 'Model Performance',
    predictionRatios: 'Prediction Ratios', confidenceStability: 'Confidence Stability',
    noPredictionYet: 'No Prediction Yet',
    fillParamsHint: 'Fill in the weather parameters and generate your AI prediction.',
    loadedFromHistory: 'Loaded from History',
    analyzingConditions: 'RainAI is analyzing conditions...',
    generatingExplanation: 'Generating intelligent explanation',
    rainYesterday: 'Rain Yesterday?', premiumAccount: 'Premium Account',
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
    aiAssistantActive: 'AI Assistant Active',
    overviewToday: "Here's your weather intelligence overview.",
    confidenceTrendDesc: 'Prediction confidence over time',
    last30days: 'Last 30 days', distributionDesc: 'Rain vs Dry predictions',
    rainy: 'Rainy', dry: 'Dry',
    model: 'Model', rawConfidence: 'Raw Confidence',
    featuresUsed: 'Features Used', outputClass: 'Output Class',
    veryHighConf: 'Very High Confidence', highConf: 'High Confidence',
    moderateConf: 'Moderate Confidence', lowConf: 'Low Confidence',
    veryHighConfDesc: 'The AI is extremely certain about this prediction.',
    highConfDesc: 'The AI strongly believes this outcome is likely.',
    moderateConfDesc: 'The AI sees a reasonable probability for this outcome.',
    lowConfDesc: 'The AI is uncertain — conditions are mixed.',
    navigation: 'Navigation',
    aiWeatherAssistant: 'AI Weather Assistant',
    enterWeatherData: 'Enter weather data to get intelligent rainfall predictions.',
  },
  hi: {
    prediction: 'पूर्वानुमान', rain: 'बारिश', noRain: 'बारिश नहीं',
    confidence: 'विश्वास स्कोर', explanation: 'AI व्याख्या',
    suggestions: 'सुझाव', insights: 'मौसम अंतर्दृष्टि',
    simpleMode: 'सरल मोड', techMode: 'तकनीकी मोड',
    speakResult: 'परिणाम बोलें', stopNarration: 'रोकें',
    rainLikely: 'कल बारिश होने की संभावना है।',
    rainUnlikely: 'कल कोई महत्वपूर्ण बारिश नहीं होगी।',
    verifiedBy: 'Random Forest AI द्वारा सत्यापित',
    generatePrediction: 'AI पूर्वानुमान उत्पन्न करें',
    analyzingAI: 'AI से विश्लेषण हो रहा है...',
    weatherParams: 'मौसम पैरामीटर',
    fillParams: 'सटीक पूर्वानुमान के लिए सभी 17 पैरामीटर भरें',
    loading: 'लोड हो रहा है...', noHistory: 'कोई इतिहास नहीं',
    noHistoryDesc: 'पहले एक पूर्वानुमान बनाएं!',
    totalRecords: 'कुल रिकॉर्ड', viewDetails: 'विवरण देखें',
    dashboard: 'डैशबोर्ड', predict: 'पूर्वानुमान',
    history: 'इतिहास', analytics: 'विश्लेषण',
    settings: 'सेटिंग्स', logout: 'लॉग आउट',
    aiInsight: 'AI अंतर्दृष्टि', aiSummary: 'AI सारांश',
    whyConfidence: 'यह विश्वास क्यों?',
    technicalDetails: 'तकनीकी विवरण',
    factorInfluence: 'कारक प्रभाव',
    modelAccuracy: 'मॉडल सटीकता', totalPredictions: 'कुल पूर्वानुमान',
    rainPredictions: 'बारिश पूर्वानुमान', dryPredictions: 'शुष्क पूर्वानुमान',
    confidenceTrend: 'विश्वास प्रवृत्ति', distribution: 'वितरण',
    advancedInsights: 'उन्नत अंतर्दृष्टि', modelPerformance: 'मॉडल प्रदर्शन',
    predictionRatios: 'पूर्वानुमान अनुपात', confidenceStability: 'विश्वास स्थिरता',
    noPredictionYet: 'अभी कोई पूर्वानुमान नहीं',
    fillParamsHint: 'मौसम पैरामीटर भरें और AI पूर्वानुमान उत्पन्न करें।',
    loadedFromHistory: 'इतिहास से लोड किया गया',
    analyzingConditions: 'RainAI मौसम की स्थिति का विश्लेषण कर रहा है...',
    generatingExplanation: 'बुद्धिमान व्याख्या उत्पन्न हो रही है',
    rainYesterday: 'कल बारिश हुई?', premiumAccount: 'प्रीमियम खाता',
    goodMorning: 'सुप्रभात', goodAfternoon: 'नमस्ते', goodEvening: 'शुभ संध्या',
    aiAssistantActive: 'AI सहायक सक्रिय',
    overviewToday: 'आज का मौसम बुद्धिमत्ता अवलोकन।',
    confidenceTrendDesc: 'समय के साथ पूर्वानुमान विश्वास',
    last30days: 'पिछले 30 दिन', distributionDesc: 'बारिश बनाम शुष्क पूर्वानुमान',
    rainy: 'बारिश', dry: 'शुष्क',
    model: 'मॉडल', rawConfidence: 'कच्चा विश्वास',
    featuresUsed: 'उपयोग की गई विशेषताएं', outputClass: 'आउटपुट वर्ग',
    veryHighConf: 'बहुत उच्च विश्वास', highConf: 'उच्च विश्वास',
    moderateConf: 'मध्यम विश्वास', lowConf: 'कम विश्वास',
    veryHighConfDesc: 'AI इस पूर्वानुमान के बारे में अत्यंत निश्चित है।',
    highConfDesc: 'AI को दृढ़ता से विश्वास है कि यह परिणाम संभावित है।',
    moderateConfDesc: 'AI इस परिणाम के लिए उचित संभावना देखता है।',
    lowConfDesc: 'AI अनिश्चित है — स्थितियां मिश्रित हैं।',
    navigation: 'नेविगेशन',
    aiWeatherAssistant: 'AI मौसम सहायक',
    enterWeatherData: 'बुद्धिमान वर्षा पूर्वानुमान के लिए मौसम डेटा दर्ज करें।',
  },
  mr: {
    prediction: 'अंदाज', rain: 'पाऊस', noRain: 'पाऊस नाही',
    confidence: 'विश्वास स्कोर', explanation: 'AI स्पष्टीकरण',
    suggestions: 'सूचना', insights: 'हवामान अंतर्दृष्टी',
    simpleMode: 'सोपी पद्धत', techMode: 'तांत्रिक पद्धत',
    speakResult: 'निकाल बोला', stopNarration: 'थांबा',
    rainLikely: 'उद्या पाऊस पडण्याची शक्यता आहे।',
    rainUnlikely: 'उद्या पाऊस नाही।',
    verifiedBy: 'Random Forest AI द्वारे सत्यापित',
    generatePrediction: 'AI अंदाज तयार करा',
    analyzingAI: 'AI सह विश्लेषण होत आहे...',
    weatherParams: 'हवामान मापदंड',
    fillParams: 'अचूक अंदाजासाठी सर्व 17 मापदंड भरा',
    loading: 'लोड होत आहे...', noHistory: 'इतिहास नाही',
    noHistoryDesc: 'प्रथम अंदाज करण्याचा प्रयत्न करा!',
    totalRecords: 'एकूण नोंदी', viewDetails: 'तपशील पहा',
    dashboard: 'डॅशबोर्ड', predict: 'अंदाज',
    history: 'इतिहास', analytics: 'विश्लेषण',
    settings: 'सेटिंग्ज', logout: 'लॉग आउट',
    aiInsight: 'AI अंतर्दृष्टी', aiSummary: 'AI सारांश',
    whyConfidence: 'हा विश्वास का?',
    technicalDetails: 'तांत्रिक तपशील',
    factorInfluence: 'घटक प्रभाव',
    modelAccuracy: 'मॉडल अचूकता', totalPredictions: 'एकूण अंदाज',
    rainPredictions: 'पाऊस अंदाज', dryPredictions: 'कोरडे अंदाज',
    confidenceTrend: 'विश्वास कल', distribution: 'वितरण',
    advancedInsights: 'प्रगत अंतर्दृष्टी', modelPerformance: 'मॉडल कामगिरी',
    predictionRatios: 'अंदाज गुणोत्तर', confidenceStability: 'विश्वास स्थिरता',
    noPredictionYet: 'अद्याप अंदाज नाही',
    fillParamsHint: 'हवामान मापदंड भरा आणि AI अंदाज तयार करा।',
    loadedFromHistory: 'इतिहासातून लोड केले',
    analyzingConditions: 'RainAI हवामान परिस्थितीचे विश्लेषण करत आहे...',
    generatingExplanation: 'बुद्धिमान स्पष्टीकरण तयार होत आहे',
    rainYesterday: 'काल पाऊस पडला?', premiumAccount: 'प्रीमियम खाते',
    goodMorning: 'सुप्रभात', goodAfternoon: 'नमस्कार', goodEvening: 'शुभ संध्याकाळ',
    aiAssistantActive: 'AI सहाय्यक सक्रिय',
    overviewToday: 'आजचे हवामान बुद्धिमत्ता विहंगावलोकन।',
    confidenceTrendDesc: 'कालांतराने अंदाज विश्वास',
    last30days: 'मागील 30 दिवस', distributionDesc: 'पाऊस विरुद्ध कोरडे अंदाज',
    rainy: 'पाऊस', dry: 'कोरडे',
    model: 'मॉडल', rawConfidence: 'कच्चा विश्वास',
    featuresUsed: 'वापरलेली वैशिष्ट्ये', outputClass: 'आउटपुट वर्ग',
    veryHighConf: 'अत्यंत उच्च विश्वास', highConf: 'उच्च विश्वास',
    moderateConf: 'मध्यम विश्वास', lowConf: 'कमी विश्वास',
    veryHighConfDesc: 'AI या अंदाजाबद्दल अत्यंत निश्चित आहे।',
    highConfDesc: 'AI ला दृढपणे विश्वास आहे की हा परिणाम शक्य आहे।',
    moderateConfDesc: 'AI या परिणामासाठी वाजवी संभाव्यता पाहतो।',
    lowConfDesc: 'AI अनिश्चित आहे — परिस्थिती मिश्रित आहे।',
    navigation: 'नेव्हिगेशन',
    aiWeatherAssistant: 'AI हवामान सहाय्यक',
    enterWeatherData: 'बुद्धिमान पर्जन्यमान अंदाजासाठी हवामान डेटा प्रविष्ट करा।',
  },
  ur: {
    prediction: 'پیشگوئی', rain: 'بارش', noRain: 'بارش نہیں',
    confidence: 'اعتماد اسکور', explanation: 'AI وضاحت',
    suggestions: 'تجاویز', insights: 'موسمی بصیرت',
    simpleMode: 'سادہ موڈ', techMode: 'تکنیکی موڈ',
    speakResult: 'نتیجہ بولیں', stopNarration: 'روکیں',
    rainLikely: 'کل بارش کا امکان ہے۔',
    rainUnlikely: 'کل کوئی بارش نہیں۔',
    verifiedBy: 'Random Forest AI سے تصدیق شدہ',
    generatePrediction: 'AI پیشگوئی بنائیں',
    analyzingAI: 'AI سے تجزیہ ہو رہا ہے...',
    weatherParams: 'موسمی پیرامیٹرز',
    fillParams: 'درست پیشگوئی کے لیے تمام 17 پیرامیٹرز بھریں',
    loading: 'لوڈ ہو رہا ہے...', noHistory: 'کوئی تاریخ نہیں',
    noHistoryDesc: 'پہلے ایک پیشگوئی بنائیں!',
    totalRecords: 'کل ریکارڈ', viewDetails: 'تفصیلات دیکھیں',
    dashboard: 'ڈیش بورڈ', predict: 'پیشگوئی',
    history: 'تاریخ', analytics: 'تجزیات',
    settings: 'ترتیبات', logout: 'لاگ آؤٹ',
    aiInsight: 'AI بصیرت', aiSummary: 'AI خلاصہ',
    whyConfidence: 'یہ اعتماد کیوں؟',
    technicalDetails: 'تکنیکی تفصیلات',
    factorInfluence: 'عوامل کا اثر',
    modelAccuracy: 'ماڈل درستگی', totalPredictions: 'کل پیشگوئیاں',
    rainPredictions: 'بارش پیشگوئیاں', dryPredictions: 'خشک پیشگوئیاں',
    confidenceTrend: 'اعتماد رجحان', distribution: 'تقسیم',
    advancedInsights: 'جدید بصیرت', modelPerformance: 'ماڈل کارکردگی',
    predictionRatios: 'پیشگوئی تناسب', confidenceStability: 'اعتماد استحکام',
    noPredictionYet: 'ابھی کوئی پیشگوئی نہیں',
    fillParamsHint: 'موسمی پیرامیٹرز بھریں اور AI پیشگوئی بنائیں۔',
    loadedFromHistory: 'تاریخ سے لوڈ کیا گیا',
    analyzingConditions: 'RainAI موسمی حالات کا تجزیہ کر رہا ہے...',
    generatingExplanation: 'ذہین وضاحت تیار ہو رہی ہے',
    rainYesterday: 'کل بارش ہوئی؟', premiumAccount: 'پریمیم اکاؤنٹ',
    goodMorning: 'صبح بخیر', goodAfternoon: 'دوپہر بخیر', goodEvening: 'شام بخیر',
    aiAssistantActive: 'AI معاون فعال',
    overviewToday: 'آج کا موسمی ذہانت کا جائزہ۔',
    confidenceTrendDesc: 'وقت کے ساتھ پیشگوئی اعتماد',
    last30days: 'پچھلے 30 دن', distributionDesc: 'بارش بمقابلہ خشک پیشگوئیاں',
    rainy: 'بارش', dry: 'خشک',
    model: 'ماڈل', rawConfidence: 'خام اعتماد',
    featuresUsed: 'استعمال شدہ خصوصیات', outputClass: 'آؤٹ پٹ کلاس',
    veryHighConf: 'بہت زیادہ اعتماد', highConf: 'زیادہ اعتماد',
    moderateConf: 'اعتدال پسند اعتماد', lowConf: 'کم اعتماد',
    veryHighConfDesc: 'AI اس پیشگوئی کے بارے میں انتہائی یقین رکھتا ہے۔',
    highConfDesc: 'AI کو پختہ یقین ہے کہ یہ نتیجہ ممکن ہے۔',
    moderateConfDesc: 'AI اس نتیجے کے لیے معقول امکان دیکھتا ہے۔',
    lowConfDesc: 'AI غیر یقینی ہے — حالات ملے جلے ہیں۔',
    navigation: 'نیویگیشن',
    aiWeatherAssistant: 'AI موسمی معاون',
    enterWeatherData: 'ذہین بارش کی پیشگوئی کے لیے موسمی ڈیٹا درج کریں۔',
  },
  ar: {
    prediction: 'التنبؤ', rain: 'مطر', noRain: 'لا مطر',
    confidence: 'درجة الثقة', explanation: 'شرح الذكاء الاصطناعي',
    suggestions: 'الاقتراحات', insights: 'رؤى الطقس',
    simpleMode: 'الوضع البسيط', techMode: 'الوضع التقني',
    speakResult: 'نطق النتيجة', stopNarration: 'إيقاف',
    rainLikely: 'من المرجح هطول المطر غداً.',
    rainUnlikely: 'لا أمطار كبيرة متوقعة غداً.',
    verifiedBy: 'تم التحقق بواسطة Random Forest AI',
    generatePrediction: 'إنشاء تنبؤ AI',
    analyzingAI: 'جارٍ التحليل بالذكاء الاصطناعي...',
    weatherParams: 'معاملات الطقس',
    fillParams: 'أدخل جميع المعاملات الـ 17 للحصول على تنبؤ دقيق',
    loading: 'جار التحميل...', noHistory: 'لا يوجد سجل',
    noHistoryDesc: 'جرب إجراء تنبؤ أولاً!',
    totalRecords: 'إجمالي السجلات', viewDetails: 'عرض التفاصيل',
    dashboard: 'لوحة التحكم', predict: 'التنبؤ',
    history: 'السجل', analytics: 'التحليلات',
    settings: 'الإعدادات', logout: 'تسجيل الخروج',
    aiInsight: 'رؤية الذكاء الاصطناعي', aiSummary: 'ملخص الذكاء الاصطناعي',
    whyConfidence: 'لماذا هذه الثقة؟',
    technicalDetails: 'التفاصيل التقنية',
    factorInfluence: 'تأثير العوامل',
    modelAccuracy: 'دقة النموذج', totalPredictions: 'إجمالي التنبؤات',
    rainPredictions: 'تنبؤات المطر', dryPredictions: 'التنبؤات الجافة',
    confidenceTrend: 'اتجاه الثقة', distribution: 'التوزيع',
    advancedInsights: 'رؤى متقدمة', modelPerformance: 'أداء النموذج',
    predictionRatios: 'نسب التنبؤ', confidenceStability: 'استقرار الثقة',
    noPredictionYet: 'لا يوجد تنبؤ بعد',
    fillParamsHint: 'أدخل معاملات الطقس وأنشئ تنبؤ الذكاء الاصطناعي.',
    loadedFromHistory: 'تم التحميل من السجل',
    analyzingConditions: 'يقوم RainAI بتحليل الظروف الجوية...',
    generatingExplanation: 'جارٍ إنشاء شرح ذكي',
    rainYesterday: 'هل أمطرت أمس؟', premiumAccount: 'حساب مميز',
    goodMorning: 'صباح الخير', goodAfternoon: 'مساء الخير', goodEvening: 'مساء النور',
    aiAssistantActive: 'المساعد الذكي نشط',
    overviewToday: 'نظرة عامة على ذكاء الطقس اليوم.',
    confidenceTrendDesc: 'ثقة التنبؤ عبر الزمن',
    last30days: 'آخر 30 يوماً', distributionDesc: 'توزيع المطر مقابل الجاف',
    rainy: 'ممطر', dry: 'جاف',
    model: 'النموذج', rawConfidence: 'الثقة الخام',
    featuresUsed: 'الميزات المستخدمة', outputClass: 'فئة الإخراج',
    veryHighConf: 'ثقة عالية جداً', highConf: 'ثقة عالية',
    moderateConf: 'ثقة معتدلة', lowConf: 'ثقة منخفضة',
    veryHighConfDesc: 'الذكاء الاصطناعي متأكد جداً من هذا التنبؤ.',
    highConfDesc: 'يعتقد الذكاء الاصطناعي بقوة أن هذه النتيجة محتملة.',
    moderateConfDesc: 'يرى الذكاء الاصطناعي احتمالاً معقولاً لهذه النتيجة.',
    lowConfDesc: 'الذكاء الاصطناعي غير متأكد — الظروف متباينة.',
    navigation: 'التنقل',
    aiWeatherAssistant: 'مساعد الطقس الذكي',
    enterWeatherData: 'أدخل بيانات الطقس للحصول على تنبؤات ذكية بهطول الأمطار.',
  },
};

// ── Confidence Level (translated) ─────────────────────────────────────────────
export const getConfidenceLevel = (confidence, t) => {
  const tr = t || TRANSLATIONS.en;
  if (confidence >= 90) return { label: tr.veryHighConf, color: 'emerald', desc: tr.veryHighConfDesc };
  if (confidence >= 75) return { label: tr.highConf,     color: 'primary', desc: tr.highConfDesc     };
  if (confidence >= 50) return { label: tr.moderateConf, color: 'amber',   desc: tr.moderateConfDesc };
  return                       { label: tr.lowConf,       color: 'red',     desc: tr.lowConfDesc      };
};

// ── Translated factor labels ──────────────────────────────────────────────────
const FACTOR_LABELS = {
  en: {
    highHumidity: 'High Humidity', modHumidity: 'Moderate Humidity', lowHumidity: 'Low Humidity',
    lowPressure: 'Low Pressure', modPressure: 'Moderate Pressure', highPressure: 'High Pressure',
    heavyCloud: 'Heavy Cloud Cover', partialCloud: 'Partial Cloud Cover', clearSkies: 'Clear Skies',
    strongWind: 'Strong Winds', modWind: 'Moderate Winds', calmWind: 'Calm Winds',
    lowSunshine: 'Low Sunshine', modSunshine: 'Moderate Sunshine', highSunshine: 'High Sunshine',
  },
  hi: {
    highHumidity: 'उच्च आर्द्रता', modHumidity: 'मध्यम आर्द्रता', lowHumidity: 'कम आर्द्रता',
    lowPressure: 'कम दबाव', modPressure: 'मध्यम दबाव', highPressure: 'उच्च दबाव',
    heavyCloud: 'घने बादल', partialCloud: 'आंशिक बादल', clearSkies: 'साफ आसमान',
    strongWind: 'तेज हवाएं', modWind: 'मध्यम हवाएं', calmWind: 'शांत हवाएं',
    lowSunshine: 'कम धूप', modSunshine: 'मध्यम धूप', highSunshine: 'तेज धूप',
  },
  mr: {
    highHumidity: 'उच्च आर्द्रता', modHumidity: 'मध्यम आर्द्रता', lowHumidity: 'कमी आर्द्रता',
    lowPressure: 'कमी दाब', modPressure: 'मध्यम दाब', highPressure: 'उच्च दाब',
    heavyCloud: 'दाट ढग', partialCloud: 'अंशतः ढग', clearSkies: 'स्वच्छ आकाश',
    strongWind: 'जोरदार वारे', modWind: 'मध्यम वारे', calmWind: 'शांत वारे',
    lowSunshine: 'कमी सूर्यप्रकाश', modSunshine: 'मध्यम सूर्यप्रकाश', highSunshine: 'जास्त सूर्यप्रकाश',
  },
  ur: {
    highHumidity: 'زیادہ نمی', modHumidity: 'اعتدال پسند نمی', lowHumidity: 'کم نمی',
    lowPressure: 'کم دباؤ', modPressure: 'اعتدال پسند دباؤ', highPressure: 'زیادہ دباؤ',
    heavyCloud: 'گھنے بادل', partialCloud: 'جزوی بادل', clearSkies: 'صاف آسمان',
    strongWind: 'تیز ہوائیں', modWind: 'اعتدال پسند ہوائیں', calmWind: 'پرسکون ہوائیں',
    lowSunshine: 'کم دھوپ', modSunshine: 'اعتدال پسند دھوپ', highSunshine: 'تیز دھوپ',
  },
  ar: {
    highHumidity: 'رطوبة عالية', modHumidity: 'رطوبة معتدلة', lowHumidity: 'رطوبة منخفضة',
    lowPressure: 'ضغط منخفض', modPressure: 'ضغط معتدل', highPressure: 'ضغط مرتفع',
    heavyCloud: 'غيوم كثيفة', partialCloud: 'غيوم جزئية', clearSkies: 'سماء صافية',
    strongWind: 'رياح قوية', modWind: 'رياح معتدلة', calmWind: 'رياح هادئة',
    lowSunshine: 'إشعاع شمسي منخفض', modSunshine: 'إشعاع شمسي معتدل', highSunshine: 'إشعاع شمسي مرتفع',
  },
};

// ── Rule-based explanation (multilingual) ─────────────────────────────────────
export const generateExplanation = (inputs, prediction, lang = 'en') => {
  const isRain = prediction === 'Yes';
  const fl = FACTOR_LABELS[lang] || FACTOR_LABELS.en;
  const factors = [];

  const avgHumidity = (parseFloat(inputs.Humidity9am || 60) + parseFloat(inputs.Humidity3pm || 60)) / 2;
  if (avgHumidity > 75)
    factors.push({ key: 'humidity', icon: '💧', label: fl.highHumidity, severity: 'high',
      text: `Humidity is elevated at ${avgHumidity.toFixed(0)}%, creating moisture-rich air that strongly supports rainfall formation.` });
  else if (avgHumidity > 55)
    factors.push({ key: 'humidity', icon: '💧', label: fl.modHumidity, severity: 'medium',
      text: `Humidity at ${avgHumidity.toFixed(0)}% contributes moderately to rainfall probability.` });
  else
    factors.push({ key: 'humidity', icon: '💧', label: fl.lowHumidity, severity: 'low',
      text: `Low humidity of ${avgHumidity.toFixed(0)}% suggests dry atmospheric conditions.` });

  const avgPressure = (parseFloat(inputs.Pressure9am || 1013) + parseFloat(inputs.Pressure3pm || 1013)) / 2;
  if (avgPressure < 1005)
    factors.push({ key: 'pressure', icon: '🌀', label: fl.lowPressure, severity: 'high',
      text: `Atmospheric pressure of ${avgPressure.toFixed(1)} hPa indicates unstable weather — a strong rain indicator.` });
  else if (avgPressure < 1013)
    factors.push({ key: 'pressure', icon: '🌀', label: fl.modPressure, severity: 'medium',
      text: `Pressure at ${avgPressure.toFixed(1)} hPa shows slightly unstable conditions.` });
  else
    factors.push({ key: 'pressure', icon: '🌀', label: fl.highPressure, severity: 'low',
      text: `High pressure of ${avgPressure.toFixed(1)} hPa typically indicates stable, dry weather.` });

  const avgCloud = (parseFloat(inputs.Cloud9am || 4) + parseFloat(inputs.Cloud3pm || 4)) / 2;
  if (avgCloud > 6)
    factors.push({ key: 'cloud', icon: '☁️', label: fl.heavyCloud, severity: 'high',
      text: `Cloud cover of ${avgCloud.toFixed(1)} oktas is very dense — strongly associated with precipitation.` });
  else if (avgCloud > 3)
    factors.push({ key: 'cloud', icon: '⛅', label: fl.partialCloud, severity: 'medium',
      text: `Moderate cloud cover of ${avgCloud.toFixed(1)} oktas may contribute to rainfall.` });
  else
    factors.push({ key: 'cloud', icon: '☀️', label: fl.clearSkies, severity: 'low',
      text: `Low cloud cover of ${avgCloud.toFixed(1)} oktas suggests mostly clear conditions.` });

  const windGust = parseFloat(inputs.WindGustSpeed || 30);
  if (windGust > 60)
    factors.push({ key: 'wind', icon: '🌬️', label: fl.strongWind, severity: 'high',
      text: `Wind gusts of ${windGust} km/h indicate an active weather system likely bringing rain.` });
  else if (windGust > 35)
    factors.push({ key: 'wind', icon: '🌬️', label: fl.modWind, severity: 'medium',
      text: `Wind gusts of ${windGust} km/h suggest some atmospheric disturbance.` });
  else
    factors.push({ key: 'wind', icon: '🍃', label: fl.calmWind, severity: 'low',
      text: `Light winds of ${windGust} km/h indicate a calm, stable atmosphere.` });

  const sunshine = parseFloat(inputs.Sunshine || 6);
  if (sunshine < 4)
    factors.push({ key: 'sunshine', icon: '🌥️', label: fl.lowSunshine, severity: 'high',
      text: `Only ${sunshine} hours of sunshine suggests heavy cloud cover and likely rain.` });
  else if (sunshine < 7)
    factors.push({ key: 'sunshine', icon: '⛅', label: fl.modSunshine, severity: 'medium',
      text: `${sunshine} hours of sunshine indicates partly cloudy conditions.` });
  else
    factors.push({ key: 'sunshine', icon: '☀️', label: fl.highSunshine, severity: 'low',
      text: `${sunshine} hours of sunshine strongly suggests clear, dry weather.` });

  const highFactors = factors.filter(f => f.severity === 'high').map(f => f.label.toLowerCase());
  const lowFactors  = factors.filter(f => f.severity === 'low').map(f => f.label.toLowerCase());
  const summary = isRain
    ? `Based on the weather data, rainfall is predicted tomorrow. Key contributing factors include ${highFactors.join(', ') || 'multiple weather indicators'}.`
    : `Weather conditions suggest no significant rainfall tomorrow. The atmosphere appears relatively stable with ${lowFactors.join(', ') || 'favorable conditions'}.`;

  return { factors, summary };
};

// ── Translated suggested actions ──────────────────────────────────────────────
const ACTIONS = {
  en: {
    rainHigh: [
      { icon: '☂️', text: 'Carry an umbrella before leaving home.' },
      { icon: '🚗', text: 'Allow extra travel time — roads may be wet.' },
      { icon: '👕', text: 'Wear waterproof clothing or carry a raincoat.' },
      { icon: '🏠', text: 'Secure outdoor furniture and belongings.' },
      { icon: '📱', text: 'Check local weather alerts for updates.' },
    ],
    rainLow: [
      { icon: '☂️', text: 'Consider carrying an umbrella just in case.' },
      { icon: '👀', text: 'Monitor weather conditions throughout the day.' },
      { icon: '🌤️', text: 'Rain is possible but not certain — stay prepared.' },
    ],
    dryHigh: [
      { icon: '☀️', text: 'Great day for outdoor activities!' },
      { icon: '🌿', text: 'Good conditions for gardening or sports.' },
      { icon: '🚴', text: 'Ideal weather for cycling or walking.' },
      { icon: '😎', text: 'Enjoy the clear weather — no rain expected.' },
    ],
    dryLow: [
      { icon: '🌤️', text: 'Weather looks mostly clear — enjoy your day.' },
      { icon: '👀', text: 'Keep an eye on conditions as they may change.' },
    ],
  },
  hi: {
    rainHigh: [
      { icon: '☂️', text: 'घर से निकलने से पहले छाता लेकर जाएं।' },
      { icon: '🚗', text: 'अतिरिक्त यात्रा समय दें — सड़कें गीली हो सकती हैं।' },
      { icon: '👕', text: 'वाटरप्रूफ कपड़े पहनें या रेनकोट साथ रखें।' },
      { icon: '🏠', text: 'बाहरी फर्नीचर और सामान सुरक्षित करें।' },
      { icon: '📱', text: 'अपडेट के लिए स्थानीय मौसम अलर्ट देखें।' },
    ],
    rainLow: [
      { icon: '☂️', text: 'सावधानी के तौर पर छाता साथ रखें।' },
      { icon: '👀', text: 'दिन भर मौसम की स्थिति पर नजर रखें।' },
      { icon: '🌤️', text: 'बारिश संभव है लेकिन निश्चित नहीं — तैयार रहें।' },
    ],
    dryHigh: [
      { icon: '☀️', text: 'बाहरी गतिविधियों के लिए बढ़िया दिन!' },
      { icon: '🌿', text: 'बागवानी या खेल के लिए अच्छी स्थिति।' },
      { icon: '🚴', text: 'साइकिलिंग या पैदल चलने के लिए आदर्श मौसम।' },
      { icon: '😎', text: 'साफ मौसम का आनंद लें — बारिश की उम्मीद नहीं।' },
    ],
    dryLow: [
      { icon: '🌤️', text: 'मौसम ज्यादातर साफ दिखता है — अपना दिन आनंद लें।' },
      { icon: '👀', text: 'स्थितियों पर नजर रखें क्योंकि वे बदल सकती हैं।' },
    ],
  },
  mr: {
    rainHigh: [
      { icon: '☂️', text: 'घरातून निघण्यापूर्वी छत्री घ्या।' },
      { icon: '🚗', text: 'अतिरिक्त प्रवास वेळ द्या — रस्ते ओले असू शकतात।' },
      { icon: '👕', text: 'वॉटरप्रूफ कपडे घाला किंवा रेनकोट सोबत ठेवा।' },
      { icon: '🏠', text: 'बाहेरील फर्निचर आणि सामान सुरक्षित करा।' },
      { icon: '📱', text: 'अपडेटसाठी स्थानिक हवामान अलर्ट तपासा।' },
    ],
    rainLow: [
      { icon: '☂️', text: 'सावधगिरी म्हणून छत्री सोबत ठेवा।' },
      { icon: '👀', text: 'दिवसभर हवामान परिस्थितीवर लक्ष ठेवा।' },
      { icon: '🌤️', text: 'पाऊस शक्य आहे पण निश्चित नाही — तयार राहा।' },
    ],
    dryHigh: [
      { icon: '☀️', text: 'बाहेरील क्रियाकलापांसाठी उत्तम दिवस!' },
      { icon: '🌿', text: 'बागकाम किंवा खेळासाठी चांगली परिस्थिती।' },
      { icon: '🚴', text: 'सायकलिंग किंवा चालण्यासाठी आदर्श हवामान।' },
      { icon: '😎', text: 'स्वच्छ हवामानाचा आनंद घ्या — पाऊस अपेक्षित नाही।' },
    ],
    dryLow: [
      { icon: '🌤️', text: 'हवामान बहुतेक स्वच्छ दिसते — दिवस आनंदात घालवा।' },
      { icon: '👀', text: 'परिस्थिती बदलू शकते म्हणून लक्ष ठेवा।' },
    ],
  },
  ur: {
    rainHigh: [
      { icon: '☂️', text: 'گھر سے نکلنے سے پہلے چھتری لے جائیں۔' },
      { icon: '🚗', text: 'اضافی سفری وقت دیں — سڑکیں گیلی ہو سکتی ہیں۔' },
      { icon: '👕', text: 'واٹر پروف کپڑے پہنیں یا رین کوٹ ساتھ رکھیں۔' },
      { icon: '🏠', text: 'باہری فرنیچر اور سامان محفوظ کریں۔' },
      { icon: '📱', text: 'اپڈیٹس کے لیے مقامی موسمی الرٹس چیک کریں۔' },
    ],
    rainLow: [
      { icon: '☂️', text: 'احتیاط کے طور پر چھتری ساتھ رکھیں۔' },
      { icon: '👀', text: 'دن بھر موسمی حالات پر نظر رکھیں۔' },
      { icon: '🌤️', text: 'بارش ممکن ہے لیکن یقینی نہیں — تیار رہیں۔' },
    ],
    dryHigh: [
      { icon: '☀️', text: 'باہری سرگرمیوں کے لیے بہترین دن!' },
      { icon: '🌿', text: 'باغبانی یا کھیل کے لیے اچھے حالات۔' },
      { icon: '🚴', text: 'سائیکلنگ یا پیدل چلنے کے لیے مثالی موسم۔' },
      { icon: '😎', text: 'صاف موسم سے لطف اٹھائیں — بارش کی توقع نہیں۔' },
    ],
    dryLow: [
      { icon: '🌤️', text: 'موسم زیادہ تر صاف لگتا ہے — دن سے لطف اٹھائیں۔' },
      { icon: '👀', text: 'حالات پر نظر رکھیں کیونکہ وہ بدل سکتے ہیں۔' },
    ],
  },
  ar: {
    rainHigh: [
      { icon: '☂️', text: 'احمل مظلة قبل مغادرة المنزل.' },
      { icon: '🚗', text: 'اسمح بوقت إضافي للسفر — قد تكون الطرق مبللة.' },
      { icon: '👕', text: 'ارتدِ ملابس مقاومة للماء أو احمل معطف المطر.' },
      { icon: '🏠', text: 'أمّن الأثاث الخارجي والممتلكات.' },
      { icon: '📱', text: 'تحقق من تنبيهات الطقس المحلية للحصول على تحديثات.' },
    ],
    rainLow: [
      { icon: '☂️', text: 'فكر في حمل مظلة للاحتياط.' },
      { icon: '👀', text: 'راقب أحوال الطقس طوال اليوم.' },
      { icon: '🌤️', text: 'المطر محتمل لكن غير مؤكد — كن مستعداً.' },
    ],
    dryHigh: [
      { icon: '☀️', text: 'يوم رائع للأنشطة الخارجية!' },
      { icon: '🌿', text: 'ظروف جيدة للبستنة أو الرياضة.' },
      { icon: '🚴', text: 'طقس مثالي لركوب الدراجات أو المشي.' },
      { icon: '😎', text: 'استمتع بالطقس الصافي — لا أمطار متوقعة.' },
    ],
    dryLow: [
      { icon: '🌤️', text: 'يبدو الطقس صافياً في معظمه — استمتع بيومك.' },
      { icon: '👀', text: 'راقب الأحوال لأنها قد تتغير.' },
    ],
  },
};

export const getSuggestedActions = (prediction, confidence, lang = 'en') => {
  const isRain = prediction === 'Yes';
  const isHighConf = confidence >= 75;
  const a = ACTIONS[lang] || ACTIONS.en;
  if (isRain && isHighConf)  return a.rainHigh;
  if (isRain && !isHighConf) return a.rainLow;
  if (!isRain && isHighConf) return a.dryHigh;
  return a.dryLow;
};

// ── Smart Text-to-Speech with voice matching ──────────────────────────────────
let _voicesLoaded = false;
let _voiceCache = [];

const loadVoices = () => new Promise((resolve) => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) { _voiceCache = voices; _voicesLoaded = true; resolve(voices); return; }
  window.speechSynthesis.onvoiceschanged = () => {
    _voiceCache = window.speechSynthesis.getVoices();
    _voicesLoaded = true;
    resolve(_voiceCache);
  };
  // Fallback timeout
  setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
});

export const speakText = async (text, langCode = 'en-US') => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const voices = _voicesLoaded ? _voiceCache : await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Find best matching voice
  const langPrefix = langCode.split('-')[0].toLowerCase();
  const match =
    voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase()) ||
    voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
    voices.find(v => v.lang.toLowerCase().includes(langPrefix)) ||
    null;

  if (match) utterance.voice = match;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// ── Build translated narration ────────────────────────────────────────────────
export const buildNarration = (prediction, confidence, t) => {
  const tr = t || TRANSLATIONS.en;
  const confLevel = getConfidenceLevel(confidence, tr);
  const mainText = prediction === 'Yes' ? tr.rainLikely : tr.rainUnlikely;
  return `${mainText} ${confLevel.label}. ${confLevel.desc}`;
};

// ── AI Dashboard Summary (translated) ────────────────────────────────────────
export const getAIDashboardSummary = (stats, lang = 'en') => {
  if (!stats) return null;
  const total = stats.totalPredictions || 0;
  const rainCount = stats.distribution?.Yes || 0;
  const rainPct = total > 0 ? Math.round((rainCount / total) * 100) : 0;

  const summaries = {
    en: {
      none: 'No predictions yet. Start by entering weather data in the Predict section.',
      rainy: `Your predictions show a ${rainPct}% rain tendency. High humidity and low pressure patterns are dominant in your data.`,
      dry: `Mostly dry conditions detected (${100 - rainPct}% dry). Your region shows stable atmospheric patterns.`,
      balanced: `Balanced weather patterns detected — ${rainPct}% rain vs ${100 - rainPct}% dry across ${total} predictions.`,
    },
    hi: {
      none: 'अभी कोई पूर्वानुमान नहीं। Predict अनुभाग में मौसम डेटा दर्ज करके शुरू करें।',
      rainy: `आपके पूर्वानुमान ${rainPct}% बारिश की प्रवृत्ति दिखाते हैं। उच्च आर्द्रता और कम दबाव के पैटर्न प्रमुख हैं।`,
      dry: `ज्यादातर शुष्क स्थितियां पाई गईं (${100 - rainPct}% शुष्क)। आपके क्षेत्र में स्थिर वायुमंडलीय पैटर्न हैं।`,
      balanced: `संतुलित मौसम पैटर्न — ${total} पूर्वानुमानों में ${rainPct}% बारिश बनाम ${100 - rainPct}% शुष्क।`,
    },
    mr: {
      none: 'अद्याप कोणतेही अंदाज नाहीत। Predict विभागात हवामान डेटा प्रविष्ट करून सुरू करा।',
      rainy: `तुमचे अंदाज ${rainPct}% पाऊस प्रवृत्ती दर्शवतात। उच्च आर्द्रता आणि कमी दाब नमुने प्रमुख आहेत।`,
      dry: `बहुतेक कोरड्या परिस्थिती आढळल्या (${100 - rainPct}% कोरडे). तुमच्या प्रदेशात स्थिर वातावरणीय नमुने आहेत।`,
      balanced: `संतुलित हवामान नमुने — ${total} अंदाजांमध्ये ${rainPct}% पाऊस विरुद्ध ${100 - rainPct}% कोरडे।`,
    },
    ur: {
      none: 'ابھی کوئی پیشگوئی نہیں۔ Predict سیکشن میں موسمی ڈیٹا درج کرکے شروع کریں۔',
      rainy: `آپ کی پیشگوئیاں ${rainPct}% بارش کا رجحان ظاہر کرتی ہیں۔ زیادہ نمی اور کم دباؤ کے نمونے غالب ہیں۔`,
      dry: `زیادہ تر خشک حالات پائے گئے (${100 - rainPct}% خشک)۔ آپ کے علاقے میں مستحکم فضائی نمونے ہیں۔`,
      balanced: `متوازن موسمی نمونے — ${total} پیشگوئیوں میں ${rainPct}% بارش بمقابلہ ${100 - rainPct}% خشک۔`,
    },
    ar: {
      none: 'لا توجد تنبؤات بعد. ابدأ بإدخال بيانات الطقس في قسم التنبؤ.',
      rainy: `تُظهر تنبؤاتك ميلاً للمطر بنسبة ${rainPct}%. أنماط الرطوبة العالية والضغط المنخفض هي السائدة.`,
      dry: `تم اكتشاف ظروف جافة في معظمها (${100 - rainPct}% جاف). تُظهر منطقتك أنماطاً جوية مستقرة.`,
      balanced: `أنماط طقس متوازنة — ${rainPct}% مطر مقابل ${100 - rainPct}% جاف عبر ${total} تنبؤاً.`,
    },
  };

  const s = summaries[lang] || summaries.en;
  if (total === 0) return s.none;
  if (rainPct > 60) return s.rainy;
  if (rainPct < 30) return s.dry;
  return s.balanced;
};

