# Studi Literatur & Referensi Sistem Industri
## Tujuan
Pedoman dalam merancang sistem E-Procurement dan Warehouse Inventory.

## Referensi Produk Industri Terkemuka
1. **SAP Ariba & SAP EWM (Extended Warehouse Management)**
   - **Fokus**: Enterprise scale, 3-way matching otomatis, real-time global inventory.
   - **Studi Kasus**: Perusahaan FMCG seperti Unilever menggunakan integrasi pengadaan dan gudang untuk mengurangi stockout hingga 20% dan menekan biaya administrasi.
2. **Odoo ERP (Modul Inventory & Purchase)**
   - **Fokus**: Modular, open-source, cocok untuk menengah ke atas.
   - **Studi Kasus**: Perusahaan distribusi lokal banyak menggunakan fitur *Automated Replenishment* Odoo di mana sistem otomatis membuat Purchase Quotation ke vendor saat stok gudang menyentuh batas minimum.
3. **HashMicro (Singapore/Indonesia)**
   - **Fokus**: Solusi ERP terlokalisasi dengan fitur Procurement & Inventory Management yang kuat.
   - **Penerapan**: Fitur barcode scanning saat Goods Receipt, langsung terhubung ke jurnal akuntansi/finance.

## Kesimpulan Analisa untuk Sistem Kita:
Berdasarkan riset, sistem kita *wajib* memiliki:
- **Automasi Re-order Point (PR Otomatis)** saat stok gudang rendah.
- **Pemisahan Otoritas (Segregation of Duties)**: Gudang meminta (PR) & menerima (GR), Purchasing membeli (PO), Finance membayar & menyetujui.
- **3-Way Matching**: Syarat mutlak sebelum Finance memproses pembayaran adalah mencocokkan PO, Penerimaan Barang (GR), dan Invoice.
