import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR, formatDateTime } from '../../utils/formatters';

const ReportsView = () => {
    const { sales, distributions, payments, returns } = useApp();

    const allLogs = useMemo(() => {
        return [
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
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [sales, distributions, payments, returns]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                Laporan Konsolidasi
            </h2>

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
                                    {formatDateTime(log.date)}
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
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsView;
