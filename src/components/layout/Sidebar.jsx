import React from 'react';
import {
    LayoutDashboard, Box, Users, Truck,
    ShoppingCart, RotateCcw, BarChart3, Settings as SettingsIcon, LogOut, X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Map IDs to paths
    const menuItems = [
        { id: 'dashboard', path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'products', path: '/products', label: 'Produk', icon: <Box size={20} /> },
        { id: 'partners', path: '/partners', label: 'Mitra', icon: <Users size={20} /> },
        { id: 'distributions', path: '/distributions', label: 'Logistik', icon: <Truck size={20} /> },
        { id: 'sales', path: '/sales', label: 'Penjualan', icon: <ShoppingCart size={20} /> },
        { id: 'returns', path: '/returns', label: 'Retur Barang', icon: <RotateCcw size={20} /> },
        { id: 'reports', path: '/reports', label: 'Laporan', icon: <BarChart3 size={20} /> },
        { id: 'settings', path: '/settings', label: 'Pengaturan', icon: <SettingsIcon size={20} />, adminOnly: true },
    ];

    const filteredItems = menuItems.filter(item => !item.adminOnly || user?.role === 'admin');

    const handleNavClick = (path) => {
        navigate(path);
        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    // Check if item is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
                />
            )}

            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                            <Box color="white" size={24} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', letterSpacing: '-0.025em' }}>EDistri</span>
                    </div>
                    {isMobileMenuOpen && <X onClick={() => setIsMobileMenuOpen(false)} style={{ cursor: 'pointer', color: 'var(--slate-400)' }} />}
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {filteredItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.path)}
                            className={isActive(item.path) ? 'active' : ''}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-lg)', border: 'none', background: isActive(item.path) ? 'var(--primary)' : 'transparent',
                                color: isActive(item.path) ? 'white' : 'var(--slate-400)', cursor: 'pointer', fontWeight: '600', textAlign: 'left',
                                transition: 'all 0.2s'
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={logout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        <LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
