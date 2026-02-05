import React, { useState } from 'react';
import { Plus, Package, Edit2, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatIDR } from '../../utils/formatters';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';

const PartnersView = () => {
    const { partners, products, addPartner, updatePartner, recordPayment } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const handleAdd = (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            owner: e.target.owner.value,
            address: e.target.address.value,
            phone: e.target.phone.value
        };
        addPartner(formData);
        setShowAddModal(false);
        e.target.reset();
    };

    const handleEdit = (e) => {
        e.preventDefault();
        const updates = {
            name: e.target.name.value,
            owner: e.target.owner.value,
            address: e.target.address.value,
            phone: e.target.phone.value
        };
        updatePartner(selectedPartner.id, updates);
        setShowEditModal(false);
        setSelectedPartner(null);
    };

    const handlePayment = () => {
        if (paymentAmount > 0) {
            recordPayment(selectedPartner.id, paymentAmount);
            setShowPaymentModal(false);
            setSelectedPartner(null);
            setPaymentAmount(0);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Daftar Mitra & Konsinyasi
                </h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Tambah Mitra
                </Button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nama Toko / Pemilik</th>
                            <th>Alamat & WA</th>
                            <th style={{ textAlign: 'right' }}>Saldo Piutang</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div style={{ fontWeight: '700', color: 'var(--slate-900)' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{p.owner}</div>
                                </td>
                                <td style={{ fontSize: '0.875rem' }}>
                                    <div>{p.address}</div>
                                    <div style={{ color: 'var(--success)', fontWeight: '500' }}>{p.phone}</div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--danger)' }}>
                                        {formatIDR(p.debt - p.totalPaid)}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => { setSelectedPartner(p); setShowInventoryModal(true); }}
                                            style={{
                                                padding: '0.375rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: 'var(--radius-lg)',
                                                color: 'var(--slate-600)',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Cek Stok"
                                        >
                                            <Package size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedPartner(p); setShowEditModal(true); }}
                                            style={{
                                                padding: '0.375rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: 'var(--radius-lg)',
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Edit Mitra"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedPartner(p); setShowPaymentModal(true); }}
                                            style={{
                                                padding: '0.375rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: 'var(--radius-lg)',
                                                color: 'var(--success)',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Bayar Piutang"
                                        >
                                            <DollarSign size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Daftarkan Mitra Baru">
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" placeholder="Nama Toko/Mitra" required />
                    <input name="owner" placeholder="Nama Pemilik" required />
                    <input name="phone" placeholder="Nomor WhatsApp" required />
                    <textarea name="address" placeholder="Alamat Lengkap" rows="3" required />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" style={{ flex: 1 }}>
                            Simpan Mitra
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            {selectedPartner && (
                <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Data Mitra">
                    <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input name="name" defaultValue={selectedPartner.name} placeholder="Nama Toko/Mitra" required />
                        <input name="owner" defaultValue={selectedPartner.owner} placeholder="Nama Pemilik" required />
                        <input name="phone" defaultValue={selectedPartner.phone} placeholder="Nomor WhatsApp" required />
                        <textarea name="address" defaultValue={selectedPartner.address} placeholder="Alamat Lengkap" rows="3" required />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <Button variant="outline" type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1 }}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" style={{ flex: 1 }}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Inventory Modal */}
            {selectedPartner && (
                <Modal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} title={`Stok di ${selectedPartner.name}`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.entries(selectedPartner.inventory).length > 0 ? (
                            Object.entries(selectedPartner.inventory).map(([productId, qty]) => {
                                const product = products.find(p => p.id === productId);
                                return (
                                    <div key={productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
                                        <span>{product?.name || 'Unknown'}</span>
                                        <span style={{ fontWeight: '700' }}>{qty}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem 0' }}>
                                Tidak ada stok
                            </p>
                        )}
                    </div>
                    <Button variant="outline" onClick={() => setShowInventoryModal(false)} style={{ width: '100%', marginTop: '1rem' }}>
                        Tutup
                    </Button>
                </Modal>
            )}

            {/* Payment Modal */}
            {selectedPartner && (
                <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title={`Pembayaran ${selectedPartner.name}`}>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>Total Piutang:</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)' }}>
                            {formatIDR(selectedPartner.debt - selectedPartner.totalPaid)}
                        </p>
                    </div>
                    <CurrencyInput onChange={setPaymentAmount} placeholder="Jumlah Pembayaran" />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)} style={{ flex: 1 }}>
                            Batal
                        </Button>
                        <Button variant="success" onClick={handlePayment} style={{ flex: 1 }}>
                            Simpan
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PartnersView;
