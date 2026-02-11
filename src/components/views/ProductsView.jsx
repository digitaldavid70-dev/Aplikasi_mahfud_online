import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Search, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR } from '../../utils/formatters';
import { searchInObject } from '../../utils/search';
import { confirmAction } from '../../utils/validation';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import SearchBar from '../common/SearchBar';

const ProductsView = () => {
    const { products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // Filtered products based on search
    const filteredProducts = useMemo(() => {
        return products.filter(p => searchInObject(p, searchQuery));
    }, [products, searchQuery]);

    const handleSelectAll = () => {
        if (selectedIds.length === filteredProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map(p => p.id));
        }
    };

    const handleSelectItem = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (confirmAction(`Hapus ${selectedIds.length} produk`, 'Terpilih')) {
            bulkDeleteProducts(selectedIds);
            setSelectedIds([]);
        }
    };

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
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Stok Gudang Pusat
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {selectedIds.length > 0 && (
                        <Button variant="danger" onClick={handleBulkDelete}>
                            <Trash2 size={18} />
                            Hapus ({selectedIds.length})
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Tambah Produk
                    </Button>
                </div>
            </div>

            {/* toolbar */}
            <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Cari nama produk atau kategori..."
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--slate-500)' }}>
                        Menampilkan <strong>{filteredProducts.length}</strong> produk
                    </span>
                </div>
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px', padding: '1rem' }}>
                                    <button
                                        onClick={handleSelectAll}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}
                                    >
                                        {selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                                            ? <CheckSquare size={20} />
                                            : <Square size={20} />
                                        }
                                    </button>
                                </th>
                                <th>Nama Produk</th>
                                <th>Kategori</th>
                                <th style={{ textAlign: 'right' }}>Harga</th>
                                <th style={{ textAlign: 'right' }}>Diskon</th>
                                <th style={{ textAlign: 'center' }}>Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id} style={{ background: selectedIds.includes(p.id) ? 'rgba(245, 158, 11, 0.05)' : 'none' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleSelectItem(p.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedIds.includes(p.id) ? 'var(--primary)' : 'var(--slate-300)', display: 'flex', alignItems: 'center' }}
                                        >
                                            {selectedIds.includes(p.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </button>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{p.name}</td>
                                    <td>
                                        <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatIDR(p.price)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {p.discount ? (
                                            <span className="badge badge-success">
                                                {p.discount}%
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>-</span>
                                        )}
                                    </td>
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
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                                        Tidak ada produk yang ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
