import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Command, X, Search, Home, CloudRain, History, BarChart3, Settings, Keyboard } from 'lucide-react';

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if Ctrl/Cmd is pressed
      const isMod = e.ctrlKey || e.metaKey;
      
      // Toggle help with Ctrl/Cmd + /
      if (isMod && e.key === '/') {
        e.preventDefault();
        setShowHelp(!showHelp);
        return;
      }

      // Close help with Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
        return;
      }

      // Navigation shortcuts (only when help is not shown)
      if (!showHelp && isMod) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            // Focus search bar
            document.querySelector('input[type="text"]')?.focus();
            break;
          case 'h':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 'p':
            e.preventDefault();
            navigate('/predict');
            break;
          case 'r':
            e.preventDefault();
            navigate('/history');
            break;
          case 'a':
            e.preventDefault();
            navigate('/analytics');
            break;
          case 's':
            e.preventDefault();
            navigate('/settings');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHelp, navigate]);

  const shortcuts = [
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', icon: Keyboard },
    { keys: ['Ctrl', 'K'], description: 'Focus search bar', icon: Search },
    { keys: ['Ctrl', 'H'], description: 'Go to Dashboard', icon: Home },
    { keys: ['Ctrl', 'P'], description: 'Go to Predict', icon: CloudRain },
    { keys: ['Ctrl', 'R'], description: 'Go to History', icon: History },
    { keys: ['Ctrl', 'A'], description: 'Go to Analytics', icon: BarChart3 },
    { keys: ['Ctrl', 'S'], description: 'Go to Settings', icon: Settings },
    { keys: ['Esc'], description: 'Close dialogs', icon: X },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setShowHelp(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all z-40 group"
        title="Keyboard shortcuts (Ctrl + /)"
      >
        <Keyboard size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Keyboard size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Keyboard Shortcuts</h2>
                      <p className="text-sm text-white/80 font-medium">Navigate faster with these shortcuts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Shortcuts List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-3">
                  {shortcuts.map((shortcut, index) => {
                    const Icon = shortcut.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <Icon size={20} className="text-slate-600" />
                          </div>
                          <span className="font-bold text-slate-700">{shortcut.description}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {shortcut.keys.map((key, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <kbd className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-sm font-black text-slate-700 shadow-sm">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-slate-400 font-bold">+</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pro Tip */}
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
                      <Command size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-900 mb-1">💡 Pro Tip</p>
                      <p className="text-sm text-amber-800 font-medium">
                        Use <kbd className="px-2 py-0.5 bg-white border border-amber-300 rounded text-xs font-bold">Ctrl</kbd> (or <kbd className="px-2 py-0.5 bg-white border border-amber-300 rounded text-xs font-bold">Cmd</kbd> on Mac) with these shortcuts to navigate quickly!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;

// Made with Bob
