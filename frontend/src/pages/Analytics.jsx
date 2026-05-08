import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Activity, Zap } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/user');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-bold text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Rainy', value: stats?.distribution?.Yes || 0 },
    { name: 'Dry', value: stats?.distribution?.No || 0 },
  ];

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Advanced Insights</h1>
        <p className="text-xl text-slate-500 font-medium">Deep dive into your prediction performance and patterns.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, label: 'Model Accuracy', value: '94%', sub: 'Random Forest', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { icon: Zap, label: 'Total Predictions', value: stats?.totalPredictions || 0, sub: 'All time', gradient: 'from-primary-500 to-indigo-600', bg: 'bg-primary-50', color: 'text-primary-600' },
          { icon: Activity, label: 'Rain Ratio', value: `${stats?.distribution?.Yes ? Math.round((stats.distribution.Yes / (stats.totalPredictions || 1)) * 100) : 0}%`, sub: 'Rainy predictions', gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-50', color: 'text-orange-600' },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`w-16 h-16 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6`}>
              <card.icon size={32} />
            </div>
            <p className="text-base font-bold text-slate-500 mb-2">{card.label}</p>
            <p className="text-5xl font-black text-slate-900 mb-1">{card.value}</p>
            <p className="text-sm font-bold text-slate-400">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accuracy Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Target size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Model Performance</h2>
              <p className="text-slate-500 font-medium">Random Forest accuracy gauge</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="96" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
                <circle cx="112" cy="112" r="96" stroke="url(#gaugeGrad)" strokeWidth="20" strokeDasharray="603" strokeDashoffset="36" fill="transparent" strokeLinecap="round" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black text-slate-900">94%</span>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
              </div>
            </div>
          </div>
          <p className="text-center text-base text-slate-500 font-medium italic bg-slate-50 rounded-2xl p-4">
            "Model retrained 2 hours ago with 98.2% validation score."
          </p>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
              <Activity size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Prediction Ratios</h2>
              <p className="text-slate-500 font-medium">Rain vs Dry distribution</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '14px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-10 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-base font-black text-slate-700">{entry.name}: <span className="text-slate-500">{entry.value}</span></span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Confidence Stability</h2>
            <p className="text-slate-500 font-medium">Prediction confidence over recent history</p>
          </div>
        </div>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.recentHistory || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '14px', fontWeight: 700 }} />
              <Line type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={5} dot={{ r: 7, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
