import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudRain, Sun, Wind, Droplets, Thermometer,
  RefreshCw, MapPin, Brain, LocateFixed, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import api from '../services/api';
import { useLang } from '../context/LanguageContext';

// ── Animated weather icon ─────────────────────────────────────────────────────
const WeatherIcon = ({ isRain, size = 'lg' }) => {
  const sz = size === 'lg' ? 48 : 32;
  return (
    <div className="relative">
      {isRain ? (
        <>
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary-400/20 blur-lg" />
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <CloudRain size={sz} className="text-primary-500 relative z-10" />
          </motion.div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ y: [0, 8], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: 'easeIn' }}
                className="w-0.5 h-2 bg-primary-400 rounded-full" />
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-300/30 blur-lg" />
          <motion.div animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <Sun size={sz} className="text-amber-500 relative z-10" />
          </motion.div>
        </>
      )}
    </div>
  );
};

// ── Metric pill ───────────────────────────────────────────────────────────────
const MetricPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-2xl">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-bold leading-none mb-0.5">{label}</p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const WeatherComparison = ({ prediction, confidence }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState(null);
  const [manualCity, setManualCity] = useState('');
  const [showManual, setShowManual] = useState(false);
  const { t } = useLang();

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setLocError(null);
    try {
      const res = await api.get(`/weather/coords?lat=${lat}&lon=${lon}`);
      setWeather(res.data);
    } catch {
      setLocError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setLocError(null);
    try {
      const res = await api.get(`/weather/current?city=${encodeURIComponent(city)}`);
      setWeather(res.data);
    } catch {
      setLocError('City not found. Try another name.');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    setLoading(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported.');
      setShowManual(true);
      setLoading(false);
      fetchByCity('Sydney');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude.toFixed(4), pos.coords.longitude.toFixed(4)),
      () => {
        setLoading(false);
        setLocError('Location access denied.');
        setShowManual(true);
        fetchByCity('Sydney');
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const aiSaysRain = prediction === 'Yes';
  const realRain = weather?.description?.toLowerCase().match(/rain|drizzle|shower|thunder/);
  const match = prediction != null ? (aiSaysRain === !!realRain) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden">

      {/* Header bar */}
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl">
            <Brain size={22} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">AI vs Real Weather</h3>
            <p className="text-sm text-slate-500 font-medium">
              {weather?.city ? `📍 ${weather.city}` : 'Detecting your location...'}
              {weather?.mock && <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">Demo</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {locError && (
            <button onClick={() => setShowManual(!showManual)}
              className="text-xs font-black text-slate-500 hover:text-primary-600 transition-colors px-3 py-2 bg-slate-50 rounded-xl">
              Enter city manually
            </button>
          )}
          <motion.button onClick={detectLocation} disabled={loading}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl text-sm font-black transition-all disabled:opacity-50">
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <LocateFixed size={15} />}
            {loading ? 'Detecting...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Location error */}
        <AnimatePresence>
          {locError && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-700 flex-1">{locError} Showing default location.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual city input */}
        <AnimatePresence>
          {showManual && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus-within:border-primary-400 transition-all">
                <MapPin size={15} className="text-slate-400 flex-shrink-0" />
                <input value={manualCity} onChange={e => setManualCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchByCity(manualCity)}
                  placeholder="Enter city name..."
                  className="bg-transparent outline-none text-sm font-medium text-slate-700 w-full" />
              </div>
              <motion.button onClick={() => fetchByCity(manualCity)} disabled={!manualCity.trim() || loading}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-black transition-all disabled:opacity-50">
                Search
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {loading && !weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Main comparison */}
        {weather && (
          <div className="space-y-6">
            {/* Two comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Prediction card */}
              <div className={`relative p-8 rounded-3xl border-2 overflow-hidden
                ${aiSaysRain ? 'bg-gradient-to-br from-primary-50 to-indigo-50 border-primary-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${aiSaysRain ? 'bg-gradient-to-r from-primary-400 to-indigo-500' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`} />
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">AI Prediction</p>
                    <p className={`text-3xl font-black ${aiSaysRain ? 'text-primary-700' : 'text-amber-700'}`}>
                      {prediction ? (aiSaysRain ? t.rain : t.noRain) : '—'}
                    </p>
                    {confidence && (
                      <p className="text-sm font-bold text-slate-500 mt-1">{confidence.toFixed(0)}% confidence</p>
                    )}
                  </div>
                  <div className="w-20 h-20 flex items-center justify-center">
                    <WeatherIcon isRain={aiSaysRain} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Brain size={13} className="text-indigo-500" />
                  Random Forest ML Model
                </div>
              </div>

              {/* Real weather card */}
              <div className={`relative p-8 rounded-3xl border-2 overflow-hidden
                ${realRain ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'}`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${realRain ? 'bg-gradient-to-r from-blue-400 to-cyan-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`} />
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Live Weather</p>
                    <p className={`text-3xl font-black ${realRain ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {weather.description}
                    </p>
                    <p className="text-sm font-bold text-slate-500 mt-1">{weather.city}</p>
                  </div>
                  <div className="w-20 h-20 flex items-center justify-center">
                    <WeatherIcon isRain={!!realRain} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <LocateFixed size={13} className="text-emerald-500" />
                  {weather.mock ? 'Demo data' : 'OpenWeatherMap API'}
                </div>
              </div>
            </div>

            {/* Match banner */}
            {match !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-3 p-4 rounded-2xl ${match ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                {match
                  ? <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                  : <XCircle size={20} className="text-amber-600 flex-shrink-0" />}
                <div>
                  <p className={`text-sm font-black ${match ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {match ? '✅ AI prediction aligns with current conditions' : '⚠️ AI prediction differs from current conditions'}
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${match ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {match
                      ? 'The model correctly identified the current weather pattern.'
                      : 'The model predicts tomorrow — current conditions may differ from the forecast.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricPill icon={Thermometer} label="Temperature" value={`${weather.temp}°C`}         color="bg-orange-100 text-orange-600" />
              <MetricPill icon={Droplets}    label="Humidity"    value={`${weather.humidity}%`}       color="bg-blue-100 text-blue-600" />
              <MetricPill icon={Wind}        label="Wind Speed"  value={`${weather.wind_speed} km/h`} color="bg-teal-100 text-teal-600" />
              <MetricPill icon={CloudRain}   label="Pressure"    value={`${weather.pressure} hPa`}    color="bg-indigo-100 text-indigo-600" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherComparison;
