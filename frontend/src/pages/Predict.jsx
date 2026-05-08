import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, Droplets, Gauge, Sun, Send, CheckCircle, Sparkles } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Predict = () => {
  const [formData, setFormData] = useState({
    MinTemp: '', MaxTemp: '', Rainfall: '', Evaporation: '', Sunshine: '',
    WindGustSpeed: '', WindSpeed9am: '', WindSpeed3pm: '', Humidity9am: '',
    Humidity3pm: '', Pressure9am: '', Pressure3pm: '', Cloud9am: '',
    Cloud3pm: '', Temp9am: '', Temp3pm: '', RainYesterday: 'No'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputs = [
    { name: 'MinTemp', label: 'Min Temp (°C)', icon: Thermometer },
    { name: 'MaxTemp', label: 'Max Temp (°C)', icon: Thermometer },
    { name: 'Rainfall', label: 'Rainfall (mm)', icon: CloudRain },
    { name: 'Evaporation', label: 'Evaporation (mm)', icon: Droplets },
    { name: 'Sunshine', label: 'Sunshine (hours)', icon: Sun },
    { name: 'WindGustSpeed', label: 'Wind Gust (km/h)', icon: Wind },
    { name: 'WindSpeed9am', label: 'Wind 9am (km/h)', icon: Wind },
    { name: 'WindSpeed3pm', label: 'Wind 3pm (km/h)', icon: Wind },
    { name: 'Humidity9am', label: 'Humidity 9am (%)', icon: Droplets },
    { name: 'Humidity3pm', label: 'Humidity 3pm (%)', icon: Droplets },
    { name: 'Pressure9am', label: 'Pressure 9am (hpa)', icon: Gauge },
    { name: 'Pressure3pm', label: 'Pressure 3pm (hpa)', icon: Gauge },
    { name: 'Cloud9am', label: 'Cloud 9am (oktas)', icon: CloudRain },
    { name: 'Cloud3pm', label: 'Cloud 3pm (oktas)', icon: CloudRain },
    { name: 'Temp9am', label: 'Temp 9am (°C)', icon: Thermometer },
    { name: 'Temp3pm', label: 'Temp 3pm (°C)', icon: Thermometer },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {};
      Object.keys(formData).forEach(key => {
        formattedData[key] = key === 'RainYesterday' ? formData[key] : parseFloat(formData[key]);
      });
      const res = await api.post('/predict', formattedData);
      setResult(res.data);
      toast.success('Prediction generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Rainfall Prediction</h1>
        <p className="text-xl text-slate-500 font-medium">Enter weather parameters to get AI-powered rainfall insights.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="xl:col-span-3 p-10 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="p-3 bg-primary-50 rounded-2xl">
              <Sparkles size={24} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Weather Parameters</h2>
              <p className="text-sm text-slate-500 font-medium">Fill in all 17 parameters for accurate prediction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {inputs.map((input) => (
              <div key={input.name} className="space-y-2">
                <label className="text-sm font-black text-slate-600 flex items-center gap-2 ml-1">
                  <input.icon size={15} className="text-primary-500" /> {input.label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  name={input.name}
                  required
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 focus:bg-white outline-none transition-all text-base font-medium"
                  placeholder="0.0"
                />
              </div>
            ))}

            {/* Rain Yesterday */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-600 flex items-center gap-2 ml-1">
                <CloudRain size={15} className="text-primary-500" /> Rain Yesterday?
              </label>
              <select
                name="RainYesterday"
                value={formData.RainYesterday}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-base font-medium"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white rounded-2xl text-xl font-black shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? (
              <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send size={24} /> Generate AI Prediction</>
            )}
          </button>
        </motion.form>

        {/* Result Panel */}
        <div className="xl:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-10 rounded-3xl bg-white shadow-sm border border-slate-100 text-center space-y-8 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 ${result.prediction === 'Yes' ? 'bg-gradient-to-r from-primary-400 to-indigo-500' : 'bg-gradient-to-r from-slate-300 to-slate-400'}`} />

                <div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">AI Result</p>
                  <h2 className="text-3xl font-black text-slate-900">Prediction Ready</h2>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl ${result.prediction === 'Yes' ? 'bg-gradient-to-br from-primary-100 to-indigo-100 shadow-primary-200' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
                    <CloudRain size={72} className={result.prediction === 'Yes' ? 'text-primary-600' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className={`text-7xl font-black ${result.prediction === 'Yes' ? 'text-primary-600' : 'text-slate-600'}`}>
                      {result.prediction === 'Yes' ? 'RAIN' : 'NO RAIN'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 rounded-2xl p-6">
                  <div className="flex justify-between text-base font-black">
                    <span className="text-slate-600">Confidence Score</span>
                    <span className="text-primary-600">{result.confidence.toFixed(2)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-base">
                  <CheckCircle size={20} />
                  <span>Verified by Random Forest AI</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="p-12 rounded-3xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6 text-slate-400 min-h-[500px]"
              >
                <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center">
                  <CloudRain size={56} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-500 mb-2">No Prediction Yet</p>
                  <p className="text-base text-slate-400 max-w-[220px] mx-auto">Fill in the weather parameters and click generate to see AI insights.</p>
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
