## Analisis Kebutuhan & Sistem E-Procurement + Inventory Management

Dokumen ini adalah rencana implementasi (Implementation Plan) untuk melakukan analisis lengkap sistem E-Procurement dan Warehouse Inventory berbasis Web sesuai permintaan Anda.

### User Review Required
> [!IMPORTANT]
> **Format File `.drawio` vs "Code to Diagram"**
> Anda meminta file ber-ekstensi `.drawio` yang "rapih tidak tumpang tindih" dan menggunakan pendekatan "code to diagram". 
> Membuat file `.drawio` murni secara otomatis (lewat kode XML) seringkali membuat tata letak (layout) saling tumpang tindih karena tidak ada *auto-layout engine* bawaan saat di-generate murni dari teks. 
>
> **Solusi Terbaik yang Saya Usulkan**: Saya akan menuliskan kode **Mermaid.js / PlantUML** (ini adalah standar industri untuk *Code to Diagram*). Anda cukup meng-copy kode tersebut, lalu di Draw.io pilih menu **Arrange -> Insert -> Advanced -> Mermaid/PlantUML**. Draw.io akan secara otomatis membuatkan diagramnya dalam format `.drawio` yang **sangat rapi, terstruktur, dan tidak tumpang tindih**.
> 
> *Apakah Anda setuju dengan pendekatan ini? (Saya tetap akan menyimpannya dalam folder terpisah dengan instruksi yang jelas).*

### 1. Hasil Riset & Studi Literatur (Referensi Industri)
Sebagai referensi pengembangan (best practices), sistem yang terintegrasi antara pengadaan (Procurement) dan gudang (Inventory) sangat penting untuk menghindari *stockout* dan *overstock*. Beberapa studi kasus dan perangkat lunak nyata di industri:
- **Odoo ERP / HashMicro**: Banyak digunakan oleh perusahaan manufaktur dan distribusi (misal: PT Shuangfei Electric Systems) untuk mengotomatisasi *Purchase Requisition* (PR) yang langsung terhubung dengan *Warehouse Management System* (WMS).
- **SAP Ariba**: Digunakan oleh perusahaan enterprise seperti Unilever untuk visibilitas pengeluaran global dan integrasi rantai pasokan.
- **Konsep Utama**: *Automated Replenishment* (otomatisasi order saat stok menipis), *Real-Time Visibility*, dan *3-Way Matching* (Pencocokan antara PO, Surat Jalan/Receipt, dan Invoice).

### 2. Pembagian Modul Sistem
Sistem akan dibagi menjadi 4 *Role* (Aktor) utama:
1. **Warehouse Staff** (Staf Gudang)
2. **Purchasing / Procurement** (Staf Pengadaan)
3. **Manager / Finance** (Pemberi Persetujuan / Keuangan)
4. **Admin** (Kelola Sistem)

### 3. Rencana Pembuatan Diagram
Saya akan membuat modul-modul berikut (semuanya menggunakan pendekatan *Code to Diagram* agar rapi):

#### Modul 1: Flowchart (Alur Keseluruhan & Per Role)
- **Flowchart Keseluruhan**: Mulai dari Login -> Cek Stok -> Permintaan Pembelian (PR) -> Pemesanan (PO) -> Penerimaan Barang -> Update Inventaris.
- **Flowchart per Role**: Alur kerja spesifik untuk Warehouse, Purchasing, dan Manager.

#### Modul 2: UML (4 Pilar Utama)
- **Use Case Diagram**: Memetakan interaksi 4 aktor di atas terhadap sistem (Login, Kelola Stok, Buat PR, Approve PO, dsb).
- **Activity Diagram**: Memecah aktivitas spesifik (contoh: Sub-modul Activity Diagram Penerimaan Barang & Sub-modul Pembuatan Purchase Order).
- **Class Diagram**: Struktur database/objek web (User, Product, Inventory, PurchaseRequisition, PurchaseOrder, Vendor).
- **Sequence Diagram**: Alur pesan (*message passing*) di belakang layar saat sebuah proses dieksekusi (contoh: Sequence Diagram saat Warehouse Staff mengajukan permintaan barang ke Purchasing).

### 4. Verification Plan
- Anda memvalidasi kelengkapan diagram.
- Anda mencoba memasukkan *Code to Diagram* ke Draw.io untuk memastikan hasilnya rapi dan sesuai ekspektasi.

---
**Silakan tekan tombol "Proceed" atau balas dengan persetujuan Anda agar saya dapat mulai mem-generate semua diagramnya!**
