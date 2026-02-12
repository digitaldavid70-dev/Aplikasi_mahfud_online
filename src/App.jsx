import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoginView from './components/views/LoginView';
import DashboardView from './components/views/DashboardView';
import ProductsView from './components/views/ProductsView';
import PartnersView from './components/views/PartnersView';
import DistributionsView from './components/views/DistributionsView';
import SalesView from './components/views/SalesView';
import ReturnsView from './components/views/ReturnsView';
import ReportsView from './components/views/ReportsView';
import SettingsView from './components/views/SettingsView';
import BottomNav from './components/layout/BottomNav';
import './styles/index.css';
import { Toaster } from 'sonner';

// Error Boundary for safety
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h2>Something went wrong in the App.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Reset Data
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function AppContent() {
  const { isLoggedIn, settings, isLoading, user } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Apply Dark Mode
  useEffect(() => {
    if (settings?.darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [settings?.darkMode]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--slate-50)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--slate-500)', fontWeight: '500' }}>Memuat data sistem...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--slate-50)',
      position: 'relative'
    }}>
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
        width: '100%',
        marginLeft: '0'
      }}>
        <div className="hidden md:block">
          <Header
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Mobile Header (simplified) */}
        <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-10">
          <h1 className="font-bold text-lg text-slate-800">EDistri</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        <div className="main-content flex-1 overflow-y-auto bg-slate-50 p-4 pb-24 md:p-6 md:pb-6">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/products" element={<ProductsView />} />
            <Route path="/partners" element={<PartnersView />} />
            <Route path="/distributions" element={<DistributionsView />} />
            <Route path="/sales" element={<SalesView />} />
            <Route path="/returns" element={<ReturnsView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Toaster richColors position="top-right" />
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
