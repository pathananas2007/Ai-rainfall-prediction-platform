import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { CloudRain, Wind, Thermometer, Droplets, Gauge, Sun, Send,
  CheckCircle, Sparkles, Volume2, VolumeX, Globe, ToggleLeft, ToggleRight,
  Brain, Loader2, Zap, TrendingUp } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  generateExplanation, getSuggestedActions, getConfidenceLevel,
  LANGUAGES, TRANSLATIONS, speakText, stopSpeech, LANG_SPEECH_CODES, buildNarration
} from '../utils/aiEngine';
import { useLang } from '../context/LanguageContext';
import WeatherComparison from '../components/WeatherComparison';

// ── Typing animation ──────────────────────────────────────────────────────────
const TypingText = ({ text, speed = 16 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-primary-500 ml-0.5 animate-pulse align-middle" />}
    </span>
  );
};

// ── AI Thinking Loader ────────────────────────────────────────────────────────
const AIThinkingLoader = ({ steps, t }) => {
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    if (!steps?.length) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(timer);
  }, [steps]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-primary-50 border border-indigo-200 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <Brain size={14} className="text-indigo-600 absolute inset-0 m-auto" />
        </div>
        <div>
          <p className="text-sm font-black text-indigo-700">{t.analyzingConditions}</p>
          <p className="text-xs text-indigo-500 font-medium">{t.generatingExplanation}</p>
        </div>
        <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold">Gemini AI</span>
      </div>
      {/* Thinking steps */}
      <div className="space-y-2">
        {(steps || []).map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0.3 }} animate={{ opacity: i === currentStep ? 1 : 0.35 }}
            className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${i === currentStep ? 'bg-indigo-500' : i < currentStep ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            <p className={`text-xs font-medium transition-colors ${i === currentStep ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>{step}</p>
            {i === currentStep && <Loader2 size={12} className="text-indigo-500 animate-spin ml-auto" />}
            {i < currentStep && <CheckCircle size={12} className="text-emerald-500 ml-auto" />}
          </motion.div>
        ))}
      </div>
      {/* Shimmer bars */}
      <div className="space-y-2 pt-1">
        {[85, 65, 90, 55].map((w, i) => (
          <div key={i} className="h-2 bg-indigo-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-indigo-300 to-primary-400 rounded-full"
              animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              style={{ width: w + '%' }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Feature Importance Chart ──────────────────────────────────────────────────
const FeatureImportanceChart = ({ importance, t }) => {
  const items = [
    { key: 'Humidity', icon: '💧', color: '#0ea5e9' },
    { key: 'Pressure', icon: '🌀', color: '#6366f1' },
    { key: 'Cloud',    icon: '☁️', color: '#64748b' },
    { key: 'Sunshine', icon: '☀️', color: '#f59e0b' },
    { key: 'Wind',     icon: '🌬️', color: '#10b981' },
    { key: 'Temp',     icon: '🌡️', color: '#ef4444' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Brain size={15} className="text-indigo-500" />
        <h3 className="text-sm font-black text-slate-800">{t.factorInfluence}</h3>
        <span className="ml-auto text-xs text-slate-400 font-bold">XAI</span>
      </div>
      <div className="space-y-3">
        {items.map(item => {
          const pct = importance?.[item.key] || 0;
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  {item.icon} {item.key}
                </span>
                <span className="text-xs font-black" style={{ color: item.color }}>{pct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                  className="h-full rounded-full" style={{ background: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ── Insight Card ──────────────────────────────────────────────────────────────
const InsightCard = ({ icon, title, text, severity, delay = 0 }) => {
  const styles = {
    high:   { border: 'border-red-200',     bg: 'bg-red-50',     dot: 'bg-red-500',     label: 'text-red-700'     },
    medium: { border: 'border-amber-200',   bg: 'bg-amber-50',   dot: 'bg-amber-500',   label: 'text-amber-700'   },
    low:    { border: 'border-emerald-200', bg: 'bg-emerald-50', dot: 'bg-emerald-500', label: 'text-emerald-700' },
  };
  const s = styles[severity] || styles.low;
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }} whileHover={{ x: 3 }}
      className={`flex gap-3 p-3.5 rounded-2xl border ${s.border} ${s.bg}`}>
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <p className={`text-xs font-black ${s.label}`}>{title}</p>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{text}</p>
      </div>
    </motion.div>
  );
};

// ── Confidence Meter ──────────────────────────────────────────────────────────
const ConfidenceMeter = ({ confidence, t }) => {
  const tr = t || TRANSLATIONS.en;
  const level = getConfidenceLevel(confidence, tr);
  const colorMap = { emerald: '#10b981', primary: '#0ea5e9', amber: '#f59e0b', red: '#ef4444' };
  const bgMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    red:     'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-slate-600">{tr.confidence}</span>
        <span className={`text-xs font-black px-3 py-1 rounded-full border ${bgMap[level.color]}`}>{level.label}</span>
      </div>
      <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${colorMap[level.color]}, ${colorMap[level.color]}bb)` }} />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600">{confidence.toFixed(1)}%</span>
      </div>
      <p className="text-xs text-slate-500 font-medium italic">{level.desc}</p>
    </div>
  );
};

// ── AI Result Panel ───────────────────────────────────────────────────────────
const AIResultPanel = ({ result, aiExplanation, aiLoading, thinkingSteps, simpleMode, isSpeaking, onSpeak, t, lang }) => {
  const isRain = result.prediction === 'Yes';
  const { factors } = generateExplanation(result.inputs || {}, result.prediction, lang);

  return (
    <div className="space-y-5">
      {/* ── Hero result card ── */}
      <div className={`relative p-8 rounded-3xl border overflow-hidden text-center space-y-5
        ${isRain
          ? 'bg-gradient-to-br from-primary-50 via-indigo-50 to-blue-50 border-primary-200'
          : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200'}`}>
        <div className={`absolute top-0 left-0 w-full h-1.5
          ${isRain ? 'bg-gradient-to-r from-primary-400 via-indigo-500 to-purple-500'
                   : 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400'}`} />

        {/* Animated icon */}
        <div className="relative mx-auto w-32 h-32">
          {isRain && (
            <>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl" />
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} animate={{ y: [0, 40], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeIn' }}
                  className="absolute w-0.5 h-3 bg-primary-400 rounded-full"
                  style={{ left: `${20 + i * 12}%`, top: '70%' }} />
              ))}
            </>
          )}
          {!isRain && (
            <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-amber-300/30 blur-xl" />
          )}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl relative z-10
              ${isRain ? 'bg-gradient-to-br from-primary-400 to-indigo-600 shadow-primary-300/60'
                       : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-300/60'}`}>
            <CloudRain size={60} className="text-white" />
          </motion.div>
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.prediction}</p>
          <p className={`text-6xl font-black tracking-tight ${isRain ? 'text-primary-600' : 'text-amber-600'}`}>
            {isRain ? t.rain : t.noRain}
          </p>
          {simpleMode && (
            <p className="text-sm text-slate-600 font-medium mt-2 max-w-[220px] mx-auto leading-relaxed">
              {isRain ? t.rainLikely : t.rainUnlikely}
            </p>
          )}
        </div>

        <ConfidenceMeter confidence={result.confidence} t={t} />

        {/* Glowing voice button */}
        <div className="flex justify-center">
          <motion.button onClick={onSpeak} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all
              ${isSpeaking
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-red-400/40'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-primary-400 hover:shadow-lg'}`}>
            {isSpeaking && (
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-red-400/20" />
            )}
            {isSpeaking
              ? <><VolumeX size={18} className="relative" /> {t.stopNarration}</>
              : <><Volume2 size={18} /> {t.speakResult}</>}
            {isSpeaking && (
              <div className="flex gap-0.5 items-center relative">
                {[1,2,3,2,1].map((h, i) => (
                  <motion.div key={i} animate={{ scaleY: [1, h, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-0.5 bg-white rounded-full" style={{ height: '12px' }} />
                ))}
              </div>
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-xs">
          <CheckCircle size={14} /> {t.verifiedBy}
        </div>
      </div>

      {/* Technical mode */}
      {!simpleMode && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-indigo-500" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{t.technicalDetails}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t.model,         value: 'Random Forest' },
              { label: t.rawConfidence, value: result.confidence.toFixed(3) + '%' },
              { label: t.featuresUsed,  value: '17' },
              { label: t.outputClass,   value: result.prediction === 'Yes' ? '1 (Rain)' : '0 (No Rain)' },
            ].map(item => (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 font-bold text-xs mb-1">{item.label}</p>
                <p className="font-black text-slate-800 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Thinking / Summary */}
      {aiLoading ? (
        <AIThinkingLoader steps={thinkingSteps} t={t} />
      ) : aiExplanation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-primary-50 border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-indigo-700">{t.aiSummary}</span>
            <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Gemini AI</span>
          </div>
          <p className="text-sm text-indigo-900 leading-relaxed font-medium">
            <TypingText text={aiExplanation.summary} speed={18} />
          </p>
        </motion.div>
      )}

      {/* AI Insight Cards */}
      {factors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-primary-500" />
            <h3 className="text-sm font-black text-slate-800">{t.insights}</h3>
          </div>
          <div className="space-y-2">
            {factors.map((f, i) => (
              <InsightCard key={f.key} icon={f.icon} title={f.label} text={f.text}
                severity={f.severity} delay={0.05 * i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Feature Importance (always shown) */}
      {aiExplanation?.feature_importance && (
        <FeatureImportanceChart importance={aiExplanation.feature_importance} t={t} />
      )}

      {/* Confidence reason */}
      {aiExplanation?.confidence_reason && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{t.whyConfidence}</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
            "{aiExplanation.confidence_reason}"
          </p>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {aiExplanation?.recommendations?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{isRain ? '☂️' : '☀️'}</span>
            <h3 className="text-sm font-black text-slate-800">{t.suggestions}</h3>
          </div>
          <div className="space-y-2">
            {aiExplanation.recommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors
                  ${isRain ? 'bg-primary-50 hover:bg-primary-100' : 'bg-amber-50 hover:bg-amber-100'}`}>
                <span className={`font-black text-sm mt-0.5 ${isRain ? 'text-primary-500' : 'text-amber-500'}`}>→</span>
                <p className="text-sm font-bold text-slate-700">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Predict = () => {
  const location = useLocation();
  const resultRef = useRef(null);
  const { lang, changeLang, t } = useLang();

  const [formData, setFormData] = useState({
    MinTemp: '', MaxTemp: '', Rainfall: '', Evaporation: '', Sunshine: '',
    WindGustSpeed: '', WindSpeed9am: '', WindSpeed3pm: '', Humidity9am: '',
    Humidity3pm: '', Pressure9am: '', Pressure3pm: '', Cloud9am: '',
    Cloud3pm: '', Temp9am: '', Temp3pm: '', RainYesterday: 'No'
  });
  const [result, setResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Load from History navigation
  useEffect(() => {
    const incoming = location.state?.result;
    if (!incoming) return;
    setResult(incoming);
    if (incoming.inputs) {
      const filled = {};
      Object.keys(incoming.inputs).forEach(k => { filled[k] = String(incoming.inputs[k] ?? ''); });
      setFormData(prev => ({ ...prev, ...filled }));
    }
    if (incoming.ai_explanation) {
      setAiExplanation(incoming.ai_explanation);
      if (incoming.ai_explanation.thinking_steps) {
        setThinkingSteps(incoming.ai_explanation.thinking_steps);
      }
    } else if (incoming.inputs) {
      const fb = generateExplanation(incoming.inputs, incoming.prediction, lang);
      setAiExplanation({
        summary: fb.summary,
        explanation: fb.factors.map(f => f.text).join(' '),
        confidence_reason: getConfidenceLevel(incoming.confidence, t).desc,
        recommendations: getSuggestedActions(incoming.prediction, incoming.confidence, lang).map(s => s.text),
        feature_importance: null,
      });
    }
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }, [location.state]);

  const inputs = [
    { name: 'MinTemp',       label: 'Min Temp (°C)',      icon: Thermometer },
    { name: 'MaxTemp',       label: 'Max Temp (°C)',      icon: Thermometer },
    { name: 'Rainfall',      label: 'Rainfall (mm)',      icon: CloudRain   },
    { name: 'Evaporation',   label: 'Evaporation (mm)',   icon: Droplets    },
    { name: 'Sunshine',      label: 'Sunshine (hrs)',     icon: Sun         },
    { name: 'WindGustSpeed', label: 'Wind Gust (km/h)',   icon: Wind        },
    { name: 'WindSpeed9am',  label: 'Wind 9am (km/h)',    icon: Wind        },
    { name: 'WindSpeed3pm',  label: 'Wind 3pm (km/h)',    icon: Wind        },
    { name: 'Humidity9am',   label: 'Humidity 9am (%)',   icon: Droplets    },
    { name: 'Humidity3pm',   label: 'Humidity 3pm (%)',   icon: Droplets    },
    { name: 'Pressure9am',   label: 'Pressure 9am (hPa)', icon: Gauge       },
    { name: 'Pressure3pm',   label: 'Pressure 3pm (hPa)', icon: Gauge       },
    { name: 'Cloud9am',      label: 'Cloud 9am (oktas)',  icon: CloudRain   },
    { name: 'Cloud3pm',      label: 'Cloud 3pm (oktas)',  icon: CloudRain   },
    { name: 'Temp9am',       label: 'Temp 9am (°C)',      icon: Thermometer },
    { name: 'Temp3pm',       label: 'Temp 3pm (°C)',      icon: Thermometer },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiExplanation(null);
    setAiLoading(true);
    setThinkingSteps([
      `Analyzing humidity levels...`,
      `Evaluating atmospheric pressure...`,
      `Assessing cloud cover patterns...`,
      `Running Random Forest model...`,
      `Generating AI insights...`,
      `Preparing multilingual response...`,
    ]);
    try {
      const formattedData = {};
      Object.keys(formData).forEach(key => {
        formattedData[key] = key === 'RainYesterday' ? formData[key] : parseFloat(formData[key]);
      });
      const res = await api.post('/predict', formattedData);
      setResult(res.data);
      if (res.data.ai_explanation) {
        setAiExplanation(res.data.ai_explanation);
        if (res.data.ai_explanation.thinking_steps) {
          setThinkingSteps(res.data.ai_explanation.thinking_steps);
        }
      } else {
        const fb = generateExplanation(formData, res.data.prediction, lang);
        setAiExplanation({
          summary: fb.summary,
          explanation: fb.factors.map(f => f.text).join(' '),
          confidence_reason: getConfidenceLevel(res.data.confidence, t).desc,
          recommendations: getSuggestedActions(res.data.prediction, res.data.confidence, lang).map(s => s.text),
          feature_importance: null,
        });
      }
      toast.success('AI prediction generated!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  const handleSpeak = useCallback(() => {
    if (isSpeaking) { stopSpeech(); setIsSpeaking(false); return; }
    if (!result) return;
    const narration = buildNarration(result.prediction, result.confidence, t);
    speakText(narration, LANG_SPEECH_CODES[lang]);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 12000);
  }, [isSpeaking, result, t, lang]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{t.aiWeatherAssistant}</h1>
          <p className="text-lg text-slate-500 font-medium">{t.enterWeatherData}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setSimpleMode(!simpleMode)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-400 transition-all text-sm font-black text-slate-700">
            {simpleMode ? <ToggleLeft size={18} className="text-primary-500" /> : <ToggleRight size={18} className="text-indigo-500" />}
            {simpleMode ? t.simpleMode : t.techMode}
          </button>
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-400 transition-all text-sm font-black text-slate-700">
              <Globe size={16} className="text-primary-500" />
              {LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.label}
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 min-w-[160px]">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { changeLang(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${lang === l.code ? 'bg-primary-50 text-primary-700' : 'text-slate-700'}`}>
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Form */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-3 p-8 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-7">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="p-3 bg-primary-50 rounded-2xl"><Sparkles size={22} className="text-primary-600" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{t.weatherParams}</h2>
              <p className="text-sm text-slate-500 font-medium">{t.fillParams}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {inputs.map((input) => (
              <div key={input.name} className="space-y-1.5">
                <label className="text-xs font-black text-slate-600 flex items-center gap-1.5 ml-1">
                  <input.icon size={13} className="text-primary-500" /> {input.label}
                </label>
                <input type="number" step="0.1" name={input.name} required
                  value={formData[input.name]} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="0.0" />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 flex items-center gap-1.5 ml-1">
                <CloudRain size={13} className="text-primary-500" /> {t.rainYesterday}
              </label>
              <select name="RainYesterday" value={formData.RainYesterday} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-sm font-medium">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full py-5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50">
            {loading
              ? <><Loader2 size={22} className="animate-spin" /> {t.analyzingAI}</>
              : <><Send size={22} /> {t.generatePrediction}</>}
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="pt-16"
          >
            <WeatherComparison prediction={result?.prediction} confidence={result?.confidence} />
          </motion.div>
        </motion.form>

        {/* Result Panel */}
        <div ref={resultRef} id="result-panel" className="xl:col-span-2 space-y-5">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {location.state?.result && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-2xl w-fit mb-4">
                    <span className="text-xs font-black text-indigo-600">📋 {t.loadedFromHistory}</span>
                    <span className="text-xs text-indigo-400 font-medium">
                      {new Date(location.state.result.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <AIResultPanel
                  result={result} aiExplanation={aiExplanation} aiLoading={aiLoading}
                  thinkingSteps={thinkingSteps} simpleMode={simpleMode}
                  isSpeaking={isSpeaking} onSpeak={handleSpeak} t={t} lang={lang}
                />
              </motion.div>
            ) : (
              <motion.div key="placeholder"
                className="p-12 rounded-3xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-5 min-h-[420px]">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <CloudRain size={48} className="text-slate-300" />
                </motion.div>
                <div>
                  <p className="text-lg font-black text-slate-500 mb-2">{t.noPredictionYet}</p>
                  <p className="text-sm text-slate-400 max-w-[200px] mx-auto leading-relaxed">{t.fillParamsHint}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {['Gemini AI', 'XAI', 'Voice', 'Multilingual'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-black rounded-full">{tag}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Predict;
