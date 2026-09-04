import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CloudRain, History, BarChart3, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { t } = useLang();

  const links = [
    { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
    { key: 'predict',   path: '/predict',   icon: CloudRain       },
    { key: 'history',   path: '/history',   icon: History         },
    { key: 'analytics', path: '/analytics', icon: BarChart3       },
    { key: 'settings',  path: '/settings',  icon: Settings        },
  ];

  return (
    <div className="w-72 h-screen bg-slate-950 flex flex-col p-6 fixed left-0 top-0 z-10 border-r border-white/5">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/50">
          <CloudRain size={28} />
        </div>
        <span className="font-black text-2xl tracking-tight text-white">RainAI</span>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest px-4 mb-4">{t.navigation}</p>
        {links.map((link) => (
          <NavLink key={link.key} to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-base font-bold ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-indigo-500/20 text-white border border-primary-500/30 shadow-lg'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon size={22} className={isActive ? 'text-primary-400' : ''} />
                <span>{t[link.key]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 px-4 py-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-black text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 font-bold">{t.premiumAccount}</p>
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all duration-200 text-base font-bold">
          <LogOut size={22} />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
