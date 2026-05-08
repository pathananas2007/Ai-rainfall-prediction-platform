import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, CloudRain, Sparkles, TrendingUp, Shield, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, text: '94% Prediction Accuracy', sub: 'Industry-leading ML models' },
    { icon: TrendingUp, text: 'Real-time Analytics', sub: 'Live dashboard & charts' },
    { icon: Shield, text: 'Enterprise Security', sub: 'JWT auth & encryption' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-950 relative overflow-hidden flex-col justify-between p-16">

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[130px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[130px] animate-blob-2" />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] animate-blob-3" />
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/40"
            >
              <CloudRain size={28} />
            </motion.div>
            <span className="font-black text-3xl tracking-tight text-white group-hover:text-primary-300 transition-colors">RainAI</span>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15 text-primary-400 font-bold text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Platform Online
            </div>

            <h1 className="text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
              Welcome Back<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 animate-gradient">
                to RainAI
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-14 leading-relaxed max-w-md">
              Continue your journey with AI-powered rainfall predictions and real-time climate analytics.
            </p>

            <div className="space-y-5">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-white/12 group-hover:border-primary-500/40 transition-all">
                    <item.icon size={22} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{item.text}</p>
                    <p className="text-slate-500 text-sm font-medium">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 p-6 rounded-2xl bg-white/4 border border-white/8"
        >
          <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
            "RainAI transformed how we approach climate research. The accuracy is remarkable."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black"></div>
            <div>
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md px-8 py-12"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <CloudRain size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">RainAI</span>
          </div>

          <div className="mb-10">
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">Sign In</h2>
            <p className="text-lg text-slate-500 font-medium">Access your weather intelligence dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <Mail size={15} className="text-primary-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <Lock size={15} className="text-primary-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={22} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-sm font-bold">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-slate-600 text-base font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
