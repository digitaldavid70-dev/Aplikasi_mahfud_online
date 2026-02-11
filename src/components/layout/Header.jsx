import React, { useState } from 'react';
import {
    Bell, User, LogOut, Menu, Search,
    Box, Users, ChevronDown, Settings as SettingsIcon
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
    const { user, logout, notifications, clearNotifications, settings } = useApp();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const unreadCount = notifications.length;

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
                    {settings?.companyName || 'ERP Distri'}
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Search - Hidden on Small Mobile */}
                <div style={{ position: 'relative', display: 'none' }} className="md-flex">
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    <input
                        type="text"
                        placeholder="Cari cepat..."
                        style={{ padding: '0.5rem 0.75rem 0.5rem 2.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--slate-200)', fontSize: '0.875rem', width: '200px', background: 'var(--slate-50)' }}
                    />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="action-btn"
                        onClick={() => setShowNotifs(!showNotifs)}
                        style={{ position: 'relative', padding: '0.5rem' }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span style={{ position: 'absolute', top: '2px', right: '2px', background: 'var(--danger)', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 5px', borderRadius: 'var(--radius-full)', border: '2px solid white' }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="card scrollbar-custom" style={{ position: 'absolute', top: '100%', right: 0, width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 100, marginTop: '0.5rem', padding: '0', boxShadow: 'var(--shadow-xl)' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Notifikasi</span>
                                {unreadCount > 0 && (
                                    <button onClick={clearNotifications} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Hapus Semua</button>
                                )}
                            </div>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                                    Tidak ada notifikasi baru
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--slate-50)', position: 'relative' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: n.type === 'stock' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                                                {n.type === 'stock' ? <Box size={16} color="var(--danger)" /> : <Users size={16} color="var(--warning)" />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--slate-900)' }}>{n.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>{n.message}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--slate-200)', background: 'white', cursor: 'pointer' }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.875rem' }}>
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--slate-700)' }} className="md-block">
                            {user?.username}
                        </span>
                        <ChevronDown size={16} color="var(--slate-400)" />
                    </button>

                    {showUserMenu && (
                        <div className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '180px', zIndex: 100, marginTop: '0.5rem', padding: '0.5rem', boxShadow: 'var(--shadow-xl)' }}>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: 'none', borderRadius: 'var(--radius-md)', color: 'var(--slate-700)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}
                                    className="hover-bg-slate-50"
                                >
                                    <SettingsIcon size={18} /> Pengaturan
                                </button>
                            )}
                            <button
                                onClick={logout}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: 'none', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}
                                className="hover-bg-slate-50"
                            >
                                <LogOut size={18} /> Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
