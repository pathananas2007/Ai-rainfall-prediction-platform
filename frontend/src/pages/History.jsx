import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Trash2, Calendar, Wind, Thermometer, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-bold text-slate-500">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Prediction History</h1>
          <p className="text-xl text-slate-500 font-medium">View and manage your past AI weather analysis.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl shadow-sm">
          <Clock size={20} className="text-slate-400" />
          <span className="text-base font-black text-slate-700">{history.length} Total Records</span>
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
            className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all"
          >
            <div className="flex items-center gap-8 flex-1">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 ${item.prediction === 'Yes' ? 'bg-gradient-to-br from-primary-100 to-indigo-100' : 'bg-slate-100'}`}>
                <CloudRain size={36} className={item.prediction === 'Yes' ? 'text-primary-600' : 'text-slate-400'} />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-xl text-sm font-black ${item.prediction === 'Yes' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.prediction === 'Yes' ? '🌧 RAIN' : '☀️ NO RAIN'}
                  </span>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                    {item.confidence.toFixed(1)}% Confidence
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

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(item._id)}
              className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={22} />
            </button>
          </motion.div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CloudRain size={56} className="text-slate-300" />
            </div>
            <p className="text-2xl font-black text-slate-500 mb-3">No History Found</p>
            <p className="text-lg text-slate-400 font-medium">Try making a prediction first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
