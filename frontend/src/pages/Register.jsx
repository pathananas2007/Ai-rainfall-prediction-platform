import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, CloudRain, Brain, BarChart3, Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: Brain, text: 'Advanced ML Models', sub: 'Random Forest & XGBoost' },
    { icon: BarChart3, text: 'Interactive Analytics', sub: 'Real-time charts & insights' },
    { icon: Zap, text: 'Instant Predictions', sub: '17 weather parameters' },
  ];

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: '#ef4444', pct: '25%' };
    if (p.length < 10) return { label: 'Fair', color: '#eab308', pct: '50%' };
    if (p.length < 14) return { label: 'Good', color: '#0ea5e9', pct: '75%' };
    return { label: 'Strong', color: '#10b981', pct: '100%' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-950 relative overflow-hidden flex-col justify-between p-16">

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[130px] animate-blob" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[130px] animate-blob-2" />
          <div className="absolute top-[50%] left-[20%] w-[300px] h-[300px] bg-primary-600/15 rounded-full blur-[100px] animate-blob-3" />
          <div className="absolute inset-0 grid-overlay" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40"
            >
              <CloudRain size={28} />
            </motion.div>
            <span className="font-black text-3xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">RainAI</span>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15 text-indigo-400 font-bold text-sm mb-8">
              <CheckCircle size={14} className="text-emerald-400" />
              Free forever plan available
            </div>

            <h1 className="text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
              Start Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                AI Journey
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-14 leading-relaxed max-w-md">
              Join thousands of researchers and developers using AI to predict weather patterns with precision.
            </p>

            <div className="space-y-5">
              {perks.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-white/12 group-hover:border-indigo-500/40 transition-all">
                    <item.icon size={22} className="text-indigo-400" />
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

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[
            { val: '94%', label: 'Accuracy' },
            { val: '50K+', label: 'Predictions' },
            { val: '1.2K+', label: 'Users' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center">
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-slate-500 text-xs font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-slate-50 relative overflow-hidden overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-lg px-8 py-12"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <CloudRain size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">RainAI</span>
          </div>

          <div className="mb-10">
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
            <p className="text-lg text-slate-500 font-medium">Join the weather intelligence platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <User size={15} className="text-indigo-500" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <Mail size={15} className="text-indigo-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <Lock size={15} className="text-indigo-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="space-y-1 mt-2">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.pct }}
                      transition={{ duration: 0.4 }}
                      className="h-full rounded-full transition-all"
                      style={{ backgroundColor: strength.color, width: strength.pct }}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-500">Password strength: <span className="text-slate-700">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2 ml-1">
                <Lock size={15} className="text-indigo-500" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-5 py-4 pr-14 rounded-2xl bg-white border-2 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-emerald-400 focus:ring-4 focus:ring-emerald-100'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                  }`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle size={18} className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={22} /></>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-sm font-bold">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-slate-600 text-base font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
