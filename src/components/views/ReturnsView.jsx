import React, { useState, useMemo } from 'react';
import { RotateCcw, Printer, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { formatDateShort } from '../../utils/formatters';
import { printReturnInvoice } from '../../utils/print';
import { searchInObject } from '../../utils/search';
import Button from '../common/Button';
import Modal from '../common/Modal';
import SearchBar from '../common/SearchBar';

const ReturnsView = () => {
    const { returns, partners, products, createReturn } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered returns based on search
    const filteredReturns = useMemo(() => {
        return returns.filter(r => searchInObject(r, searchQuery));
    }, [returns, searchQuery]);

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
            toast.error(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Retur Barang
                </h2>
                <Button variant="danger" onClick={() => setShowModal(true)}>
                    <RotateCcw size={18} />
                    Input Retur
                </Button>
            </div>

            {/* toolbar */}
            <div className="card" style={{ padding: '1rem' }}>
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Cari mitra, produk, atau alasan..."
                />
            </div>

            <div className="card">
                <div className="table-container">
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
                            {filteredReturns.map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: '600' }}>{formatDateShort(r.date)}</td>
                                    <td>{r.partnerName}</td>
                                    <td style={{ fontWeight: '600' }}>{r.productName}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--danger)' }}>{r.qty}</span>
                                    </td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                                        {r.reason}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => printReturnInvoice(r)}
                                            className="action-btn danger"
                                            title="Cetak Bukti Retur"
                                        >
                                            <Printer size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredReturns.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                        Tidak ada data retur yang ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
