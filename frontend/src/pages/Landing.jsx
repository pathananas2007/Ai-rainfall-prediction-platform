import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { CloudRain, Zap, Shield, BarChart3, ArrowRight, ChevronRight, ExternalLink, Sparkles, Brain, TrendingUp, Users, Activity, CheckCircle, Mail, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden relative">

      {/* Scroll progress */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 origin-left z-[9999]" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-primary-600/15 rounded-full blur-[140px] animate-blob" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-blob-2" />
        <div className="absolute bottom-[-10%] left-[30%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px] animate-blob-3" />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/10"
            style={{ width: (i%3+2)+'px', height: (i%3+2)+'px', top: (i*8%100)+'%', left: (i*9%100)+'%', animation: `float ${6+i%4}s ease-in-out ${i%4}s infinite` }} />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'navbar-blur' : ''}`}>
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: [0,-10,10,0], scale: 1.1 }} transition={{ duration: 0.4 }}
              className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/50">
              <CloudRain size={28} />
            </motion.div>
            <span className="font-black text-3xl tracking-tight text-white">RainAI</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-base font-bold text-slate-300">
            {['Features','Statistics','Dashboard'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="relative group hover:text-white transition-colors">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-base font-bold text-slate-300 hover:text-white px-6 py-3 transition-colors">Sign In</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="bg-gradient-to-r from-primary-500 to-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-primary-500/40 flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-24 pb-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/8 backdrop-blur-xl border border-white/15 text-base font-bold text-white mb-12">
            <Sparkles size={18} className="text-yellow-400 animate-pulse" />
            <span>Powered by Advanced Machine Learning</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
            className="text-7xl md:text-[6.5rem] lg:text-[8rem] font-black text-white leading-[1.0] tracking-tighter mb-10">
            Predict Weather<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 animate-gradient">
              with AI Precision
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            Harness Random Forest and XGBoost models to predict rainfall with{' '}
            <span className="text-primary-400 font-black">94% accuracy</span>.
            Real-time analytics, enterprise security, instant insights.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-indigo-600 text-white px-12 py-6 rounded-2xl text-xl font-black shadow-2xl shadow-primary-500/40 overflow-hidden">
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">Start Predicting Now</span>
                <ChevronRight size={24} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.a href="https://github.com" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-white/6 backdrop-blur-xl text-white border border-white/15 px-12 py-6 rounded-2xl text-xl font-black hover:bg-white/12 hover:border-white/30 transition-all">
              <ExternalLink size={22} /> View on GitHub
            </motion.a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Brain, label: 'AI-Powered', value: '94% Accuracy', color: 'text-primary-400', delay: 0.6 },
              { icon: TrendingUp, label: 'Real-time', value: 'Live Analytics', color: 'text-indigo-400', delay: 0.7 },
              { icon: Shield, label: 'Secure', value: 'Enterprise Grade', color: 'text-purple-400', delay: 0.8 },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.5 }} whileHover={{ y: -6, scale: 1.02 }}
                className="p-7 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all group cursor-default">
                <item.icon size={36} className={`${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-widest">{item.label}</p>
                <p className="text-white text-2xl font-black">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section id="dashboard" className="py-32 relative z-10 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-primary-400 font-bold text-sm mb-6">
              <Activity size={15} /> Live Platform Preview
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">See It In Action</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">A real-time glimpse of the RainAI intelligence dashboard.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-indigo-500/20 to-purple-500/20 blur-[80px] rounded-[3rem]" />
            <div className="relative border-gradient rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="bg-slate-900/90 backdrop-blur-xl px-6 py-4 flex items-center gap-3 border-b border-white/8">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 mx-4 bg-white/6 rounded-lg px-4 py-1.5 text-xs text-slate-400 font-mono">app.rainai.io/dashboard</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 grid grid-cols-12 gap-6">
                <div className="col-span-2 space-y-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 mb-6" />
                  {['Dashboard','Predict','History','Analytics'].map((item, i) => (
                    <div key={i} className={`h-9 rounded-xl flex items-center px-3 gap-2 ${i===0?'bg-primary-500/20 border border-primary-500/30':'bg-white/4'}`}>
                      <div className={`w-3 h-3 rounded-sm ${i===0?'bg-primary-400':'bg-white/20'}`} />
                      <div className={`h-2 rounded-full flex-1 ${i===0?'bg-primary-400/60':'bg-white/15'}`} />
                    </div>
                  ))}
                </div>
                <div className="col-span-10 space-y-5">
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label:'Total Predictions', val:'1,284', color:'from-primary-500/20 to-primary-600/10', dot:'bg-primary-400' },
                      { label:'Accuracy', val:'94%', color:'from-emerald-500/20 to-emerald-600/10', dot:'bg-emerald-400' },
                      { label:'Rain Days', val:'847', color:'from-indigo-500/20 to-indigo-600/10', dot:'bg-indigo-400' },
                      { label:'Dry Days', val:'437', color:'from-purple-500/20 to-purple-600/10', dot:'bg-purple-400' },
                    ].map((c,i) => (
                      <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border border-white/8`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                          <span className="text-xs text-slate-400 font-bold">{c.label}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{c.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 p-5 rounded-2xl bg-white/4 border border-white/8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-black text-white">Confidence Trend</span>
                        <span className="text-xs text-primary-400 font-bold bg-primary-500/15 px-3 py-1 rounded-full">Live</span>
                      </div>
                      <div className="flex items-end gap-2 h-24">
                        {[55,72,61,88,76,94,82,90,78,95,88,92].map((h,i) => (
                          <motion.div key={i} initial={{ height:0 }} whileInView={{ height: h+'%' }} viewport={{ once:true }}
                            transition={{ delay: i*0.05, duration:0.5 }} className="flex-1 rounded-t-lg"
                            style={{ background:'linear-gradient(to top,#0ea5e9,#6366f1)', opacity: 0.6+i*0.03 }} />
                        ))}
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/15 to-indigo-600/15 border border-primary-500/25 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <CloudRain size={28} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">AI Result</p>
                        <p className="text-3xl font-black text-primary-400">RAIN</p>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div initial={{ width:0 }} whileInView={{ width:'87%' }} viewport={{ once:true }}
                          transition={{ duration:1, delay:0.5 }} className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold">87% Confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative z-10 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-primary-400 font-bold text-sm mb-6">
              <Zap size={15} /> Enterprise Features
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-5 tracking-tight">Everything You Need</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">A complete platform for AI-powered weather intelligence.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              { title:'AI Prediction Engine', desc:'State-of-the-art Random Forest and XGBoost models trained on global weather datasets with 94% accuracy.', icon:Zap, gradient:'from-amber-500 to-orange-600' },
              { title:'Real-time Analytics', desc:'Interactive charts and dashboards visualizing historical patterns and future rainfall trends instantly.', icon:BarChart3, gradient:'from-primary-500 to-indigo-600' },
              { title:'Secure and Private', desc:'Enterprise-grade JWT authentication, encrypted data storage, and role-based access control.', icon:Shield, gradient:'from-emerald-500 to-teal-600' },
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: idx*0.15, duration:0.6 }} whileHover={{ y:-8 }}
                className="p-10 rounded-3xl bg-white/4 backdrop-blur-xl border border-white/8 hover:border-white/20 hover:bg-white/7 transition-all group shadow-2xl">
                <motion.div whileHover={{ scale:1.1, rotate:5 }} transition={{ type:'spring', stiffness:300 }}
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-2xl`}>
                  <feature.icon size={36} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="statistics" className="py-32 relative z-10 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative p-16 rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-indigo-600/15 to-purple-600/15 backdrop-blur-xl border border-white/10 rounded-[3rem]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { target:94, suffix:'%', label:'Model Accuracy', icon:Activity, color:'text-emerald-400' },
                { target:50000, suffix:'+', label:'Predictions Made', icon:Zap, color:'text-primary-400' },
                { target:1200, suffix:'+', label:'Active Users', icon:Users, color:'text-indigo-400' },
                { target:17, suffix:'', label:'Weather Parameters', icon:CloudRain, color:'text-purple-400' },
              ].map((stat, idx) => (
                <motion.div key={idx} initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:true }} transition={{ delay: idx*0.12, type:'spring', stiffness:200 }} className="group">
                  <stat.icon size={28} className={`${stat.color} mx-auto mb-4 group-hover:scale-125 transition-transform duration-300`} />
                  <p className={`text-5xl md:text-6xl font-black text-white mb-3 ${stat.color}`}>
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </p>
                  <p className="text-slate-400 font-bold text-base">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative z-10 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}
            className="relative p-20 rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-indigo-700/30 backdrop-blur-xl border border-white/10 rounded-[3rem]" />
            <div className="absolute inset-0 grid-overlay opacity-50 rounded-[3rem]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm mb-8">
                <CheckCircle size={15} className="text-emerald-400" /> Free to get started
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                Start Predicting<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Today for Free</span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of researchers and developers using AI to understand weather patterns. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}>
                  <Link to="/register" className="inline-flex items-center gap-3 bg-white text-slate-900 px-12 py-6 rounded-2xl text-xl font-black shadow-2xl hover:shadow-white/20 transition-all">
                    Get Started Free <ArrowRight size={24} />
                  </Link>
                </motion.div>
                <Link to="/login" className="text-lg font-bold text-slate-300 hover:text-white transition-colors px-6 py-4">
                  Already have an account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 relative z-10 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30">
                  <CloudRain size={24} />
                </div>
                <span className="font-black text-2xl tracking-tight text-white">RainAI</span>
              </div>
              <p className="text-slate-400 max-w-md text-base leading-relaxed mb-4">
                AI Weather Intelligence Platform powered by Machine Learning, Generative AI, and Real-time Weather Intelligence.
              </p>
              <p className="text-slate-500 text-sm font-bold mb-8">
                Built by <span className="text-primary-400">Anas Pathan</span>
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  {
                    icon: FaGithub,
                    href: 'https://github.com/pathananas2007/Ai-rainfall-prediction-platform',
                    label: 'View Source Code',
                    gradient: 'from-slate-500 to-slate-700',
                    hoverGlow: 'hover:shadow-slate-500/50',
                    iconSize: 20
                  },
                  {
                    icon: FaLinkedin,
                    href: 'https://www.linkedin.com/in/anas-pathan-91a6b3368/',
                    label: 'Connect on LinkedIn',
                    gradient: 'from-blue-500 to-blue-700',
                    hoverGlow: 'hover:shadow-blue-500/50',
                    iconSize: 20
                  },
                  {
                    icon: Mail,
                    href: 'mailto:pathananas2007@gmail.com',
                    label: 'Contact Developer',
                    gradient: 'from-emerald-500 to-emerald-700',
                    hoverGlow: 'hover:shadow-emerald-500/50',
                    iconSize: 20
                  },
                  {
                    icon: Globe,
                    href: '/dashboard',
                    label: 'Open Live Demo',
                    gradient: 'from-primary-500 to-indigo-600',
                    hoverGlow: 'hover:shadow-primary-500/50',
                    iconSize: 20
                  },
                ].map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative w-12 h-12 rounded-xl bg-white/6 backdrop-blur-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/12 hover:border-white/20 transition-all duration-300 shadow-lg ${social.hoverGlow}`}
                      title={social.label}
                    >
                      <IconComponent size={social.iconSize} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-7 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-base">
                <li><Link to="/predict" className="text-slate-400 hover:text-white transition-colors font-medium">Predictions</Link></li>
                <li><Link to="/analytics" className="text-slate-400 hover:text-white transition-colors font-medium">Analytics</Link></li>
                <li><Link to="/history" className="text-slate-400 hover:text-white transition-colors font-medium">History</Link></li>
                <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors font-medium">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-base mb-7 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4 text-base">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">API Status</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium inline-flex items-center gap-2">
                  Version <span className="px-2 py-0.5 rounded-md bg-primary-500/20 text-primary-400 text-xs font-bold">v1.0</span>
                </a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
            <p>© 2026 RainAI. All rights reserved. Built with ❤️ using Machine Learning & AI.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
