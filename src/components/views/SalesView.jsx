import React, { useState } from 'react';
import { Plus, Printer, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR, formatDateShort } from '../../utils/formatters';
import { printInvoice } from '../../utils/print';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';

const SalesView = () => {
    const { sales, partners, products, createSale } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [saleType, setSaleType] = useState('direct'); // 'direct' or 'partner'
    const [price, setPrice] = useState(0);

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
            alert(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Riwayat Penjualan
                </h2>
                <Button variant="success" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Input Penjualan
                </Button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
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
                        {sales.map(s => (
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
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => printInvoice(s)}
                                        style={{
                                            padding: '0.5rem',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            borderRadius: 'var(--radius-lg)',
                                            color: 'var(--slate-600)',
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                        }}
                                        title="Cetak Invoice"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
