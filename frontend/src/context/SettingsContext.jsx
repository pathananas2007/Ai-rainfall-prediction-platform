import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    push: true,
    weatherAlerts: true,
    predictionUpdates: true,
    aiInsights: true
  },
  display: {
    theme: 'light',
    language: 'en',
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    dateFormat: 'DD/MM/YYYY'
  },
  privacy: {
    shareData: false,
    publicProfile: false,
    showHistory: true
  },
  predictions: {
    autoRefresh: true,
    refreshInterval: 30,
    confidenceThreshold: 70,
    showAdvancedMetrics: true
  },
  ai: {
    enableChatAssistant: true,
    autoSuggestions: true,
    voiceInput: false
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem('rainai_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [loading, setLoading] = useState(false);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(settings.display.theme);
  }, [settings.display.theme]);

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('rainai_settings', JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings to localStorage:', err);
    }
  }, [settings]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      // Keep local settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      await api.put('/settings', updatedSettings);
      toast.success('Settings saved successfully!');
      return true;
    } catch (err) {
      toast.error('Failed to save settings');
      console.error('Failed to update settings:', err);
      return false;
    }
  };

  const updateCategory = (category, updates) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates
      }
    }));
  };

  const resetSettings = async () => {
    try {
      await api.post('/settings/reset');
      setSettings(DEFAULT_SETTINGS);
      toast.success('Settings reset to default');
      return true;
    } catch (err) {
      toast.error('Failed to reset settings');
      console.error('Failed to reset settings:', err);
      return false;
    }
  };

  const exportSettings = async () => {
    try {
      const res = await api.get('/settings/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rainai-settings-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Settings exported successfully!');
      return true;
    } catch (err) {
      toast.error('Failed to export settings');
      console.error('Failed to export settings:', err);
      return false;
    }
  };

  // Temperature conversion utilities
  const convertTemperature = (value, from = 'celsius', to = null) => {
    const targetUnit = to || settings.display.temperatureUnit;
    if (from === targetUnit) return value;
    
    if (from === 'celsius' && targetUnit === 'fahrenheit') {
      return (value * 9/5) + 32;
    } else if (from === 'fahrenheit' && targetUnit === 'celsius') {
      return (value - 32) * 5/9;
    }
    return value;
  };

  // Wind speed conversion utilities
  const convertWindSpeed = (value, from = 'kmh', to = null) => {
    const targetUnit = to || settings.display.windSpeedUnit;
    if (from === targetUnit) return value;
    
    const conversions = {
      kmh: { mph: 0.621371, ms: 0.277778 },
      mph: { kmh: 1.60934, ms: 0.44704 },
      ms: { kmh: 3.6, mph: 2.23694 }
    };
    
    return value * (conversions[from]?.[targetUnit] || 1);
  };

  // Format date according to settings
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    const format = settings.display.dateFormat;
    
    if (format === 'MM/DD/YYYY') {
      return `${month}/${day}/${year}`;
    } else if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    } else {
      return `${day}/${month}/${year}`; // DD/MM/YYYY
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    updateCategory,
    resetSettings,
    exportSettings,
    fetchSettings,
    convertTemperature,
    convertWindSpeed,
    formatDate,
    // Utility getters
    theme: settings.display.theme,
    language: settings.display.language,
    temperatureUnit: settings.display.temperatureUnit,
    windSpeedUnit: settings.display.windSpeedUnit,
    dateFormat: settings.display.dateFormat,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

// Made with Bob
