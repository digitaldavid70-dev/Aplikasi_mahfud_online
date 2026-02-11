import React, { useState } from 'react';
import {
    Building2, Users, BellRing, Database, Palette,
    Save, Download, Upload, Trash2, ShieldCheck,
    Moon, Sun, MapPin, Phone, Globe, Mail, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';

const SettingsView = () => {
    const {
        settings, updateSettings,
        users, addUser, removeUser,
        exportData, importData, clearAllData
    } = useApp();

    const [activeTab, setActiveTab] = useState('profile');
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSaveSettings = () => {
        updateSettings(localSettings);
        toast.success('Pengaturan berhasil disimpan!');
    };

    const tabs = [
        { id: 'profile', label: 'Profil Perusahaan', icon: <Building2 size={18} /> },
        { id: 'users', label: 'Manajemen Pengguna', icon: <Users size={18} /> },
        { id: 'inventory', label: 'Inventori & Notifikasi', icon: <BellRing size={18} /> },
        { id: 'data', label: 'Manajemen Data', icon: <Database size={18} /> },
        { id: 'whatsapp', label: 'Template WhatsApp', icon: <MessageCircle size={18} /> },
        { id: 'ui', label: 'Personalisasi UI', icon: <Palette size={18} /> },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="view-header">
                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    Pengaturan Sistem
                </h2>
                <p style={{ color: 'var(--slate-500)' }}>Kelola identitas bisnis dan konfigurasi aplikasi</p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {/* Tabs Header */}
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    background: 'var(--slate-50)',
                    borderBottom: '1px solid var(--slate-200)',
                    padding: '0 1rem'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1.25rem 1.5rem',
                                border: 'none',
                                background: 'none',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--slate-500)',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: '2rem' }}>
                    {activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="grid-2">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Nama Perusahaan</label>
                                    <div style={{ position: 'relative' }}>
                                        <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                                        <input
                                            value={localSettings.companyName}
                                            onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                                            style={{ paddingLeft: '3rem', width: '100%' }}
                                            placeholder="Contoh: Nomad Coffee Distribution"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Nomor Telepon / WA</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                                        <input
                                            value={localSettings.companyPhone}
                                            onChange={(e) => setLocalSettings({ ...localSettings, companyPhone: e.target.value })}
                                            style={{ paddingLeft: '3rem', width: '100%' }}
                                            placeholder="Contoh: 08123456789"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Alamat Lengkap</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--slate-400)' }} />
                                    <textarea
                                        value={localSettings.companyAddress}
                                        onChange={(e) => setLocalSettings({ ...localSettings, companyAddress: e.target.value })}
                                        style={{ paddingLeft: '3rem', width: '100%', minHeight: '100px' }}
                                        placeholder="Alamat yang akan muncul di invoice..."
                                    />
                                </div>
                            </div>

                            <div className="grid-2">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Email Bisnis</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                                        <input
                                            value={localSettings.companyEmail}
                                            onChange={(e) => setLocalSettings({ ...localSettings, companyEmail: e.target.value })}
                                            style={{ paddingLeft: '3rem', width: '100%' }}
                                            placeholder="admin@bisnisanda.com"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Website</label>
                                    <div style={{ position: 'relative' }}>
                                        <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                                        <input
                                            value={localSettings.companyWebsite}
                                            onChange={(e) => setLocalSettings({ ...localSettings, companyWebsite: e.target.value })}
                                            style={{ paddingLeft: '3rem', width: '100%' }}
                                            placeholder="www.bisnisanda.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--slate-200)', paddingTop: '1.5rem' }}>
                                <Button variant="primary" onClick={handleSaveSettings}>
                                    <Save size={18} />
                                    Simpan Profil
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontWeight: '700' }}>Daftar Pengguna Sistem</h4>
                                <Button variant="outline" size="sm" onClick={() => toast.info('Fitur tambah pengguna segera hadir!')}>
                                    <Plus size={16} /> Tambah User
                                </Button>
                            </div>

                            <div className="table-container" style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nama Lengkap</th>
                                            <th>Username</th>
                                            <th>Peran</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'center' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td style={{ fontWeight: '600' }}>{user.fullName}</td>
                                                <td><code>{user.username}</code></td>
                                                <td>
                                                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td><span className="badge badge-success">Aktif</span></td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        disabled={user.role === 'admin'}
                                                        onClick={() => removeUser(user.id)}
                                                        className="action-btn danger"
                                                        style={{ opacity: user.role === 'admin' ? 0.3 : 1 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card" style={{ padding: '1.5rem', border: '1px dashed var(--primary)', background: 'rgba(59, 130, 246, 0.02)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                                    <BellRing size={18} /> Ambang Batas Notifikasi
                                </h4>
                                <div className="grid-2">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem' }}>Stok Produk Kritis</label>
                                        <input
                                            type="number"
                                            value={localSettings.lowStockThreshold}
                                            onChange={(e) => setLocalSettings({ ...localSettings, lowStockThreshold: parseInt(e.target.value) })}
                                            placeholder="Default: 20"
                                        />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Peringatan akan muncul jika stok di bawah angka ini.</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem' }}>Limit Piutang Mitra (Global)</label>
                                        <input
                                            type="number"
                                            value={localSettings.debtLimit}
                                            onChange={(e) => setLocalSettings({ ...localSettings, debtLimit: parseInt(e.target.value) })}
                                            placeholder="Contoh: 10000000"
                                        />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Memicu notifikasi tagihan besar.</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="primary" onClick={handleSaveSettings}>
                                    <Save size={18} /> Simpan Konfigurasi
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="grid-2">
                                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', gap: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Download size={48} color="var(--primary)" />
                                    <h5 style={{ fontWeight: '700' }}>Ekspor Data (Backup)</h5>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Unduh semua data transaksi, produk, dan mitra ke file JSON.</p>
                                    <Button variant="outline" fullWidth onClick={exportData}>
                                        Download Backup
                                    </Button>
                                </div>
                                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', gap: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Upload size={48} color="var(--success)" />
                                    <h5 style={{ fontWeight: '700' }}>Impor Data (Restore)</h5>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Pulihkan data dari file backup yang sudah ada.</p>
                                    <Button variant="outline" fullWidth onClick={() => toast.info('Silakan pilih file backup Anda')}>
                                        Pilih File Backup
                                    </Button>
                                </div>
                            </div>

                            <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(225, 29, 72, 0.2)', background: 'rgba(225, 29, 72, 0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h5 style={{ fontWeight: '700', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ShieldCheck size={18} /> Zona Bahaya
                                        </h5>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>Tindakan ini akan menghapus seluruh data permanen dan tidak bisa dikembalikan.</p>
                                    </div>
                                    <Button variant="danger" onClick={clearAllData}>
                                        <Trash2 size={18} /> Reset Aplikasi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'whatsapp' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#25D366' }}>
                                    <MessageCircle size={18} /> Template Pesan WhatsApp
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                                    Sesuaikan pesan otomatis yang dikirim ke pelanggan dan mitra. Gunakan variabel dalam kurung kurawal <code>{`{...}`}</code> untuk data dinamis.
                                </p>

                                <div className="grid-2">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Template Invoice Penjualan</label>
                                        <textarea
                                            value={localSettings.waInvoiceTemplate || ''}
                                            onChange={(e) => setLocalSettings({ ...localSettings, waInvoiceTemplate: e.target.value })}
                                            style={{ width: '100%', minHeight: '200px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                                            placeholder="Tulis template pesan disini..."
                                        />
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                                            <strong>Variabel Tersedia:</strong><br />
                                            <code>{`{companyName}`}</code>, <code>{`{date}`}</code>, <code>{`{buyerName}`}</code>, <code>{`{productName}`}</code>, <code>{`{qty}`}</code>, <code>{`{price}`}</code>, <code>{`{total}`}</code>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontWeight: '600', fontSize: '0.875rem' }}>Template Surat Jalan (Logistik)</label>
                                        <textarea
                                            value={localSettings.waDistributionTemplate || ''}
                                            onChange={(e) => setLocalSettings({ ...localSettings, waDistributionTemplate: e.target.value })}
                                            style={{ width: '100%', minHeight: '200px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                                            placeholder="Tulis template pesan disini..."
                                        />
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                                            <strong>Variabel Tersedia:</strong><br />
                                            <code>{`{companyName}`}</code>, <code>{`{date}`}</code>, <code>{`{partnerName}`}</code>, <code>{`{productName}`}</code>, <code>{`{qty}`}</code>, <code>{`{status}`}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="primary" onClick={handleSaveSettings}>
                                    <Save size={18} /> Simpan Template
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ui' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="grid-2">
                                <div className={`card ${!localSettings.darkMode ? 'active' : ''}`}
                                    onClick={() => setLocalSettings({ ...localSettings, darkMode: false })}
                                    style={{ padding: '1.5rem', cursor: 'pointer', border: !localSettings.darkMode ? '2px solid var(--primary)' : '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Sun size={24} color={!localSettings.darkMode ? 'var(--primary)' : 'var(--slate-400)'} />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Light Mode</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Tampilan terang standar</div>
                                    </div>
                                </div>
                                <div className={`card ${localSettings.darkMode ? 'active' : ''}`}
                                    onClick={() => setLocalSettings({ ...localSettings, darkMode: true })}
                                    style={{ padding: '1.5rem', cursor: 'pointer', border: localSettings.darkMode ? '2px solid var(--primary)' : '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Moon size={24} color={localSettings.darkMode ? 'var(--primary)' : 'var(--slate-400)'} />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Dark Mode</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Ramah mata di malam hari</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="primary" onClick={handleSaveSettings}>
                                    <Save size={18} /> Simpan Preferensi
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default SettingsView;
