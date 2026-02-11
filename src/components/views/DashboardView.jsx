import React, { useMemo } from 'react';
import { TrendingUp, Wallet, Truck, AlertCircle, ShoppingCart, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { formatIDR } from '../../utils/formatters';
import StatCard from '../common/StatCard';

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#E11D48', '#8B5CF6'];

const DashboardView = () => {
    const { products, partners, sales, distributions } = useApp();

    // Calculate statistics
    const stats = useMemo(() => ({
        totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
        totalDebt: partners.reduce((acc, p) => acc + (p.debt - p.totalPaid), 0),
        activeShipments: distributions.filter(d => d.status === 'Dalam Perjalanan').length,
        lowStockCount: products.filter(p => p.stock < 20).length
    }), [sales, partners, distributions, products]);

    // Revenue Trend Data (Last 7 days or months)
    const revenueTrendData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dailyTotal = sales
                .filter(s => s.date === date)
                .reduce((sum, s) => sum + s.total, 0);
            return {
                name: date.split('-').slice(1).reverse().join('/'),
                revenue: dailyTotal
            };
        });
    }, [sales]);

    // Category Distribution Data
    const categoryData = useMemo(() => {
        const categories = [...new Set(products.map(p => p.category))];
        return categories.map(cat => ({
            name: cat,
            value: products.filter(p => p.category === cat).length
        }));
    }, [products]);

    // Partner sales ranking
    const partnerSales = useMemo(() => {
        return partners.map(p => {
            const total = sales.filter(s => s.partnerName === p.name).reduce((sum, s) => sum + s.total, 0);
            return { name: p.name, total };
        }).sort((a, b) => b.total - a.total).slice(0, 4);
    }, [partners, sales]);

    const maxSale = Math.max(...partnerSales.map(p => p.total), 1);

    // Recent activities
    const recentActivities = useMemo(() => {
        const combined = [
            ...sales.map(s => ({ ...s, type: 'Sale', icon: <ShoppingCart size={14} />, color: '#10B981' })),
            ...distributions.map(d => ({ ...d, type: 'Dist', icon: <Truck size={14} />, color: '#F59E0B' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        return combined.slice(0, 5);
    }, [sales, distributions]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard
                    title="Pendapatan"
                    value={formatIDR(stats.totalRevenue)}
                    icon={<TrendingUp size={24} />}
                    color="success"
                />
                <StatCard
                    title="Piutang"
                    value={formatIDR(stats.totalDebt)}
                    icon={<Wallet size={24} />}
                    color="info"
                />
                <StatCard
                    title="Distribusi Aktif"
                    value={stats.activeShipments}
                    icon={<Truck size={24} />}
                    color="primary"
                />
                <StatCard
                    title="Stok Menipis"
                    value={stats.lowStockCount}
                    icon={<AlertCircle size={24} />}
                    color="danger"
                />
            </div>

            {/* Main Charts Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Revenue Line Chart */}
                <div className="card" style={{ padding: '1.5rem', minHeight: '350px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LineIcon size={18} color="var(--primary)" /> Tren Pendapatan (7 Hari Terakhir)
                        </h3>
                    </div>
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                                <Tooltip
                                    formatter={(value) => [formatIDR(value), 'Pendapatan']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="card" style={{ padding: '1.5rem', minHeight: '350px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieIcon size={18} color="var(--success)" /> Distribusi Produk per Kategori
                    </h3>
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Partners & Activities */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Partner Sales Ranking */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        Penjualan Mitra Tertinggi
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {partnerSales.map((p, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600' }}>
                                    <span>{p.name}</span>
                                    <span style={{ color: 'var(--primary)' }}>{formatIDR(p.total)}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(p.total / maxSale) * 100}%`,
                                        height: '100%',
                                        background: 'var(--gradient-primary)',
                                        borderRadius: '999px',
                                        transition: 'width 0.5s ease'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Stock Alerts */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--danger)' }}>
                        Peringatan Stok Kritis
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.filter(p => p.stock < 20).slice(0, 5).map((p, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem',
                                background: p.stock === 0 ? 'rgba(225, 29, 72, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                                borderRadius: 'var(--radius-lg)',
                                border: `1px solid ${p.stock === 0 ? 'rgba(225, 29, 72, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: p.stock === 0 ? 'var(--danger)' : 'var(--warning)'
                                }}></div>
                                <div style={{ flex: 1, fontSize: '0.875rem' }}>
                                    <div style={{ fontWeight: '700' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Kategori: {p.category}</div>
                                </div>
                                <div style={{ fontWeight: '800', color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>
                                    {p.stock} <span style={{ fontSize: '0.625rem', fontWeight: '400' }}>unit</span>
                                </div>
                            </div>
                        ))}
                        {products.filter(p => p.stock < 20).length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--success)', padding: '2rem 0', fontWeight: '600' }}>
                                Semua stok aman ✅
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        Aktivitas Terkini
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentActivities.map((act, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                borderBottom: i < recentActivities.length - 1 ? '1px solid var(--slate-100)' : 'none',
                                paddingBottom: '1rem'
                            }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--slate-50)',
                                    color: act.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    width: '32px',
                                    height: '32px'
                                }}>
                                    {act.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: 'var(--slate-900)' }}>{act.productName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{act.partnerName} • {act.type === 'Sale' ? 'Penjualan' : 'Distribusi'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
