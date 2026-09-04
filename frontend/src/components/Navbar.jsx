import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, ChevronDown, Menu, X, CloudRain, History, BarChart3, LogOut, Loader2, MessageCircle, Info, Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Rain probability increased', time: 'Just now', desc: 'Current atmospheric pressure suggests rising rain probability this evening.', unread: true, action: 'open-predictions' },
  { id: 2, type: 'ai', title: 'AI assistant insight', time: '1h ago', desc: 'Confidence score is high for clear weather tomorrow.', unread: true, action: 'open-ai-analysis' },
  { id: 3, type: 'info', title: 'Stable weather expected', time: '3h ago', desc: 'No significant atmospheric changes detected.', unread: false, action: 'open-chat', context: 'Tell me more about the stable weather expected today.' },
  { id: 4, type: 'warning', title: 'Unstable conditions', time: '5h ago', desc: 'Wind gust speeds are increasing rapidly.', unread: false, action: 'open-chat', context: 'Why are wind gust speeds increasing rapidly?' },
];

const RECENT_SEARCHES = ['humidity', 'bad weather', 'dry spell'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search state
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // Dict grouped by category
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    date: 'all',
    sort: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  // Notification state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const params = new URLSearchParams({
          q: searchQuery,
          category: searchFilters.category,
          date: searchFilters.date,
          sort: searchFilters.sort
        });
        const res = await api.get(`/search?${params.toString()}`, {
          signal: controller.signal
        });
        setSearchResults(res.data.results || {});
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error("Search failed", err);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, searchFilters]);

  const links = [
    { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
    { key: 'predict',   path: '/predict',   icon: CloudRain       },
    { key: 'history',   path: '/history',   icon: History         },
    { key: 'analytics', path: '/analytics', icon: BarChart3       },
  ];

  const handleNotifClick = (notif) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    setNotifOpen(false);
    
    // Handle action routing
    switch(notif.action) {
      case "open-predictions":
        navigate('/predict');
        break;
      case "open-ai-analysis":
        navigate('/analytics');
        break;
      case "open-chat":
      default:
        window.dispatchEvent(new CustomEvent('open-chat-with-context', {
          detail: { message: notif.context || `Regarding your notification: "${notif.title}". ${notif.desc} Explain this to me.` }
        }));
        break;
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <div className="h-18 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 md:px-10 sticky top-0 z-20 shadow-sm">
        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Search */}
        <div ref={searchRef} className="hidden md:block relative">
          <div className={`flex items-center gap-3 bg-slate-50 border-2 rounded-2xl px-5 py-3 w-[450px] transition-all duration-300 ${searchFocused ? 'border-primary-400 bg-white shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'border-slate-100'}`}>
            <Search size={18} className={searchFocused ? 'text-primary-500' : 'text-slate-400'} />
            <input
              type="text"
              placeholder="Search predictions, analytics, weather..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-primary-100 text-primary-600' : 'hover:bg-slate-100 text-slate-400'}`}
                title="Filters"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="20" y2="18"/>
                  <circle cx="8" cy="6" r="2" fill="currentColor"/>
                  <circle cx="16" cy="12" r="2" fill="currentColor"/>
                  <circle cx="12" cy="18" r="2" fill="currentColor"/>
                </svg>
              </button>
            )}
            {searchLoading && <Loader2 size={16} className="text-primary-400 animate-spin" />}
          </div>

          {/* Search Dropdown - Notion Style Palette */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-3 w-full max-h-[500px] overflow-y-auto bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 flex flex-col"
              >
                {/* Advanced Filters */}
                {showFilters && searchQuery && (
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Filters</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Category</label>
                        <select
                          value={searchFilters.category}
                          onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                          className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="">All</option>
                          <option value="Predictions">Predictions</option>
                          <option value="Weather Analytics">Analytics</option>
                          <option value="AI Insights">AI Insights</option>
                          <option value="Chat History">Chat</option>
                          <option value="Notifications">Notifications</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Date</label>
                        <select
                          value={searchFilters.date}
                          onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                          className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Sort By</label>
                        <select
                          value={searchFilters.sort}
                          onChange={(e) => setSearchFilters({...searchFilters, sort: e.target.value})}
                          className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="relevance">Relevance</option>
                          <option value="date">Date</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {!searchQuery && (
                  <div className="p-4">
                    <div className="mb-5">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Recent Searches</p>
                      <div className="flex flex-wrap gap-2 px-1">
                        {RECENT_SEARCHES.map(s => (
                          <button key={s} onClick={() => setSearchQuery(s)} className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-100">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-1.5"><Sparkles size={12} className="text-primary-500" /> AI Suggestions</p>
                      <div className="space-y-1">
                        <button onClick={() => setSearchQuery('high confidence')} className="w-full text-left text-sm text-slate-700 font-bold hover:bg-slate-50 px-3 py-2.5 rounded-xl flex items-center gap-3 group transition-colors">
                          <Search size={14} className="text-slate-400 group-hover:text-primary-500" />
                          <span className="flex-1">Find high confidence predictions</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-primary-50 group-hover:text-primary-500 font-black">TAB</span>
                        </button>
                        <button onClick={() => setSearchQuery('storm')} className="w-full text-left text-sm text-slate-700 font-bold hover:bg-slate-50 px-3 py-2.5 rounded-xl flex items-center gap-3 group transition-colors">
                          <Search size={14} className="text-slate-400 group-hover:text-primary-500" />
                          <span className="flex-1">Analyze storm conditions</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-primary-50 group-hover:text-primary-500 font-black">TAB</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {searchQuery && !searchLoading && searchResults && Object.keys(searchResults).length > 0 && (
                  <div className="p-2 space-y-4">
                    {Object.entries(searchResults).map(([category, items]) => (
                      <div key={category} className="px-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">{category}</p>
                        <div className="space-y-1">
                          {items.map(res => (
                            <div key={res.id} onClick={() => setSearchFocused(false)} className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex gap-3 items-center group transition-colors">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${category === 'AI Insights' ? 'bg-indigo-50 text-indigo-500' : 'bg-primary-50 text-primary-500'}`}>
                                {category === 'AI Insights' ? <Sparkles size={14} /> : category === 'Notifications' ? <Bell size={14} /> : <Search size={14} />}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 truncate">{res.title}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{res.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && searchLoading && (
                   <div className="p-6 space-y-4">
                     <div className="animate-pulse flex gap-3 items-center px-2">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                         <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                       </div>
                     </div>
                     <div className="animate-pulse flex gap-3 items-center px-2">
                       <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                         <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                       </div>
                     </div>
                   </div>
                )}

                {searchQuery && !searchLoading && searchResults && Object.keys(searchResults).length === 0 && (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <Search size={28} className="text-slate-300" />
                    </div>
                    <p className="text-base font-black text-slate-800 mb-1">No matches found for "{searchQuery}"</p>
                    <p className="text-sm font-medium text-slate-500 mb-4">Try searching for predictions, analytics, or AI insights.</p>
                    <button onClick={() => setSearchQuery('')} className="text-xs font-bold bg-primary-50 text-primary-600 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors">
                      Clear Search
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Bell size={22} className={unreadCount > 0 ? 'text-primary-500' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-3 w-[360px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 flex flex-col"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800">Notifications</p>
                      {unreadCount > 0 && (
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={markAllRead} className="text-xs font-bold text-primary-500 hover:bg-primary-50 p-1.5 rounded-lg transition-colors" title="Mark all read"><Check size={16}/></button>
                      <button onClick={clearAll} className="text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 p-1.5 rounded-lg transition-colors" title="Clear all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  
                  <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                          <Bell size={28} className="text-slate-300" />
                        </div>
                        <p className="text-base font-black text-slate-800 mb-1">All caught up!</p>
                        <p className="text-sm font-medium text-slate-500">No new notifications right now.</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotifClick(n)}
                          className={`p-3 rounded-2xl cursor-pointer transition-all hover:bg-slate-50 flex gap-3 group relative ${n.unread ? 'bg-primary-50/30' : ''}`}
                        >
                          {n.unread && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>}
                          
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'alert' ? 'bg-red-50 text-red-500' : n.type === 'ai' ? 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white' : n.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'}`}>
                            {n.type === 'alert' ? <CloudRain size={18} /> : n.type === 'ai' ? <Sparkles size={18} /> : n.type === 'warning' ? <Info size={18} /> : <Bell size={18} />}
                          </div>
                          
                          <div className="flex-1 pr-6">
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <p className={`text-sm font-bold ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap mt-0.5">{n.time}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 leading-snug line-clamp-2">{n.desc}</p>
                            
                            {n.action === 'open-chat' && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary-500">
                                <MessageCircle size={12} />
                                <span>Discuss with RainAI</span>
                              </div>
                            )}
                            {n.action === 'open-predictions' && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                                <CloudRain size={12} />
                                <span>View Predictions</span>
                              </div>
                            )}
                            {n.action === 'open-ai-analysis' && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-purple-500">
                                <BarChart3 size={12} />
                                <span>View Analytics</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 font-bold">{t?.premiumAccount || 'Premium Account'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg shadow-primary-500/30">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <ChevronDown size={16} className="text-slate-400 hidden sm:block group-hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-slate-950 z-40 md:hidden flex flex-col p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <CloudRain size={24} />
                </div>
                <span className="font-black text-2xl tracking-tight text-white">RainAI</span>
                <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/50 hover:text-white"><X size={24}/></button>
              </div>
              
              <div className="mb-6 relative">
                 <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary-500 transition-all">
                    <Search size={18} className="text-white/50" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/40 font-medium" />
                 </div>
              </div>

              <nav className="flex-1 space-y-2">
                {links.map(link => (
                  <NavLink key={link.key} to={link.path} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-base font-bold ${
                        isActive ? 'bg-primary-500/20 text-white border border-primary-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`
                    }>
                    {({ isActive }) => (
                      <><link.icon size={20} className={isActive ? 'text-primary-400' : ''} /><span>{t ? t[link.key] : link.key}</span></>
                    )}
                  </NavLink>
                ))}
              </nav>
              <button onClick={logout}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 w-full text-base font-bold mt-4 border-t border-white/10 pt-6">
                <LogOut size={20} /> {t?.logout || 'Logout'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
