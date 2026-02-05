# ERP DISTRIBUSI

Sistem ERP modern untuk manajemen distribusi, konsinyasi, stok, penjualan, dan laporan keuangan.

## 🚀 Tech Stack

- **Frontend**: React 18+ dengan Vite
- **State Management**: Context API + LocalStorage
- **Styling**: CSS Vanilla dengan premium design system
- **Icons**: Lucide React
- **Future**: Siap untuk integrasi Supabase

## ✨ Fitur

### 1. Dashboard
- Kartu statistik (Pendapatan, Piutang, Distribusi Aktif, Stok Menipis)
- Grafik penjualan mitra tertinggi
- Feed aktivitas terkini

### 2. Manajemen Produk (Stok)
- Daftar produk di gudang pusat
- Tambah produk baru
- Indikator stok menipis

### 3. Manajemen Mitra
- Daftar mitra konsinyasi
- Tambah/Edit data mitra
- Cek inventory di mitra
- Catat pembayaran piutang

### 4. Distribusi
- Kirim barang ke mitra
- Tracking status pengiriman
- Tandai sebagai terkirim
- Auto-update inventory mitra

### 5. Penjualan
- Input penjualan (dari gudang/dari mitra)
- Cetak invoice penjualan
- Riwayat transaksi lengkap
- Auto-calculate piutang

### 6. Retur Barang
- Input retur dari mitra
- Cetak bukti retur
- Auto-return stok ke gudang
- Auto-adjust piutang

### 7. Laporan
- Konsolidasi semua transaksi
- Filter by type (Penjualan, Distribusi, Pembayaran, Retur)
- Timeline activities

## 📦 Setup & Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Login Demo

- Username: `admin` atau `staf`
- Password: (apa saja)

## 📁 Struktur Project

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── layout/          # Sidebar, Header
│   └── views/           # Page components
├── contexts/            # Context API (state management)
├── utils/               # Utilities (storage, formatters, print)
├── styles/              # CSS design system
├── App.jsx
└── main.jsx
```

## 🎨 Design System

- **Primary Color**: Amber (#F59E0B)
- **Typography**: Inter font
- **Components**: Premium with gradients & glassmorphism
- **Animations**: Smooth transitions
- **Responsive**: Mobile-friendly

## 💾 Data Persistence

Saat ini menggunakan **LocalStorage** untuk menyimpan data:
- Products
- Partners
- Distributions
- Sales
- Returns
- Payments

**Data structure sudah siap untuk migrasi ke Supabase!**

## 🔄 Migrasi ke Supabase (Future)

File `src/utils/storage.js` sudah disiapkan dengan interface yang mudah diubah ke Supabase client. Yang perlu dilakukan:

1. Install Supabase client
2. Setup Supabase project & tables
3. Replace `saveToStorage` & `loadFromStorage` dengan Supabase queries
4. Update `AppContext.jsx` untuk realtime subscriptions

## 📸 Screenshots

(Add screenshots here)

## 🤝 Contributing

Untuk development lebih lanjut:
1. Feature requests bisa ditambahkan di `task.md`
2. Following the existing code structure
3. Keep premium design consistency

## 📝 License

MIT License

---

**Built with ❤️ using Vite + React**
