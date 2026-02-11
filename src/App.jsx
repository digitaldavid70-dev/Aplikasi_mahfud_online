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
  const { isLoggedIn, settings, isLoading } = useApp();
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
        <Header
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="main-content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          background: 'var(--slate-50)'
        }}>
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
