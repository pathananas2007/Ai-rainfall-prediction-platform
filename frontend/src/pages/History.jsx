import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Trash2, Calendar, Wind, Thermometer, Clock, Eye, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLang } from '../context/LanguageContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLang();

  const fetchHistory = async () => {
    try {
      const res = await api.get('/predict/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/predict/history/${id}`);
      setHistory(history.filter(item => item._id !== id));
      toast.success('Prediction deleted');
    } catch (err) {
      toast.error('Failed to delete prediction');
    }
  };

  const handleViewDetails = (item) => {
    navigate('/predict', { state: { result: item } });
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-bold text-slate-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">{t.history}</h1>
          <p className="text-xl text-slate-500 font-medium">View and manage your past AI weather analysis.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl shadow-sm">
          <Clock size={20} className="text-slate-400" />
          <span className="text-base font-black text-slate-700">{history.length} {t.totalRecords}</span>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-5">
        {history.map((item, idx) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative p-8 rounded-3xl bg-white shadow-lg border border-slate-100 hover:shadow-2xl hover:border-primary-200 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all duration-300"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="flex items-center gap-8 flex-1 relative z-10">
              {/* Icon with glow */}
              <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 ${item.prediction === 'Yes' ? 'bg-gradient-to-br from-primary-100 to-indigo-100' : 'bg-slate-100'} group-hover:scale-105 transition-transform duration-300`}>
                <CloudRain size={36} className={item.prediction === 'Yes' ? 'text-primary-600' : 'text-slate-400'} />
                {item.prediction === 'Yes' && (
                  <div className="absolute inset-0 rounded-3xl bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-xl text-sm font-black shadow-md ${item.prediction === 'Yes' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.prediction === 'Yes' ? `🌧 ${t.rain}` : `☀️ ${t.noRain}`}
                  </span>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shadow-sm">
                    {item.confidence.toFixed(1)}% {t.confidence}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-base text-slate-500 font-bold flex-wrap">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {new Date(item.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Wind size={16} className="text-slate-400" />
                    {item.inputs.WindGustSpeed} km/h
                  </span>
                  <span className="flex items-center gap-2">
                    <Thermometer size={16} className="text-slate-400" />
                    {item.inputs.MaxTemp}°C max
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
              {/* View Details Button with AI Gradient Glow */}
              <motion.button
                onClick={() => handleViewDetails(item)}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group/btn relative overflow-hidden"
                title="View AI Analysis"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 border border-white/20">
                  <Sparkles size={16} className="animate-pulse" />
                  <span className="whitespace-nowrap">View AI Insights</span>
                  <Eye size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.button>

              {/* Delete Button with Warning Glow */}
              <motion.button
                onClick={() => handleDelete(item._id)}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group/del relative"
                title="Delete Prediction"
              >
                <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-0 group-hover/del:opacity-60 transition-opacity duration-300" />
                <div className="relative p-3.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all duration-300 border-2 border-slate-200 hover:border-red-300 shadow-md hover:shadow-xl">
                  <Trash2 size={20} className="group-hover/del:scale-110 group-hover/del:rotate-12 transition-all duration-300" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CloudRain size={56} className="text-slate-300" />
            </div>
            <p className="text-2xl font-black text-slate-500 mb-3">{t.noHistory}</p>
            <p className="text-lg text-slate-400 font-medium">{t.noHistoryDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
