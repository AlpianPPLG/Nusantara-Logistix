# Nusantara Logistix — Sistem Manajemen Inventaris Gudang & E-Procurement Terpadu (3-Way Matching)

> **Prototipe Enterprise Modern 2026** yang dibangun dengan performa tinggi, modular, dan arsitektur data persisten dinamis.

---

## ⚡ Mengapa Tech Stack Trend 2026?

Berdasarkan hasil analisis dan riset terkini, ekosistem web modern mengalami pergeseran dari framework monolithic yang berat (seperti Next.js App Router dengan kompleksitas React Server Components dan cold-start lambat) menuju kombinasi yang jauh lebih **ramping, kencang, dan ergonomis**:

| Komponen | Pilihan Teknologi 2026 | Alasan & Keunggulan |
| :--- | :--- | :--- |
| **Framework & Reactivity** | **SvelteKit + Svelte 5 (Runes)** | Menggunakan kompilasi tanpa Virtual DOM dengan Runes (`$state`, `$derived`, `$props`). Ukuran bundle JS sangat kecil (< 30% dari React bundle) dan hot-reload instan via Vite. |
| **Database & ORM** | **Drizzle ORM + LibSQL / SQLite** | Type-safe SQL query builder tanpa binary engine berat Prisma. Database file lokal (`local.db`) membuat prototipe **bersifat dinamis**, menyimpan transaksi nyata, tanpa membebani komputer penguji dengan server DB eksternal. |
| **Styling & Design System** | **Tailwind CSS v4 + Bits UI** | Engine kompilasi CSS terbaru dengan palet enterprise dark-mode glassmorphism dan tipografi modern *Plus Jakarta Sans*. |
| **Iconography** | **@lucide/svelte** | Pustaka ikon resmi terlengkap untuk indikator pergudangan, logistik, dan keuangan. |

---

## 🏢 4 Pilar Role & Hak Akses (Multi-Role Persona)

Sistem dirancang mencakup 4 divisi utama sesuai dokumen analisis:

1. 📦 **Warehouse Staff (Rian Pratama)**
   - Monitoring stok buffer, lokasi rak (*Zone A, Zone B, Mezzanine*), dan peringatan *Safety Stock*.
   - Menerbitkan **Purchase Requisition (PR)** saat stok melewati *Reorder Point*.
   - Menerima kiriman barang fisik dan menerbitkan **Goods Receipt (GR)** berdasarkan Surat Jalan.
   - **Otomasi**: Saldo stok bertambah secara otomatis begitu GR diverifikasi, tercatat pada ledger *Stock Movements*.

2. 🛒 **Purchasing / Procurement (Maya Indah)**
   - Meninjau pengajuan PR dari tim gudang.
   - Evaluasi vendor rekanan (rating SLA, termin pembayaran Net 14/30/45).
   - Mengonversi PR menjadi **Purchase Order (PO)** resmi (perhitungan otomatis PPN 11%).
   - Meneruskan PO ke Finance Manager untuk otorisasi belanja.

3. 💳 **Finance & Accounting Manager (Hendra Gunawan, S.E.)**
   - Menyetujui (*Approve*) atau Menolak (*Reject*) anggaran Purchase Order.
   - Menjalankan **3-Way Matching Engine**:
     $$\text{Purchase Order (PO)} \quad \longleftrightarrow \quad \text{Goods Receipt (GR)} \quad \longleftrightarrow \quad \text{Vendor Invoice}$$
   - Mencegah fraud dan overpayment; otorisasi pembayaran setelah pencocokan 100% valid.

4. ⚡ **Super Administrator (Budi Santoso)**
   - Manajemen master data pengguna, produk, kategori, dan vendor.
   - Fitur **1-Click Reset Demo Database** untuk mengembalikan data pengujian ke kondisi default kapan saja.

---

## 🔄 Alur Transaksi Lengkap (End-to-End Lifecycle)

```
[Stok Gudang Menipis] 
        ↓ (Alert Otomatis)
[Warehouse Staff: Buat Purchase Requisition (PR)]
        ↓
[Purchasing: Review PR & Konversi ke Purchase Order (PO)]
        ↓
[Finance Manager: Review Anggaran & Approve PO]
        ↓
[Kirim PO Resmi ke Vendor Rekanan]
        ↓
[Vendor Kirim Barang + Surat Jalan]
        ↓
[Warehouse Staff: Input Goods Receipt (GR)] ──→ [STOK GUDANG OTOMATIS BERTAMBAH]
        ↓
[Finance: Eksekusi 3-Way Match (PO vs GR vs Faktur)]
        ↓
[Pencocokan 100% Valid ──→ Otorisasi Bayar & Selesai]
```

---

## 🚀 Panduan Menjalankan Prototipe

### 1. Prasyarat
- Node.js versi 20+ atau 24+

### 2. Instalasi Dependensi (Jika belum)
```bash
npm install
```

### 3. Migrasi Skema Database & Seeding Data Awal
Proyek ini menggunakan SQLite embedded (`local.db`) yang telah terisi data transaksi realistis industri manufaktur & logistik Indonesia:
```bash
npm run db:push
npm run db:seed
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat: **`http://localhost:5173`**

### 5. Memeriksa Tipe TypeScript & Build Produksi
```bash
npm run check
npm run build
```

---

## 🎯 Panduan Skenario Pengujian / Demo (Untuk Evaluator / Dosen)

Prototipe ini dilengkapi **Quick Role Switcher** interaktif di bagian navigasi atas (*Header*), memungkinkan penguji berpindah sudut pandang secara instan:

1. **Skenario 1 — Deteksi Stok Kritis & Buat PR**:
   - Di Header, klik role **Warehouse Staff**.
   - Buka menu **Executive Dashboard** atau **Katalog & Stok Gudang**.
   - Perhatikan item berstatus *Stok Kritis / Low* (contoh: *Optical Proximity Sensor M18* atau *Synthetic Hydraulic Oil*).
   - Klik **Ajukan PR Baru**, pilih barang dan jumlah, lalu kirim.

2. **Skenario 2 — Konversi PR ke PO**:
   - Ganti role ke **Purchasing**.
   - Masuk ke menu **Permintaan Barang (PR)**.
   - Pada PR yang berstatus *PENDING*, klik tombol **Konversi ke PO**.
   - Pilih vendor rekanan (misal: *PT Mitra Elektrindo Jaya*). PO baru otomatis diterbitkan berstatus *PENDING_APPROVAL*.

3. **Skenario 3 — Otorisasi & Approval PO**:
   - Ganti role ke **Finance Manager**.
   - Masuk ke menu **Pesanan Pembelian (PO)**.
   - Tinjau rincian biaya (Subtotal + PPN 11% = Grand Total). Klik **Setujui PO (Finance Approval)**.

4. **Skenario 4 — Penerimaan Barang (Goods Receipt) & Bukti Stok Otomatis**:
   - Ganti role kembali ke **Warehouse Staff**.
   - Buka menu **Penerimaan (Goods Receipt)**.
   - Pada bagian *Pesanan Masuk Siap Diterima*, klik **Input Penerimaan (GR)**.
   - Masukkan Nomor Surat Jalan vendor (misal: `SJ-2026/MEJ/X/8812`) dan klik **Verifikasi & Tambah Stok**.
   - Buka menu **Katalog & Stok Gudang** $\rightarrow$ Anda akan melihat saldo stok barang tersebut **bertambah seketika** dan riwayat mutasi tercatat di ledger!

5. **Skenario 5 — Rekonsiliasi 3-Way Match & Pencairan Dana**:
   - Ganti role ke **Finance Manager**.
   - Buka menu **3-Way Matching Engine**.
   - Bandingkan kesesuaian ketiga pilar (PO $\leftrightarrow$ GR Surat Jalan $\leftrightarrow$ Faktur).
   - Klik tombol **Verifikasi Match** atau **Proses Pembayaran (Pay)**.

6. **Reset Kapan Saja**:
   - Di pojok kanan atas Header, klik tombol **Reset Demo** untuk mengembalikan seluruh database ke kondisi default awal dalam 1 detik.

---

## 📂 Struktur Direktori Proyek

```
inventori/
├── docs/                                  # Dokumen analisis, flowchart, dan UML
│   └── Analisis_Sistem_Gudang/
│       ├── modul_flowchart/               # Flowchart per role & sistem
│       └── modul_uml/                     # Use Case, Activity, Class, Sequence
├── src/
│   ├── app.html                           # Shell HTML + Google Fonts Plus Jakarta Sans
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/                    # Header (Role Switcher), Sidebar
│   │   │   └── ui/                        # StatCard, Badge, Modal, dsb.
│   │   ├── server/db/
│   │   │   ├── index.ts                   # Inisialisasi LibSQL client & Drizzle
│   │   │   ├── schema.ts                  # Skema database relasional lengkap
│   │   │   └── seed.ts                    # Seeder data transaksi realistis
│   │   ├── stores/
│   │   │   └── role.svelte.ts             # State reaktif persona multi-role (Svelte 5)
│   │   ├── types/                         # Definisi TypeScript domain entities
│   │   └── utils/
│   │       └── format.ts                  # Formatter Rupiah, Tanggal, & Badge
│   └── routes/
│       ├── +layout.svelte                 # Layout global responsif
│       ├── +page.svelte                   # Executive Dashboard terpadu
│       ├── inventory/                     # Manajemen katalog & mutasi stok
│       ├── procurement/
│       │   ├── requisitions/              # Modul Purchase Requisition (PR)
│       │   └── orders/                    # Modul Purchase Order (PO) & Approval
│       ├── warehouse/
│       │   └── receipts/                  # Modul Goods Receipt (Surat Jalan & Tambah Stok)
│       ├── finance/
│       │   └── 3-way-match/               # Modul 3-Way Matching Engine
│       ├── vendors/                       # Direktori vendor & evaluasi SLA
│       ├── workflow-docs/                 # Halaman interaktif arsitektur & UML
│       └── api/reset-db/                  # Endpoint reset demo database
├── drizzle.config.ts                      # Konfigurasi Drizzle ORM
├── package.json                           # Konfigurasi script & dependensi
└── vite.config.ts                         # Konfigurasi Vite & Tailwind v4
```

---
*Dibuat untuk memenuhi standar prototype enterprise sistem logistik & e-procurement generasi 2026.*
