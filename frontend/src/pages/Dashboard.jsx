import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { CloudRain, TrendingUp, CheckCircle2, AlertCircle, ArrowUpRight, Brain, Sparkles, Lightbulb } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { getAIDashboardSummary } from '../utils/aiEngine';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { lang, t } = useLang();

  useEffect(() => {
    api.get('/analytics/user').then(res => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: t.totalPredictions, value: stats?.totalPredictions || 0, icon: CloudRain, bg: 'bg-primary-50', color: 'text-primary-600', glow: 'hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] hover:border-primary-300 hover:-translate-y-1', change: '+12%' },
    { title: t.modelAccuracy,    value: '86%',                        icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-600', glow: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:border-emerald-300 hover:-translate-y-1', change: '+2.1%' },
    { title: t.rainPredictions,  value: stats?.distribution?.Yes || 0, icon: CheckCircle2, bg: 'bg-orange-50', color: 'text-orange-600', glow: 'hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:border-orange-300 hover:-translate-y-1', change: '+5%' },
    { title: t.dryPredictions,   value: stats?.distribution?.No || 0,  icon: AlertCircle, bg: 'bg-purple-50', color: 'text-purple-600', glow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:border-purple-300 hover:-translate-y-1', change: '+8%' },
  ];

  const aiSummary = getAIDashboardSummary(stats, lang);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening;

  if (loading) return (
    <div className="p-10 flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-bold text-slate-500">{t.loading}</p>
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-xl text-slate-500 font-medium mt-2">{t.overviewToday}</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-2xl">
          <Brain size={20} className="text-primary-600" />
          <span className="text-sm font-black text-primary-700">{t.aiAssistantActive}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-primary-50 border border-indigo-200 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-100 rounded-xl flex-shrink-0">
            <Lightbulb size={22} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-black text-indigo-700 mb-1 flex items-center gap-2">
              <Sparkles size={14} /> {t.aiInsight}
            </p>
            <p className="text-base text-indigo-800 font-medium leading-relaxed">{aiSummary}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all duration-300 group ${card.glow || 'hover:shadow-xl hover:-translate-y-1'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={28} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <ArrowUpRight size={14} /> {card.change}
              </span>
            </div>
            <p className="text-base font-bold text-slate-500 mb-2">{card.title}</p>
            <p className="text-5xl font-black text-slate-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="xl:col-span-2 p-10 rounded-3xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{t.confidenceTrend}</h2>
              <p className="text-slate-500 font-medium mt-1">{t.confidenceTrendDesc}</p>
            </div>
            <span className="px-4 py-2 bg-primary-50 text-primary-600 font-bold rounded-xl text-sm">{t.last30days}</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={stats?.recentHistory || []}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '13px', fontWeight: 600 }} />
                <Area type="monotone" dataKey="confidence" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorConf)" dot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">{t.distribution}</h2>
            <p className="text-slate-500 font-medium mt-1">{t.distributionDesc}</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={[{ name: t.rainy, count: stats?.distribution?.Yes || 0 }, { name: t.dry, count: stats?.distribution?.No || 0 }]} barSize={56}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: '#64748b', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '13px', fontWeight: 600 }} />
                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                  <Cell fill="#0ea5e9" /><Cell fill="#6366f1" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;