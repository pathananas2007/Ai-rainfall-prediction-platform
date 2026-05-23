import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Bell, Globe, Lock, Zap, Brain,
  Save, RotateCcw, Download, Moon, Sun, Volume2, VolumeX,
  Mail, Smartphone, CloudRain, TrendingUp, MessageSquare,
  Eye, EyeOff, Shield, Database, Thermometer, Wind, Calendar,
  Check, AlertCircle
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const { t, lang, changeLang } = useLang();
  const {
    settings,
    loading,
    updateSettings,
    updateCategory,
    resetSettings,
    exportSettings
  } = useSettings();
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    const success = await updateSettings(localSettings);
    
    // Apply language change if it was modified
    if (localSettings.display.language !== lang) {
      changeLang(localSettings.display.language);
    }
    
    setSaving(false);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;
    await resetSettings();
  };

  const handleExport = async () => {
    await exportSettings();
  };

  const updateSetting = (category, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'predictions', label: 'Predictions', icon: Zap },
    { id: 'ai', label: 'AI Assistant', icon: Brain }
  ];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-bold text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Settings</h1>
          <p className="text-xl text-slate-500 font-medium">Customize your RainAI experience</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-300 hover:shadow-md transition-all"
          >
            <Download size={18} />
            Export
          </motion.button>
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-red-300 hover:text-red-600 hover:shadow-md transition-all"
          >
            <RotateCcw size={18} />
            Reset
          </motion.button>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-100'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-lg">
          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <Bell size={24} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Notification Preferences</h2>
                  <p className="text-sm text-slate-500 font-medium">Manage how you receive updates</p>
                </div>
              </div>

              <SettingToggle
                icon={Mail}
                label="Email Notifications"
                description="Receive updates via email"
                checked={localSettings.notifications.email}
                onChange={(val) => updateSetting('notifications', 'email', val)}
              />
              <SettingToggle
                icon={Smartphone}
                label="Push Notifications"
                description="Get instant alerts on your device"
                checked={localSettings.notifications.push}
                onChange={(val) => updateSetting('notifications', 'push', val)}
              />
              <SettingToggle
                icon={CloudRain}
                label="Weather Alerts"
                description="Notifications for severe weather conditions"
                checked={localSettings.notifications.weatherAlerts}
                onChange={(val) => updateSetting('notifications', 'weatherAlerts', val)}
              />
              <SettingToggle
                icon={TrendingUp}
                label="Prediction Updates"
                description="Get notified when predictions change"
                checked={localSettings.notifications.predictionUpdates}
                onChange={(val) => updateSetting('notifications', 'predictionUpdates', val)}
              />
              <SettingToggle
                icon={Brain}
                label="AI Insights"
                description="Receive AI-generated weather insights"
                checked={localSettings.notifications.aiInsights}
                onChange={(val) => updateSetting('notifications', 'aiInsights', val)}
              />
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <Globe size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Display Settings</h2>
                  <p className="text-sm text-slate-500 font-medium">Customize your interface</p>
                </div>
              </div>

              <SettingSelect
                icon={localSettings.display.theme === 'light' ? Sun : Moon}
                label="Theme"
                description="Choose your preferred theme"
                value={localSettings.display.theme}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' }
                ]}
                onChange={(val) => updateSetting('display', 'theme', val)}
              />
              <SettingSelect
                icon={Globe}
                label="Language"
                description="Select your language"
                value={localSettings.display.language}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'hi', label: 'हिंदी (Hindi)' },
                  { value: 'mr', label: 'मराठी (Marathi)' },
                  { value: 'ur', label: 'اردو (Urdu)' },
                  { value: 'ar', label: 'العربية (Arabic)' }
                ]}
                onChange={(val) => updateSetting('display', 'language', val)}
              />
              <SettingSelect
                icon={Thermometer}
                label="Temperature Unit"
                description="Display temperature in"
                value={localSettings.display.temperatureUnit}
                options={[
                  { value: 'celsius', label: 'Celsius (°C)' },
                  { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
                ]}
                onChange={(val) => updateSetting('display', 'temperatureUnit', val)}
              />
              <SettingSelect
                icon={Wind}
                label="Wind Speed Unit"
                description="Display wind speed in"
                value={localSettings.display.windSpeedUnit}
                options={[
                  { value: 'kmh', label: 'km/h' },
                  { value: 'mph', label: 'mph' },
                  { value: 'ms', label: 'm/s' }
                ]}
                onChange={(val) => updateSetting('display', 'windSpeedUnit', val)}
              />
              <SettingSelect
                icon={Calendar}
                label="Date Format"
                description="Choose date display format"
                value={localSettings.display.dateFormat}
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                ]}
                onChange={(val) => updateSetting('display', 'dateFormat', val)}
              />
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                  <Lock size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Privacy & Security</h2>
                  <p className="text-sm text-slate-500 font-medium">Control your data and privacy</p>
                </div>
              </div>

              <SettingToggle
                icon={Database}
                label="Share Anonymous Data"
                description="Help improve predictions by sharing anonymous usage data"
                checked={localSettings.privacy.shareData}
                onChange={(val) => updateSetting('privacy', 'shareData', val)}
              />
              <SettingToggle
                icon={localSettings.privacy.publicProfile ? Eye : EyeOff}
                label="Public Profile"
                description="Make your profile visible to other users"
                checked={localSettings.privacy.publicProfile}
                onChange={(val) => updateSetting('privacy', 'publicProfile', val)}
              />
              <SettingToggle
                icon={Shield}
                label="Show History"
                description="Display prediction history on your profile"
                checked={localSettings.privacy.showHistory}
                onChange={(val) => updateSetting('privacy', 'showHistory', val)}
              />
            </div>
          )}

          {/* Predictions Settings */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Zap size={24} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Prediction Settings</h2>
                  <p className="text-sm text-slate-500 font-medium">Configure prediction behavior</p>
                </div>
              </div>

              <SettingToggle
                icon={RotateCcw}
                label="Auto Refresh"
                description="Automatically refresh predictions"
                checked={localSettings.predictions.autoRefresh}
                onChange={(val) => updateSetting('predictions', 'autoRefresh', val)}
              />
              <SettingSlider
                label="Refresh Interval"
                description="How often to refresh predictions (minutes)"
                value={localSettings.predictions.refreshInterval}
                min={5}
                max={120}
                step={5}
                onChange={(val) => updateSetting('predictions', 'refreshInterval', val)}
                disabled={!localSettings.predictions.autoRefresh}
              />
              <SettingSlider
                label="Confidence Threshold"
                description="Minimum confidence level to show predictions (%)"
                value={localSettings.predictions.confidenceThreshold}
                min={50}
                max={95}
                step={5}
                onChange={(val) => updateSetting('predictions', 'confidenceThreshold', val)}
              />
              <SettingToggle
                icon={TrendingUp}
                label="Advanced Metrics"
                description="Show detailed prediction metrics and analysis"
                checked={localSettings.predictions.showAdvancedMetrics}
                onChange={(val) => updateSetting('predictions', 'showAdvancedMetrics', val)}
              />
            </div>
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <Brain size={24} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">AI Assistant Settings</h2>
                  <p className="text-sm text-slate-500 font-medium">Configure AI features</p>
                </div>
              </div>

              <SettingToggle
                icon={MessageSquare}
                label="Enable Chat Assistant"
                description="Use AI-powered chat for weather insights"
                checked={localSettings.ai.enableChatAssistant}
                onChange={(val) => updateSetting('ai', 'enableChatAssistant', val)}
              />
              <SettingToggle
                icon={Brain}
                label="Auto Suggestions"
                description="Get AI-powered suggestions and tips"
                checked={localSettings.ai.autoSuggestions}
                onChange={(val) => updateSetting('ai', 'autoSuggestions', val)}
              />
              <SettingToggle
                icon={localSettings.ai.voiceInput ? Volume2 : VolumeX}
                label="Voice Input"
                description="Use voice commands with AI assistant"
                checked={localSettings.ai.voiceInput}
                onChange={(val) => updateSetting('ai', 'voiceInput', val)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SettingToggle = ({ icon: Icon, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-slate-600" />
      </div>
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-all ${
        checked ? 'bg-gradient-to-r from-primary-500 to-indigo-600' : 'bg-slate-200'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  </div>
);

const SettingSelect = ({ icon: Icon, label, description, value, options, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-slate-600" />
      </div>
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 focus:border-primary-500 focus:outline-none transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const SettingSlider = ({ label, description, value, min, max, step, onChange, disabled }) => (
  <div className={`p-4 rounded-2xl hover:bg-slate-50 transition-colors ${disabled ? 'opacity-50' : ''}`}>
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <span className="text-2xl font-black text-primary-600">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
      style={{
        background: disabled ? '#e2e8f0' : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
      }}
    />
  </div>
);

export default Settings;

// Made with Bob
