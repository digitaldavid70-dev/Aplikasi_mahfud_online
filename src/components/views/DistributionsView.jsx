import React, { useState, useMemo } from 'react';
import { Truck, Plus, Printer, Search, Filter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { formatDateShort } from '../../utils/formatters';
import { printDistributionInvoice } from '../../utils/print';
import { formatDistributionMessage, openWhatsApp } from '../../utils/whatsapp';
import { searchInObject } from '../../utils/search';
import { confirmAction } from '../../utils/validation';
import Button from '../common/Button';
import Modal from '../common/Modal';
import SearchBar from '../common/SearchBar';

const DistributionsView = () => {
    const { distributions, partners, products, createDistribution, markAsDelivered, settings } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    // Filtered distributions based on search and status
    const filteredDistributions = useMemo(() => {
        return distributions.filter(d => {
            const matchesSearch = searchInObject(d, searchQuery);
            const matchesStatus = statusFilter === 'Semua' || d.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [distributions, searchQuery, statusFilter]);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const formData = {
                partnerId: e.target.partner.value,
                productId: e.target.product.value,
                qty: parseInt(e.target.qty.value),
                reqDate: e.target.reqDate.value
            };
            createDistribution(formData);
            setShowModal(false);
            e.target.reset();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleMarkAsDelivered = (id) => {
        if (confirmAction('Tandai barang telah sampai?', 'Konfirmasi Penerimaan')) {
            markAsDelivered(id);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Logistik & Pengiriman
                </h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Truck size={18} />
                    Kirim Barang
                </Button>
            </div>

            {/* toolbar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Cari tujuan atau produk..."
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Filter size={18} color="var(--slate-400)" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', minWidth: '160px' }}
                    >
                        <option value="Semua">Semua Status</option>
                        <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Distributions Table (Desktop) */}
            <div className="card hidden md:block">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tgl Kirim / Permintaan</th>
                                <th>Tujuan</th>
                                <th>Produk</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDistributions.map(d => {
                                const partner = partners.find(p => p.id === d.partnerId);
                                return (
                                    <tr key={d.id}>
                                        <td>
                                            <div style={{ fontWeight: '700' }}>{formatDateShort(d.date)}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                                                Req: {formatDateShort(d.reqDate)}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{partner?.name}</td>
                                        <td>
                                            {d.productName} <span style={{ fontWeight: '700', color: 'var(--primary)' }}>x{d.qty}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${d.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        const product = products.find(p => p.id === d.productId);
                                                        const msg = formatDistributionMessage(d, partner, product, settings);
                                                        openWhatsApp(partner?.phone || '', msg);
                                                    }}
                                                    className="action-btn"
                                                    title="Kirim Surat Jalan ke WhatsApp"
                                                    style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)' }}
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const product = products.find(p => p.id === d.productId);
                                                        printDistributionInvoice(d, partner, product, settings);
                                                    }}
                                                    className="action-btn"
                                                    title="Cetak Surat Jalan"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                                {d.status === 'Dalam Perjalanan' && (
                                                    <button
                                                        onClick={() => handleMarkAsDelivered(d.id)}
                                                        style={{
                                                            padding: '0.375rem 0.75rem',
                                                            border: 'none',
                                                            background: 'var(--success)',
                                                            color: 'white',
                                                            borderRadius: 'var(--radius-md)',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700'
                                                        }}
                                                    >
                                                        Tandai Sampai
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDistributions.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                        Tidak ada pengiriman yang ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredDistributions.map(d => {
                    const partner = partners.find(p => p.id === d.partnerId);
                    return (
                        <div key={d.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                                        <Truck size={12} />
                                        {formatDateShort(d.date)}
                                    </div>
                                    <h3 className="font-bold text-slate-800">{partner?.name}</h3>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Req: {formatDateShort(d.reqDate)}
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${d.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {d.status}
                                </span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg mb-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-700">{d.productName}</span>
                                    <span className="font-bold text-blue-600">x{d.qty}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const product = products.find(p => p.id === d.productId);
                                            const msg = formatDistributionMessage(d, partner, product, settings);
                                            openWhatsApp(partner?.phone || '', msg);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#25D366] text-white font-medium text-sm active:scale-95 transition-transform"
                                    >
                                        <MessageCircle size={16} />
                                        WA Surat Jalan
                                    </button>
                                    <button
                                        onClick={() => {
                                            const product = products.find(p => p.id === d.productId);
                                            printDistributionInvoice(d, partner, product, settings);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 active:scale-95 transition-transform"
                                    >
                                        <Printer size={16} />
                                        Cetak
                                    </button>
                                </div>
                                {d.status === 'Dalam Perjalanan' && (
                                    <button
                                        onClick={() => handleMarkAsDelivered(d.id)}
                                        className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium text-sm active:scale-95 transition-transform"
                                    >
                                        Tandai Barang Sampai
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredDistributions.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Truck size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Tidak ada data pengiriman</p>
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Kirim Barang ke Mitra">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                            TANGGAL PERMINTAAN
                        </label>
                        <input name="reqDate" type="date" required />
                    </div>
                    <select name="partner" required>
                        <option value="">Pilih Mitra Tujuan</option>
                        {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select name="product" required>
                        <option value="">Pilih Produk</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                        ))}
                    </select>
                    <input name="qty" type="number" placeholder="Kuantitas" min="1" required />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" style={{ flex: 1 }}>
                            Konfirmasi Kirim
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DistributionsView;
