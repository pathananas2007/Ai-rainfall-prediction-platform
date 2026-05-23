import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useLang } from '../context/LanguageContext';

const QUICK_QUESTIONS = {
  en: ['Will it rain tomorrow?', 'Explain humidity', 'Why is confidence low?', 'Weather advice today'],
  hi: ['कल बारिश होगी?', 'आर्द्रता समझाएं', 'विश्वास कम क्यों है?', 'आज का मौसम सलाह'],
};

const AIChatAssistant = ({ predictionContext }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const bottomRef = useRef(null);
  const { lang, t } = useLang();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: lang === 'hi' ? 'नमस्ते! मैं RainAI हूं। मौसम के बारे में कुछ भी पूछें।' : 'Hi! I\'m RainAI. Ask me anything about weather, predictions, or what to expect today.' }]);
    }
    
    // Fetch latest prediction history to provide context when opened globally
    if (open && !predictionContext && !latestPrediction) {
      api.get('/predict/history')
        .then(res => {
          if (res.data && res.data.length > 0) {
            setLatestPrediction(res.data[0]);
          }
        })
        .catch(err => console.error("Failed to fetch prediction history for AI context", err));
    }
  }, [open, lang, messages.length, predictionContext, latestPrediction]);

  useEffect(() => {
    const handleOpenChat = (e) => {
      setOpen(true);
      if (e.detail?.message) {
        setMessages(prev => {
          if (prev.length === 0) {
            return [
              { role: 'bot', text: 'Hi! I\'m RainAI.' },
              { role: 'bot', text: e.detail.message }
            ];
          }
          return [...prev, { role: 'bot', text: e.detail.message }];
        });
      }
    };
    window.addEventListener('open-chat-with-context', handleOpenChat);
    return () => window.removeEventListener('open-chat-with-context', handleOpenChat);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, errorMsg]);

  const simulateStreaming = (fullText) => {
    let currentText = "";
    const msgId = Date.now();
    
    // Add empty message first
    setMessages(prev => [...prev, { id: msgId, role: 'bot', text: '' }]);
    
    const words = fullText.split(" ");
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i > 0 ? " " : "") + words[i];
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: currentText } : m));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50); // 50ms per word simulation
  };

  const sendMessage = async (text, isRetry = false) => {
    const msg = text || input.trim();
    if (!msg && !isRetry) return;
    
    if (!isRetry) {
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text: msg }]);
    }
    
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const ctx = {};
      const activeContext = predictionContext || latestPrediction;
      if (activeContext) {
        if (activeContext.prediction)  ctx.prediction  = activeContext.prediction;
        if (activeContext.confidence)  ctx.confidence  = activeContext.confidence;
        if (activeContext.inputs) {
          const inp = activeContext.inputs;
          if (inp.Humidity9am && inp.Humidity3pm) ctx.humidity = ((parseFloat(inp.Humidity9am) + parseFloat(inp.Humidity3pm)) / 2).toFixed(0);
        }
      }

      // Add last message as part of the retry context if needed
      const sendMsg = isRetry ? messages[messages.length-1].text : msg;

      const res = await api.post('/ai/chat', {
        message: sendMsg,
        context: ctx,
        language: lang,
      });
      
      simulateStreaming(res.data.reply);
      
    } catch (err) {
      console.error("AI Error:", err);
      setErrorMsg(err.response?.data?.reply || err.message || "Failed to connect to AI");
    } finally {
      setLoading(false);
    }
  };

  const quickQs = QUICK_QUESTIONS[lang] || QUICK_QUESTIONS.en;

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/50"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={26} className="text-white" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
                <MessageCircle size={26} className="text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            style={{ height: '600px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-indigo-600 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-base">RainAI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-white/80 text-xs font-medium">Powered by Gemini AI</p>
                </div>
              </div>
              <Sparkles size={18} className="text-white/60 ml-auto" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'bot' ? 'bg-gradient-to-br from-primary-500 to-indigo-600' : 'bg-slate-200'}`}>
                    {msg.role === 'bot' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-slate-600" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100' : 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-tr-sm'}`}>
                    {msg.text || (msg.role === 'bot' ? <span className="w-2 h-4 inline-block bg-primary-400 animate-pulse"></span> : '')}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 relative overflow-hidden shadow-sm">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/50 to-transparent z-0"></div>
                    <span className="text-sm text-slate-500 font-bold z-10">RainAI is thinking</span>
                    <div className="flex items-center gap-1.5 z-10">
                      {[0,1,2].map(i => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertCircle size={16} className="text-red-500" />
                  </div>
                  <div className="max-w-[75%] bg-white border border-red-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-2">
                    <p className="text-sm font-bold text-red-600">Connection Error</p>
                    <p className="text-xs font-medium text-slate-600">{errorMsg}</p>
                    <button 
                      onClick={() => sendMessage(null, true)}
                      className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors"
                    >
                      <RefreshCw size={14} /> Retry Message
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && !loading && !errorMsg && (
              <div className="px-4 pb-2 pt-2 flex flex-wrap gap-2 bg-slate-50/50">
                {quickQs.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-xs font-bold text-primary-600 bg-white shadow-sm hover:shadow-md px-3 py-2 rounded-xl transition-all border border-slate-100 flex items-center gap-1.5 hover:border-primary-200">
                    <Sparkles size={12} className="text-primary-400" /> {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask about weather, confidence, analytics..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 focus:bg-white outline-none text-sm font-medium transition-all"
                  disabled={loading}
                />
                <motion.button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center disabled:opacity-40 shadow-lg shadow-primary-500/30 flex-shrink-0">
                  {loading ? <Loader2 size={18} className="text-white animate-spin" /> : <Send size={18} className="text-white ml-0.5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
