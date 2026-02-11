import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR, formatDateTime, formatDateShort } from '../../utils/formatters';
import { searchInObject } from '../../utils/search';
import { Calendar, Filter, Search } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const ReportsView = () => {
    const { sales, distributions, payments, returns } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const allLogs = useMemo(() => {
        const logs = [
            ...sales.map(x => ({
                ...x,
                label: 'PENJUALAN',
                color: 'badge-success',
                val: x.total,
                date: x.saleDate
            })),
            ...distributions.map(x => ({
                ...x,
                label: 'DISTRIBUSI',
                color: 'badge-warning',
                val: 0,
                date: x.date
            })),
            ...payments.map(x => ({
                ...x,
                label: 'PEMBAYARAN',
                color: 'badge-info',
                val: x.amount,
                date: x.date
            })),
            ...returns.map(x => ({
                ...x,
                label: 'RETUR',
                color: 'badge-danger',
                val: 0,
                date: x.date
            })),
        ];

        return logs
            .filter(log => {
                const matchesSearch = searchInObject(log, searchQuery);
                const matchesDate = (!startDate || log.date >= startDate) &&
                    (!endDate || log.date <= endDate);
                return matchesSearch && matchesDate;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [sales, distributions, payments, returns, searchQuery, startDate, endDate]);

    const stats = useMemo(() => {
        return allLogs.reduce((acc, log) => {
            if (log.label === 'PENJUALAN') acc.sales += log.val;
            if (log.label === 'PEMBAYARAN') acc.payments += log.val;
            return acc;
        }, { sales: 0, payments: 0 });
    }, [allLogs]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                Laporan Konsolidasi
            </h2>

            {/* toolbar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Cari mitra, produk, atau tipe transaksi..."
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--slate-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                            <Calendar size={16} color="var(--slate-400)" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none' }}
                            />
                            <span style={{ margin: '0 0.5rem', color: 'var(--slate-400)' }}>-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Penjualan</div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--success)' }}>{formatIDR(stats.sales)}</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--info)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Pembayaran</div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--info)' }}>{formatIDR(stats.payments)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>Tipe</th>
                            <th>Keterangan</th>
                            <th style={{ textAlign: 'right' }}>Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLogs.map((log, i) => (
                            <tr key={i} style={{ fontSize: '0.875rem' }}>
                                <td style={{ color: 'var(--slate-400)' }}>
                                    {formatDateShort(log.date)}
                                </td>
                                <td>
                                    <span className={`badge ${log.color}`}>
                                        {log.label}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '700', color: 'var(--slate-900)' }}>
                                        {log.partnerName}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                                        {log.productName || 'Transaksi Finansial'}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: '900' }}>
                                    {log.val > 0 ? formatIDR(log.val) : '-'}
                                </td>
                            </tr>
                        ))}
                        {allLogs.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                    Tidak ada data yang ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsView;
