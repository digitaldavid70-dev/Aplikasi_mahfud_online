import React, { useState } from 'react';
import { RotateCcw, Printer } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDateShort } from '../../utils/formatters';
import { printReturnInvoice } from '../../utils/print';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ReturnsView = () => {
    const { returns, partners, products, createReturn } = useApp();
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const partnerId = e.target.partner.value;
            const productId = e.target.product.value;
            const qty = parseInt(e.target.qty.value);
            const reason = e.target.reason.value;

            createReturn(partnerId, productId, qty, reason);
            setShowModal(false);
            e.target.reset();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Retur Barang
                </h2>
                <Button variant="danger" onClick={() => setShowModal(true)}>
                    <RotateCcw size={18} />
                    Input Retur
                </Button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Mitra</th>
                            <th>Barang</th>
                            <th style={{ textAlign: 'center' }}>Qty</th>
                            <th>Alasan</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map(r => (
                            <tr key={r.id} style={{ fontSize: '0.875rem' }}>
                                <td style={{ fontWeight: '700' }}>{formatDateShort(r.date)}</td>
                                <td>{r.partnerName}</td>
                                <td>{r.productName}</td>
                                <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--danger)' }}>
                                    {r.qty}
                                </td>
                                <td style={{ fontStyle: 'italic', color: 'var(--slate-500)' }}>
                                    {r.reason}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => printReturnInvoice(r)}
                                        style={{
                                            padding: '0.5rem',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            borderRadius: 'var(--radius-lg)',
                                            color: 'var(--danger)',
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                        }}
                                        title="Cetak Bukti Retur"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Input Retur Barang">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select name="partner" required>
                        <option value="">Pilih Mitra</option>
                        {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select name="product" required>
                        <option value="">Pilih Produk</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <input name="qty" type="number" placeholder="Kuantitas" min="1" required />
                    <input name="reason" placeholder="Alasan (Rusak/Expired/dll)" required />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="danger" type="submit" style={{ flex: 1 }}>
                            Simpan Retur
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ReturnsView;
