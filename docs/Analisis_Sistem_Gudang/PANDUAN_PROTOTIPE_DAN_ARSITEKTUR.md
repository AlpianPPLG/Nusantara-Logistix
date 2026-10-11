# Dokumentasi Arsitektur & Realisasi Prototipe Sistem Gudang & E-Procurement

Dokumen ini melengkapi analisis kebutuhan dan diagram pada folder `modul_flowchart/` dan `modul_uml/`, serta menjelaskan bagaimana spesifikasi UML diimplementasikan ke dalam kode prototipe berbasis **SvelteKit (Svelte 5 Runes) + Drizzle ORM + SQLite**.

---

## 1. Pemetaan Diagram UML ke Arsitektur Kode

### A. Class Diagram $\leftrightarrow$ Drizzle Schema (`src/lib/server/db/schema.ts`)
| Entitas di Class Diagram | Tabel Drizzle ORM | Keterangan Relasi |
| :--- | :--- | :--- |
| `User` | `users` | Role: `admin`, `warehouse`, `purchasing`, `finance` |
| `Product` | `products` | Memiliki SKU, Kategori, Harga Satuan, dan Foto |
| `Inventory` | `inventory` | Lokasi Rak Gudang, Stok Aktual, Minimum Buffer, Reorder Point |
| `Vendor` | `vendors` | Rekanan pengadaan, Rating 1-5, Termin Pembayaran |
| `PurchaseRequisition` | `purchase_requisitions` & `_items` | Pengajuan permintaan barang dari staf gudang |
| `PurchaseOrder` | `purchase_orders` & `_items` | Surat pesanan resmi ke vendor (Subtotal + PPN 11%) |
| `GoodsReceipt` | `goods_receipts` & `_items` | Surat tanda penerimaan fisik barang berdasarkan Surat Jalan |
| *(Pilar Tambahan)* | `invoices` | Entitas verifikasi **3-Way Matching Engine** |
| *(Ledger Tambahan)* | `stock_movements` | Catatan audit trail mutasi stok IN / OUT / RECEIPT |

---

## 2. Alur Transaksi & Pembagian Modul Prototipe

Prototipe ini diorganisasikan secara modular tanpa *spaghetti code*:

1. **Dashboard Eksekutif (`src/routes/+page.svelte`)**
   - Ringkasan KPI: Nilai total aset stok, jumlah item kritis/habis, PO pending approval, dan persentase kesesuaian 3-Way Match.
   - Live audit trail mutasi fisik stok barang.

2. **Modul Gudang & Inventaris (`src/routes/inventory/`)**
   - Pencarian cerdas berdasarkan SKU, nama barang, dan lokasi rak.
   - Filter kondisi stok (*Semua, Kritis / Low Stock, Aman*).
   - Form penyesuaian stok manual (Stok Masuk, Stok Keluar, Koreksi Opname).
   - Form penambahan master barang baru.

3. **Modul Permintaan Barang / PR (`src/routes/procurement/requisitions/`)**
   - Input pengajuan PR oleh tim gudang dengan status urgensi (*Critical, High, Medium, Normal*).
   - Fitur konversi PR langsung menjadi PO resmi dengan pemilihan vendor rekanan.

4. **Modul Pesanan Pembelian / PO (`src/routes/procurement/orders/`)**
   - Workflow persetujuan (*Approval Workflow*) oleh Finance Manager.
   - Penghitungan otomatis Subtotal, PPN 11%, dan Grand Total.
   - Pelacakan status: `PENDING_APPROVAL` $\rightarrow$ `APPROVED` $\rightarrow$ `SENT` $\rightarrow$ `COMPLETED`.

5. **Modul Penerimaan Barang / Goods Receipt (`src/routes/warehouse/receipts/`)**
   - Validasi fisik kiriman vendor berdasarkan Nomor Surat Jalan (*Delivery Note*).
   - **Efek Otomatis**: Seketika meng-update saldo stok barang di tabel `inventory` dan mencatat mutasi di `stock_movements`.

6. **Modul Keuangan & Audit 3-Way Matching (`src/routes/finance/3-way-match/`)**
   - Tampilan visual perbandingan 3 pilar: **PO** vs **Goods Receipt** vs **Faktur Tagihan**.
   - Penilaian skor kecocokan (100% Cocok $\rightarrow$ Disetujui Bayar).

---

## 3. Fitur Quick Role Switcher (Pengujian Praktis)

Pada bagian atas navigasi (*Header*), tersedia tombol pemilih persona:
- **Warehouse Staff** (*Rian Pratama*)
- **Purchasing Specialist** (*Maya Indah*)
- **Finance Manager** (*Hendra Gunawan, S.E.*)
- **Super Administrator** (*Budi Santoso*)

Hal ini mempermudah demonstrasi aplikasi kepada dosen/penguji tanpa perlu melakukan *login-logout* berulang kali.

---

## 4. Perintah Operasional Prototipe

```bash
# Menjalankan server pengembangan
npm run dev

# Menjalankan seeder data transaksi awal
npm run db:seed

# Pengecekan tipe data TypeScript & Svelte Runes
npm run check

# Kompilasi build produksi
npm run build
```
