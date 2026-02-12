import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Search, CheckSquare, Square, Box } from 'lucide-react';
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

            {/* Products Table (Desktop) */}
            <div className="card hidden md:block">
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

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {/* Select All Bar (Mobile) */}
                {filteredProducts.length > 0 && (
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 text-slate-600 font-medium"
                        >
                            {selectedIds.length === filteredProducts.length
                                ? <CheckSquare size={20} className="text-blue-600" />
                                : <Square size={20} className="text-slate-400" />
                            }
                            <span>Pilih Semua</span>
                        </button>
                        <span className="text-xs text-slate-500">{selectedIds.length} terpilih</span>
                    </div>
                )}

                {filteredProducts.map(p => (
                    <div
                        key={p.id}
                        className={`bg-white p-4 rounded-xl shadow-sm border transition-colors relative ${selectedIds.includes(p.id) ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
                            }`}
                        onClick={() => handleSelectItem(p.id)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 p-2 rounded-lg ${p.stock < 20 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <Box size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800">{p.name}</h3>
                                        {p.stock < 20 && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Stok Tipis</span>}
                                    </div>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        {p.category}
                                    </span>
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => handleSelectItem(p.id)}
                                    className={selectedIds.includes(p.id) ? 'text-blue-600' : 'text-slate-300'}
                                >
                                    {selectedIds.includes(p.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-1">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Harga Jual</p>
                                <p className="font-bold text-lg text-blue-600">{formatIDR(p.price)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1">Sisa Stok</p>
                                <p className={`font-bold text-lg ${p.stock < 20 ? 'text-red-600' : 'text-slate-700'}`}>
                                    {p.stock} <span className="text-xs font-normal text-slate-400">unit</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Box size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Tidak ada produk ditemukan</p>
                    </div>
                )}
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
