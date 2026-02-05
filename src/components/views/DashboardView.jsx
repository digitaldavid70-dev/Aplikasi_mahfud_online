import React, { useMemo } from 'react';
import { TrendingUp, Wallet, Truck, AlertCircle, ShoppingCart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR } from '../../utils/formatters';
import StatCard from '../common/StatCard';

const DashboardView = () => {
    const { products, partners, sales, distributions } = useApp();

    // Calculate statistics
    const stats = useMemo(() => ({
        totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
        totalDebt: partners.reduce((acc, p) => acc + (p.debt - p.totalPaid), 0),
        activeShipments: distributions.filter(d => d.status === 'Dalam Perjalanan').length,
        lowStockCount: products.filter(p => p.stock < 20).length
    }), [sales, partners, distributions, products]);

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

            {/* Charts & Activity */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Partner Sales Chart */}
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
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{act.partnerName}</div>
                                </div>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem 0' }}>
                                Belum ada aktivitas
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
