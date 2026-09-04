import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AIChatAssistant from './components/AIChatAssistant';
import KeyboardShortcuts from './components/KeyboardShortcuts';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />
    <div className="flex-1 md:ml-72 flex flex-col min-w-0">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
    <AIChatAssistant />
    <KeyboardShortcuts />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <LanguageProvider>
            <Router>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout><Dashboard /></DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/predict" element={
                  <ProtectedRoute>
                    <DashboardLayout><Predict /></DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/history" element={
                  <ProtectedRoute>
                    <DashboardLayout><History /></DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <DashboardLayout><Analytics /></DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <DashboardLayout><Settings /></DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </LanguageProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
