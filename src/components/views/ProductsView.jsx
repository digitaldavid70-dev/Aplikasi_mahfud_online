import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR } from '../../utils/formatters';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';

const ProductsView = () => {
    const { products, addProduct } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            category: e.target.category.value,
            price: price,
            stock: e.target.stock.value
        };
        addProduct(formData);
        setShowModal(false);
        e.target.reset();
        setPrice(0);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Stok Gudang Pusat
                </h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Tambah Produk
                </Button>
            </div>

            {/* Products Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nama Produk</th>
                            <th>Kategori</th>
                            <th style={{ textAlign: 'right' }}>Harga</th>
                            <th style={{ textAlign: 'center' }}>Stok</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: '600' }}>{p.name}</td>
                                <td>
                                    <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                                        {p.category}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatIDR(p.price)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span style={{
                                        fontWeight: '700',
                                        color: p.stock < 20 ? 'var(--danger)' : 'var(--slate-900)'
                                    }}>
                                        {p.stock}
                                    </span>
                                    {p.stock < 20 && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginLeft: '0.5rem' }}>
                                            ⚠️
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Produk Baru">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" placeholder="Nama Produk" required />
                    <select name="category" required>
                        <option value="">Pilih Kategori</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Bahan Baku">Bahan Baku</option>
                    </select>
                    <CurrencyInput onChange={setPrice} placeholder="Harga Jual" required />
                    <input name="stock" type="number" placeholder="Stok Awal" min="0" required />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" style={{ flex: 1 }}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductsView;
