import React, { useState } from 'react';
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
import './styles/index.css';

function AppContent() {
  const { isLoggedIn, user, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'partners':
        return <PartnersView />;
      case 'dist':
        return <DistributionsView />;
      case 'sales':
        return <SalesView />;
      case 'returns':
        return <ReturnsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--slate-50)'
    }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expanded={sidebarOpen}
        setExpanded={setSidebarOpen}
        user={user}
        logout={logout}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <Header
          activeTab={activeTab}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: 'var(--slate-50)'
        }}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
