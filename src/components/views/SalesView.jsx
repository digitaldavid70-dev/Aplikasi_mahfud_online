import React, { useState, useMemo } from 'react';
import { Plus, Printer, User, Search, Calendar, Filter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { formatIDR, formatDateShort } from '../../utils/formatters';
import { printInvoice } from '../../utils/print';
import { formatInvoiceMessage, openWhatsApp } from '../../utils/whatsapp';
import { searchInObject } from '../../utils/search';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import SearchBar from '../common/SearchBar';

const SalesView = () => {
    const { sales, partners, products, createSale, settings } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [saleType, setSaleType] = useState('direct'); // 'direct' or 'partner'
    const [price, setPrice] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Filtered sales based on search and date range
    const filteredSales = useMemo(() => {
        return sales.filter(s => {
            const matchesSearch = searchInObject(s, searchQuery);
            const matchesDate = (!startDate || s.saleDate >= startDate) &&
                (!endDate || s.saleDate <= endDate);
            return matchesSearch && matchesDate;
        });
    }, [sales, searchQuery, startDate, endDate]);

    const totalFiltered = useMemo(() => {
        return filteredSales.reduce((acc, curr) => acc + curr.total, 0);
    }, [filteredSales]);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const formData = {
                isDirect: saleType === 'direct',
                partnerId: saleType === 'partner' ? e.target.partner.value : null,
                productId: e.target.product.value,
                buyerName: e.target.buyerName.value,
                qty: parseInt(e.target.qty.value),
                price: price,
                paymentMethod: e.target.method.value,
                saleDate: e.target.saleDate.value
            };
            createSale(formData);
            setShowModal(false);
            e.target.reset();
            setPrice(0);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Riwayat Penjualan
                </h2>
                <Button variant="success" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Input Penjualan
                </Button>
            </div>

            {/* toolbar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Cari pembeli, produk, atau mitra..."
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
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(''); setEndDate(''); }}
                                style={{ border: 'none', background: 'none', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>Total Penjualan Terfilter:</span>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--success)' }}>{formatIDR(totalFiltered)}</span>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal / Pembeli</th>
                                <th>Asal / Produk</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Harga Satuan</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                                <th style={{ textAlign: 'center' }}>Metode</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                                            {formatDateShort(s.saleDate)}
                                        </div>
                                        <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <User size={12} /> {s.buyerName}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{s.partnerName}</div>
                                        <div style={{ fontWeight: '600' }}>{s.productName}</div>
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: '600' }}>{s.qty}</td>
                                    <td style={{ textAlign: 'right' }}>{formatIDR(s.price)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: '700' }}>{formatIDR(s.total)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', fontSize: '0.625rem' }}>
                                            {s.paymentMethod}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => {
                                                const msg = formatInvoiceMessage(s, settings);
                                                openWhatsApp(s.buyerPhone || '', msg); // Assuming buyerPhone might exist later, or just open with text
                                            }}
                                            className="action-btn"
                                            title="Kirim ke WhatsApp"
                                            style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)' }}
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => printInvoice(s, settings)}
                                            className="action-btn"
                                            title="Cetak Invoice"
                                        >
                                            <Printer size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                        Tidak ada data penjualan yang ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Input Penjualan">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Sale Type Toggle */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--slate-100)',
                        padding: '0.25rem',
                        borderRadius: 'var(--radius-xl)',
                        gap: '0.25rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => setSaleType('direct')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: 'none',
                                background: saleType === 'direct' ? 'white' : 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: saleType === 'direct' ? 'var(--shadow-sm)' : 'none'
                            }}
                        >
                            Dari Gudang
                        </button>
                        <button
                            type="button"
                            onClick={() => setSaleType('partner')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: 'none',
                                background: saleType === 'partner' ? 'white' : 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: saleType === 'partner' ? 'var(--shadow-sm)' : 'none'
                            }}
                        >
                            Dari Mitra
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.625rem', fontWeight: '700', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                                TGL TRANSAKSI
                            </label>
                            <input name="saleDate" type="date" required />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.625rem', fontWeight: '700', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>
                                PEMBAYARAN
                            </label>
                            <select name="method" required>
                                <option value="Tunai">Tunai</option>
                                <option value="Transfer">Transfer</option>
                            </select>
                        </div>
                    </div>

                    {saleType === 'partner' && (
                        <select name="partner" required>
                            <option value="">Pilih Mitra</option>
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    )}

                    <select name="product" required>
                        <option value="">Pilih Produk</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <input name="buyerName" placeholder="Nama Pembeli" required />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <CurrencyInput onChange={setPrice} placeholder="Harga Jual" required />
                        <input name="qty" type="number" placeholder="Qty" min="1" required />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="success" type="submit" style={{ flex: 1 }}>
                            Proses Penjualan
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SalesView;
