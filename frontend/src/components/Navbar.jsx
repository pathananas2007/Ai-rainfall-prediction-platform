import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 w-96 focus-within:border-primary-300 focus-within:bg-white transition-all">
        <Search size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search predictions, analytics..."
          className="bg-transparent border-none outline-none text-base w-full text-slate-700 placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-3 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all hover:text-slate-700">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-base font-black text-slate-900">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500 font-bold">Premium Account</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-500/30">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <ChevronDown size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
