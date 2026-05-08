import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { CloudRain, TrendingUp, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const cards = [
    {
      title: 'Total Predictions',
      value: stats?.totalPredictions || 0,
      icon: CloudRain,
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50',
      color: 'text-primary-600',
      change: '+12%',
    },
    {
      title: 'Model Accuracy',
      value: '94%',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
      change: '+2.1%',
    },
    {
      title: 'Rain Predictions',
      value: stats?.distribution?.Yes || 0,
      icon: CheckCircle2,
      gradient: 'from-orange-500 to-amber-600',
      bg: 'bg-orange-50',
      color: 'text-orange-600',
      change: '+5%',
    },
    {
      title: 'Dry Predictions',
      value: stats?.distribution?.No || 0,
      icon: AlertCircle,
      gradient: 'from-purple-500 to-indigo-600',
      bg: 'bg-purple-50',
      color: 'text-purple-600',
      change: '+8%',
    },
  ];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-bold text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Good morning, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="text-xl text-slate-500 font-medium">Here's your weather intelligence overview for today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
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

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 p-10 rounded-3xl bg-white shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Confidence Trend</h2>
              <p className="text-slate-500 font-medium mt-1">Prediction confidence over time</p>
            </div>
            <span className="px-4 py-2 bg-primary-50 text-primary-600 font-bold rounded-xl text-sm">Last 30 days</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.recentHistory || []}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '14px', fontWeight: 600 }} />
                <Area type="monotone" dataKey="confidence" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorConf)" dot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Distribution</h2>
            <p className="text-slate-500 font-medium mt-1">Rain vs Dry predictions</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Rainy', count: stats?.distribution?.Yes || 0 },
                { name: 'Dry', count: stats?.distribution?.No || 0 }
              ]} barSize={60}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: '#64748b', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', fontSize: '14px', fontWeight: 600 }} />
                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                  <Cell fill="#0ea5e9" />
                  <Cell fill="#6366f1" />
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
