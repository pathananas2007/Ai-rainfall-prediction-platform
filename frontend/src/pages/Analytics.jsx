import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, Target, Activity, Zap, Brain, Lightbulb, CloudRain, Sun,
  Download, Filter, Calendar, RefreshCw, Share2, FileText, Image as ImageIcon,
  ChevronDown, Check
} from 'lucide-react';
import api from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { getAIDashboardSummary } from '../utils/aiEngine';
import HelpTooltip from '../components/Tooltip';
import toast from 'react-hot-toast';

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-black text-slate-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-black" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.name === 'confidence' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

// ── AI Insight Banner ─────────────────────────────────────────────────────────
const AIInsightBanner = ({ stats, lang, t }) => {
  const summary = getAIDashboardSummary(stats, lang);
  if (!summary) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-primary-50 to-purple-50 border border-indigo-200 flex items-start gap-4">
      <div className="p-2.5 bg-indigo-100 rounded-xl flex-shrink-0">
        <Lightbulb size={20} className="text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-black text-indigo-700 mb-1 flex items-center gap-2">
          <Brain size={14} /> {t.aiInsight}
        </p>
        <p className="text-sm text-indigo-800 font-medium leading-relaxed">{summary}</p>
      </div>
    </motion.div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, bg, color, delay, trend }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)' }}
    className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all cursor-default">
    <div className="flex items-start justify-between mb-5">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center`}>
        <Icon size={28} />
      </div>
      {trend && (
        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{trend}</span>
      )}
    </div>
    <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
    <p className="text-4xl font-black text-slate-900 mb-1">{value}</p>
    {sub && <p className="text-xs font-bold text-slate-400">{sub}</p>}
  </motion.div>
);

// ── Main Analytics ────────────────────────────────────────────────────────────
const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90, all
  const [compareMode, setCompareMode] = useState(false);
  const [compareRange, setCompareRange] = useState('7');
  const [compareStats, setCompareStats] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { lang, t } = useLang();
  const { formatDate, temperatureUnit, windSpeedUnit } = useSettings();

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const res = await api.get(`/analytics/user?range=${timeRange}`);
      setStats(res.data);
      
      // Fetch comparison data if compare mode is on
      if (compareMode) {
        const compareRes = await api.get(`/analytics/user?range=${compareRange}`);
        setCompareStats(compareRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, compareMode, compareRange]);

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      toast.success('Comparison mode enabled!');
    }
  };

  const handleExportPDF = () => {
    toast.success('PDF export feature coming soon!');
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    
    const csvData = [
      ['Date', 'Prediction', 'Confidence', 'Temperature', 'Wind Speed'],
      ...(stats.recentHistory || []).map(item => [
        item.date,
        item.prediction,
        item.confidence,
        item.temperature || 'N/A',
        item.windSpeed || 'N/A'
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rainai-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
    setShowExportMenu(false);
  };

  const handleExportImage = async () => {
    toast.success('Image export feature coming soon!');
    setShowExportMenu(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'RainAI Analytics',
        text: `My weather prediction analytics: ${stats?.totalPredictions || 0} predictions with ${rainRatio}% rain probability`,
        url: window.location.href
      }).then(() => toast.success('Shared successfully!'))
        .catch(() => toast.error('Failed to share'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981'];

  if (loading) return (
    <div className="p-10 flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-bold text-slate-500">{t.loading}</p>
      </div>
    </div>
  );

  const pieData = [
    { name: t.rainy, value: stats?.distribution?.Yes || 0 },
    { name: t.dry,   value: stats?.distribution?.No  || 0 },
  ];
  const rainRatio = stats?.distribution?.Yes
    ? Math.round((stats.distribution.Yes / (stats.totalPredictions || 1)) * 100) : 0;

  // Enrich history with gradient data
  const historyData = (stats?.recentHistory || []).map((item, i) => ({
    ...item,
    fill: item.confidence > 80 ? '#10b981' : item.confidence > 60 ? '#0ea5e9' : '#f59e0b',
  }));

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">{t.advancedInsights}</h1>
          <p className="text-lg text-slate-500 font-medium">Deep dive into your prediction performance and patterns.</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Range Filter */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Compare Mode Toggle */}
          <HelpTooltip content="Compare different time periods" position="bottom">
            <motion.button
              onClick={toggleCompareMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 border-2 rounded-xl transition-all ${
                compareMode
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              <TrendingUp size={18} />
            </motion.button>
          </HelpTooltip>

          {/* Refresh Button */}
          <HelpTooltip content="Refresh analytics data" position="bottom">
            <motion.button
              onClick={fetchAnalytics}
              disabled={refreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={`text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </HelpTooltip>

          {/* Share Button */}
          <HelpTooltip content="Share your analytics" position="bottom">
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all"
            >
              <Share2 size={18} className="text-slate-600" />
            </motion.button>
          </HelpTooltip>

          {/* Export Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowExportMenu(!showExportMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                >
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <FileText size={18} className="text-emerald-600" />
                    <span className="font-bold text-sm text-slate-700">Export as CSV</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <FileText size={18} className="text-red-600" />
                    <span className="font-bold text-sm text-slate-700">Export as PDF</span>
                  </button>
                  <button
                    onClick={handleExportImage}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <ImageIcon size={18} className="text-blue-600" />
                    <span className="font-bold text-sm text-slate-700">Export as Image</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Comparison Mode Banner */}
      {compareMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-black text-purple-700 mb-1">Comparison Mode Active</p>
              <p className="text-sm text-purple-800 font-medium">
                Comparing {timeRange} days vs {compareRange} days period
              </p>
            </div>
          </div>
          <select
            value={compareRange}
            onChange={(e) => setCompareRange(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-purple-200 rounded-xl font-bold text-sm text-purple-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="7">Compare with 7 days</option>
            <option value="30">Compare with 30 days</option>
            <option value="90">Compare with 90 days</option>
          </select>
        </motion.div>
      )}

      {/* AI Insight */}
      <AIInsightBanner stats={stats} lang={lang} t={t} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={Target}   label={t.modelAccuracy}    value="86%"                          sub="Random Forest"    bg="bg-emerald-50" color="text-emerald-600" delay={0}   trend="+2.1%" />
        <StatCard icon={Zap}      label={t.totalPredictions} value={stats?.totalPredictions || 0} sub="All time"         bg="bg-primary-50" color="text-primary-600" delay={0.1} trend="+12%" />
        <StatCard icon={CloudRain} label={t.rainPredictions} value={stats?.distribution?.Yes || 0} sub={rainRatio + '% of total'} bg="bg-blue-50" color="text-blue-600" delay={0.2} />
        <StatCard icon={Sun}      label={t.dryPredictions}   value={stats?.distribution?.No || 0} sub={(100-rainRatio) + '% of total'} bg="bg-amber-50" color="text-amber-600" delay={0.3} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Target size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{t.modelPerformance}</h2>
              <p className="text-sm text-slate-500 font-medium">Random Forest accuracy</p>
            </div>
          </div>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
                <motion.circle cx="96" cy="96" r="80" stroke="url(#gaugeGrad)" strokeWidth="18"
                  strokeDasharray="503" initial={{ strokeDashoffset: 503 }}
                  animate={{ strokeDashoffset: 503 * (1 - 0.86) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  fill="transparent" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900">86%</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.modelAccuracy}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              {[
                { label: 'Precision', value: '88%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Recall', value: '83%', color: 'text-primary-600', bg: 'bg-primary-50' },
              ].map(m => (
                <div key={m.label} className={`p-3 rounded-2xl ${m.bg} text-center`}>
                  <p className="text-xs font-bold text-slate-500 mb-1">{m.label}</p>
                  <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><Activity size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{t.predictionRatios}</h2>
              <p className="text-sm text-slate-500 font-medium">{t.distributionDesc}</p>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={6} dataKey="value"
                  animationBegin={0} animationDuration={1200}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-black text-slate-700">{entry.name}</span>
                <span className="text-sm font-bold text-slate-400">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Confidence Area Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><TrendingUp size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{t.confidenceStability}</h2>
              <p className="text-sm text-slate-500 font-medium">{t.confidenceTrendDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl">
            <Brain size={14} className="text-indigo-600" />
            <span className="text-xs font-black text-indigo-700">{t.aiInsight}</span>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={4}
                fillOpacity={1} fill="url(#confGrad)"
                dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {historyData.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
            <p className="text-sm text-indigo-800 font-medium">
              <span className="font-black">AI Analysis: </span>
              {historyData.length >= 3
                ? historyData[0].confidence > historyData[historyData.length - 1].confidence
                  ? 'Confidence has been trending upward in recent predictions, indicating improving atmospheric clarity.'
                  : 'Confidence levels show some variation, reflecting changing weather pattern complexity.'
                : 'Make more predictions to see confidence trend analysis.'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Prediction Bar Chart */}
      {historyData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Zap size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{t.confidenceTrend}</h2>
              <p className="text-sm text-slate-500 font-medium">Per-prediction confidence breakdown</p>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={historyData} barSize={28}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="confidence" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
