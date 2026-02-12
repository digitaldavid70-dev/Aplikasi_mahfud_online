import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, Menu, X, Users, Truck, RotateCcw, BarChart3, Settings, LogOut } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useApp();
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { id: 'dashboard', path: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
        { id: 'products', path: '/products', label: 'Produk', icon: <Box size={20} /> },
        // FAB for Sales
        { id: 'add-sale', label: 'Jual', icon: <ShoppingCart size={24} className="text-white" />, isFab: true, path: '/sales' },
        { id: 'distributions', path: '/distributions', label: 'Kirim', icon: <Truck size={20} /> },
        { id: 'more', label: 'Lainnya', icon: <Menu size={20} />, action: () => setShowMoreMenu(true) },
    ];

    const moreItems = [
        { id: 'partners', path: '/partners', label: 'Mitra', icon: <Users size={20} /> },
        { id: 'returns', path: '/returns', label: 'Retur', icon: <RotateCcw size={20} /> },
        { id: 'reports', path: '/reports', label: 'Laporan', icon: <BarChart3 size={20} /> },
        { id: 'settings', path: '/settings', label: 'Pengaturan', icon: <Settings size={20} />, adminOnly: true },
    ];

    const handleNavClick = (item) => {
        if (item.action) {
            item.action();
        } else {
            navigate(item.path);
        }
    };

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-between items-center z-[50] pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
            >
                {navItems.map((item, index) => {
                    if (item.isFab) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className="relative -top-6 flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center transform active:scale-95 transition-transform">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 mt-1">{item.label}</span>
                            </button>
                        );
                    }
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`flex flex-col items-center justify-center w-16 py-1 gap-1 transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400'
                                }`}
                        >
                            {item.icon}
                            <span className={`text-[10px] font-medium ${isActive(item.path) ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* More Menu Drawer (simplified overlay) */}
            {showMoreMenu && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center md:hidden animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="relative bg-white w-full rounded-t-2xl p-6 shadow-2xl animate-slide-up pb-[calc(1rem+env(safe-area-inset-bottom))]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Menu Lainnya</h3>
                            <button
                                onClick={() => setShowMoreMenu(false)}
                                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {moreItems.filter((i) => !i.adminOnly || (user && user.role === 'admin')).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.path);
                                        setShowMoreMenu(false);
                                    }}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`p-3 rounded-xl transition-colors ${isActive(item.path) ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-600 group-hover:bg-slate-100'
                                        }`}>
                                        {React.cloneElement(item.icon, { size: 24 })}
                                    </div>
                                    <span className={`text-xs text-center font-medium ${isActive(item.path) ? 'text-blue-600' : 'text-slate-600'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <button
                                onClick={() => {
                                    logout();
                                    setShowMoreMenu(false);
                                }}
                                className="flex items-center justify-center gap-2 w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition-colors"
                            >
                                <LogOut size={20} />
                                Keluar Aplikasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNav;
