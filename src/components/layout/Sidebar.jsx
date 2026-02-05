import React from 'react';
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    ShoppingCart,
    RotateCcw,
    FileText,
    LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, expanded, setExpanded, user, logout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Produk (Stok)', icon: Package },
        { id: 'partners', label: 'Mitra', icon: Users },
        { id: 'dist', label: 'Distribusi', icon: Truck },
        { id: 'sales', label: 'Penjualan', icon: ShoppingCart },
        { id: 'returns', label: 'Retur Barang', icon: RotateCcw },
        { id: 'reports', label: 'Laporan', icon: FileText },
    ];

    return (
        <aside
            style={{
                width: expanded ? '256px' : '80px',
                background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
                color: 'var(--slate-300)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'sticky',
                top: 0,
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
                zIndex: 30
            }}
        >
            {/* Header */}
            <div style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid var(--slate-800)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                }}>
                    <Package size={20} />
                </div>
                {expanded && (
                    <span style={{
                        fontWeight: '700',
                        color: 'white',
                        fontSize: '1.125rem',
                        letterSpacing: '-0.02em'
                    }}>
                        ERP DISTRI
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav style={{
                flex: 1,
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                overflowY: 'auto'
            }}>
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.625rem 0.75rem',
                                borderRadius: 'var(--radius-xl)',
                                border: 'none',
                                background: isActive ? 'var(--gradient-primary)' : 'transparent',
                                color: isActive ? 'white' : 'var(--slate-400)',
                                cursor: 'pointer',
                                fontWeight: isActive ? '600' : '500',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                boxShadow: isActive ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'var(--slate-800)';
                                    e.currentTarget.style.color = 'var(--slate-300)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--slate-400)';
                                }
                            }}
                        >
                            <Icon size={20} style={{ flexShrink: 0 }} />
                            {expanded && <span>{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid var(--slate-800)'
            }}>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--radius-lg)',
                        border: 'none',
                        background: 'transparent',
                        color: '#FCA5A5',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogOut size={20} />
                    {expanded && <span>Keluar</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
