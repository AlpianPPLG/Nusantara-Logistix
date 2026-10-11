import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({ url: process.env.DATABASE_URL || 'file:local.db' });
const db = drizzle(client, { schema });

export async function runSeed() {
	console.log('🌱 Starting Warehouse & E-Procurement database seeding...');

	// Clear existing data (in dependency order)
	await db.delete(schema.invoices);
	await db.delete(schema.goodsReceiptItems);
	await db.delete(schema.goodsReceipts);
	await db.delete(schema.purchaseOrderItems);
	await db.delete(schema.purchaseOrders);
	await db.delete(schema.purchaseRequisitionItems);
	await db.delete(schema.purchaseRequisitions);
	await db.delete(schema.stockMovements);
	await db.delete(schema.inventory);
	await db.delete(schema.products);
	await db.delete(schema.categories);
	await db.delete(schema.vendors);
	await db.delete(schema.users);

	// 1. Seed Users (4 System Roles)
	const userAdmin = {
		id: 'usr-admin-01',
		username: 'admin',
		name: 'Budi Santoso',
		email: 'budi.santoso@sentosalogistik.co.id',
		role: 'admin' as const,
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
		lastLogin: new Date().toISOString(),
		createdAt: new Date().toISOString()
	};

	const userWarehouse = {
		id: 'usr-wh-01',
		username: 'warehouse',
		name: 'Rian Pratama',
		email: 'rian.pratama@sentosalogistik.co.id',
		role: 'warehouse' as const,
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
		lastLogin: new Date().toISOString(),
		createdAt: new Date().toISOString()
	};

	const userPurchasing = {
		id: 'usr-purch-01',
		username: 'purchasing',
		name: 'Maya Indah',
		email: 'maya.indah@sentosalogistik.co.id',
		role: 'purchasing' as const,
		avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
		lastLogin: new Date().toISOString(),
		createdAt: new Date().toISOString()
	};

	const userFinance = {
		id: 'usr-fin-01',
		username: 'finance',
		name: 'Hendra Gunawan, S.E.',
		email: 'hendra.gunawan@sentosalogistik.co.id',
		role: 'finance' as const,
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
		lastLogin: new Date().toISOString(),
		createdAt: new Date().toISOString()
	};

	await db.insert(schema.users).values([userAdmin, userWarehouse, userPurchasing, userFinance]);
	console.log('✅ Users seeded');

	// 2. Seed Categories
	const catElec = {
		id: 'cat-01',
		code: 'CAT-ELEC',
		name: 'Elektronik & Kelistrikan',
		description: 'Sensor industri, inverter, micro-controller, dan kabel kontrol'
	};
	const catRaw = {
		id: 'cat-02',
		code: 'CAT-RAW',
		name: 'Bahan Baku & Material',
		description: 'Aluminium sheet, plat baja, resin industri, dan pelumas sintesis'
	};
	const catPack = {
		id: 'cat-03',
		code: 'CAT-PACK',
		name: 'Packaging & Kemasan',
		description: 'Kardus corrugated, bubble wrap industri, stretch film, dan label barcode'
	};
	const catTool = {
		id: 'cat-04',
		code: 'CAT-TOOL',
		name: 'Perkakas & APD Gudang',
		description: 'Safety shoes, pallet jack parts, barcode scanner genggam, dan helm K3'
	};

	await db.insert(schema.categories).values([catElec, catRaw, catPack, catTool]);
	console.log('✅ Categories seeded');

	// 3. Seed Vendors
	const vendor1 = {
		id: 'vnd-01',
		code: 'VND-001',
		companyName: 'PT Mitra Elektrindo Jaya',
		contactName: 'Irwan Setiadi',
		contactEmail: 'sales@mitraelektrindo.co.id',
		contactPhone: '+62 21 8892 1092',
		address: 'Kawasan Industri Pulogadung Blok B No. 12, Jakarta Timur',
		rating: 4.8,
		status: 'active' as const,
		paymentTerms: 'Net 30'
	};

	const vendor2 = {
		id: 'vnd-02',
		code: 'VND-002',
		companyName: 'CV Cipta Kemasan Perkasa',
		contactName: 'Siti Rahmawati',
		contactEmail: 'order@ciptakemasan.com',
		contactPhone: '+62 21 5590 4421',
		address: 'Jl. Raya Daan Mogot KM 19, Batuceper, Tangerang',
		rating: 4.6,
		status: 'active' as const,
		paymentTerms: 'Net 14'
	};

	const vendor3 = {
		id: 'vnd-03',
		code: 'VND-003',
		companyName: 'PT Logam Baja Nusantara',
		contactName: 'Hartono Wijaya',
		contactEmail: 'sales@bajanusantara.co.id',
		contactPhone: '+62 31 7721 9900',
		address: 'Kawasan Industri SIER, Rungkut, Surabaya',
		rating: 4.9,
		status: 'active' as const,
		paymentTerms: 'Net 45'
	};

	const vendor4 = {
		id: 'vnd-04',
		code: 'VND-004',
		companyName: 'PT Sentosa Safety & Hardware',
		contactName: 'Agus Salim',
		contactEmail: 'support@sentosasafety.id',
		contactPhone: '+62 21 8983 2341',
		address: 'Kawasan Industri MM2100, Cikarang Barat, Bekasi',
		rating: 4.4,
		status: 'active' as const,
		paymentTerms: 'Net 30'
	};

	await db.insert(schema.vendors).values([vendor1, vendor2, vendor3, vendor4]);
	console.log('✅ Vendors seeded');

	// 4. Seed Products
	const prod1 = {
		id: 'prd-01',
		skuCode: 'ELC-SEN-001',
		name: 'Optical Proximity Sensor M18 NPN',
		categoryId: catElec.id,
		unit: 'PCS',
		unitPrice: 385000,
		description: 'Sensor jarak optik industri tahan air IP67 dengan deteksi hingga 50cm',
		imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300',
		createdAt: new Date().toISOString()
	};

	const prod2 = {
		id: 'prd-02',
		skuCode: 'ELC-INV-002',
		name: 'Variable Frequency Inverter 3-Phase 2.2kW',
		categoryId: catElec.id,
		unit: 'UNIT',
		unitPrice: 2450000,
		description: 'Pengatur kecepatan motor dinamo conveyor dengan proteksi overload',
		imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300',
		createdAt: new Date().toISOString()
	};

	const prod3 = {
		id: 'prd-03',
		skuCode: 'RAW-ALU-001',
		name: 'Aluminium Plate Sheet 5052 (3mm x 1200 x 2400)',
		categoryId: catRaw.id,
		unit: 'LEMBAR',
		unitPrice: 890000,
		description: 'Lembaran plat aluminium paduan anti-korosi kualitas maritim dan manufaktur',
		imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300',
		createdAt: new Date().toISOString()
	};

	const prod4 = {
		id: 'prd-04',
		skuCode: 'RAW-OIL-002',
		name: 'Synthetic Hydraulic Oil ISO VG 46 (Drum 200L)',
		categoryId: catRaw.id,
		unit: 'DRUM',
		unitPrice: 5750000,
		description: 'Pelumas hidrolik forklift dan mesin cetak tahan suhu tinggi',
		imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=300',
		createdAt: new Date().toISOString()
	};

	const prod5 = {
		id: 'prd-05',
		skuCode: 'PCK-BOX-001',
		name: 'Heavy Duty Corrugated Carton Box (60x40x40 cm)',
		categoryId: catPack.id,
		unit: 'PCS',
		unitPrice: 18500,
		description: 'Kardus double wall tebal untuk proteksi pengiriman kargo berat',
		imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300',
		createdAt: new Date().toISOString()
	};

	const prod6 = {
		id: 'prd-06',
		skuCode: 'PCK-STR-002',
		name: 'Industrial Stretch Film 50cm x 300m (17 Micron)',
		categoryId: catPack.id,
		unit: 'ROLL',
		unitPrice: 72000,
		description: 'Plastik wrapping pembungkus palet barang anti debu dan kelembapan',
		imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300',
		createdAt: new Date().toISOString()
	};

	const prod7 = {
		id: 'prd-07',
		skuCode: 'TOL-SCN-001',
		name: 'Wireless 2D Barcode Scanner Handheld',
		categoryId: catTool.id,
		unit: 'UNIT',
		unitPrice: 850000,
		description: 'Pemindai barcode QR & Code 128 nirkabel dengan jangkauan 50 meter',
		imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300',
		createdAt: new Date().toISOString()
	};

	const prod8 = {
		id: 'prd-08',
		skuCode: 'TOL-SHS-002',
		name: 'Safety Steel-Toe Leather Boots (Size 42)',
		categoryId: catTool.id,
		unit: 'PASANG',
		unitPrice: 320000,
		description: 'Sepatu keselamatan kerja ujung besi standar SNI tahan benturan 200J',
		imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
		createdAt: new Date().toISOString()
	};

	await db.insert(schema.products).values([prod1, prod2, prod3, prod4, prod5, prod6, prod7, prod8]);
	console.log('✅ Products seeded');

	// 5. Seed Inventory
	// Note: prod1 is LOW STOCK (currentQuantity: 8, min: 15) -> Triggers alert!
	// prod4 is CRITICAL STOCK (currentQuantity: 1, min: 3) -> Triggers alert!
	const inv1 = {
		id: 'inv-01',
		productId: prod1.id,
		warehouseLocation: 'Zone A - Rack 01 (Elektronik)',
		currentQuantity: 8, // Low Stock Alert!
		minimumStock: 15,
		maximumStock: 100,
		reorderPoint: 20,
		lastAuditDate: '2026-10-01'
	};

	const inv2 = {
		id: 'inv-02',
		productId: prod2.id,
		warehouseLocation: 'Zone A - Rack 03 (Elektronik)',
		currentQuantity: 14,
		minimumStock: 5,
		maximumStock: 30,
		reorderPoint: 8,
		lastAuditDate: '2026-10-01'
	};

	const inv3 = {
		id: 'inv-03',
		productId: prod3.id,
		warehouseLocation: 'Zone B - Pallet Bay 04 (Logam)',
		currentQuantity: 42,
		minimumStock: 20,
		maximumStock: 150,
		reorderPoint: 30,
		lastAuditDate: '2026-09-28'
	};

	const inv4 = {
		id: 'inv-04',
		productId: prod4.id,
		warehouseLocation: 'Zone B - Flammable Storage Room',
		currentQuantity: 1, // Critical Low Stock!
		minimumStock: 3,
		maximumStock: 15,
		reorderPoint: 4,
		lastAuditDate: '2026-10-05'
	};

	const inv5 = {
		id: 'inv-05',
		productId: prod5.id,
		warehouseLocation: 'Zone C - Mezzanine Rack 10',
		currentQuantity: 450,
		minimumStock: 100,
		maximumStock: 1000,
		reorderPoint: 200,
		lastAuditDate: '2026-10-08'
	};

	const inv6 = {
		id: 'inv-06',
		productId: prod6.id,
		warehouseLocation: 'Zone C - Mezzanine Rack 12',
		currentQuantity: 85,
		minimumStock: 30,
		maximumStock: 250,
		reorderPoint: 50,
		lastAuditDate: '2026-10-08'
	};

	const inv7 = {
		id: 'inv-07',
		productId: prod7.id,
		warehouseLocation: 'Zone D - Tools Cabinet 02',
		currentQuantity: 12,
		minimumStock: 4,
		maximumStock: 25,
		reorderPoint: 6,
		lastAuditDate: '2026-09-15'
	};

	const inv8 = {
		id: 'inv-08',
		productId: prod8.id,
		warehouseLocation: 'Zone D - APD Locker 01',
		currentQuantity: 24,
		minimumStock: 10,
		maximumStock: 60,
		reorderPoint: 15,
		lastAuditDate: '2026-09-15'
	};

	await db.insert(schema.inventory).values([inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8]);
	console.log('✅ Inventory seeded');

	// 6. Seed Stock Movement Ledger
	const mov1 = {
		id: 'mov-01',
		inventoryId: inv1.id,
		type: 'OUT' as const,
		quantity: 7,
		previousQuantity: 15,
		newQuantity: 8,
		referenceType: 'DISPATCH' as const,
		referenceId: 'REQ-LINE-PROD-401',
		notes: 'Pengambilan sensor untuk jalur perakitan conveyor line 2',
		performedBy: userWarehouse.name,
		createdAt: '2026-10-09T08:30:00Z'
	};

	const mov2 = {
		id: 'mov-02',
		inventoryId: inv4.id,
		type: 'OUT' as const,
		quantity: 2,
		previousQuantity: 3,
		newQuantity: 1,
		referenceType: 'DISPATCH' as const,
		referenceId: 'MAINT-HYD-092',
		notes: 'Maintenance berkala oli hidrolik forklift unit 3 & 4',
		performedBy: userWarehouse.name,
		createdAt: '2026-10-10T14:15:00Z'
	};

	const mov3 = {
		id: 'mov-03',
		inventoryId: inv5.id,
		type: 'IN' as const,
		quantity: 200,
		previousQuantity: 250,
		newQuantity: 450,
		referenceType: 'PURCHASE_RECEIPT' as const,
		referenceId: 'GR-2026-0001',
		notes: 'Penerimaan restock karton box dari CV Cipta Kemasan',
		performedBy: userWarehouse.name,
		createdAt: '2026-10-08T11:00:00Z'
	};

	await db.insert(schema.stockMovements).values([mov1, mov2, mov3]);
	console.log('✅ Stock Movements seeded');

	// 7. Seed Purchase Requisition (PR)
	// PR 1: PENDING - Diajukan Warehouse Staff karena sensor & oli menipis
	const pr1 = {
		id: 'pr-01',
		prNumber: 'PR-2026-0001',
		requestedBy: userWarehouse.id,
		department: 'Warehouse & Logistics',
		status: 'PENDING' as const,
		priority: 'HIGH' as const,
		totalEstimatedAmount: 23150000,
		notes: 'Restock mendesak: Stok sensor proximity (tersisa 8 pcs) dan drum oli hidrolik (tersisa 1 drum).',
		createdAt: '2026-10-10T15:00:00Z',
		updatedAt: '2026-10-10T15:00:00Z'
	};

	// PR 2: CONVERTED - Sudah dijadikan Purchase Order (PO-2026-0001)
	const pr2 = {
		id: 'pr-02',
		prNumber: 'PR-2026-0002',
		requestedBy: userWarehouse.id,
		department: 'Warehouse & Logistics',
		status: 'CONVERTED' as const,
		priority: 'NORMAL' as any,
		totalEstimatedAmount: 35600000,
		notes: 'Kebutuhan pengadaan plat aluminium untuk project chassis Q4.',
		createdAt: '2026-10-05T09:30:00Z',
		updatedAt: '2026-10-06T10:00:00Z'
	};

	await db.insert(schema.purchaseRequisitions).values([pr1, pr2]);

	// PR Items
	await db.insert(schema.purchaseRequisitionItems).values([
		{
			id: 'pri-01',
			prId: pr1.id,
			productId: prod1.id,
			requestedQty: 15,
			estimatedUnitPrice: 385000,
			remarks: 'Kebutuhan buffer stock perakitan'
		},
		{
			id: 'pri-02',
			prId: pr1.id,
			productId: prod4.id,
			requestedQty: 3,
			estimatedUnitPrice: 5750000,
			remarks: 'Sisa di gudang tinggal 1 drum, butuh cepat'
		},
		{
			id: 'pri-03',
			prId: pr2.id,
			productId: prod3.id,
			requestedQty: 40,
			estimatedUnitPrice: 890000,
			remarks: 'Material chassis'
		}
	]);
	console.log('✅ Purchase Requisitions seeded');

	// 8. Seed Purchase Orders (PO)
	// PO 1: PENDING_APPROVAL - Dibuat Purchasing, butuh Approval dari Finance Manager
	const po1 = {
		id: 'po-01',
		poNumber: 'PO-2026-0001',
		prId: pr2.id,
		vendorId: vendor3.id, // PT Logam Baja Nusantara
		createdBy: userPurchasing.id,
		approvedBy: null,
		status: 'PENDING_APPROVAL' as const,
		subtotal: 35600000,
		taxAmount: 3916000, // 11% PPN
		grandTotal: 39516000,
		deliveryExpectedDate: '2026-10-20',
		approvedAt: null,
		terms: 'Pembayaran Net 45 hari setelah Goods Receipt & Faktur Pajak lengkap',
		notes: 'Pesanan plat aluminium batch 1 Q4 2026',
		createdAt: '2026-10-06T10:30:00Z',
		updatedAt: '2026-10-06T10:30:00Z'
	};

	// PO 2: APPROVED - Sudah disetujui Finance, siap diterima di Gudang (Goods Receipt demo)
	const po2 = {
		id: 'po-02',
		poNumber: 'PO-2026-0002',
		prId: null,
		vendorId: vendor1.id, // PT Mitra Elektrindo
		createdBy: userPurchasing.id,
		approvedBy: userFinance.id,
		status: 'APPROVED' as const,
		subtotal: 12250000,
		taxAmount: 1347500,
		grandTotal: 13597500,
		deliveryExpectedDate: '2026-10-14',
		approvedAt: '2026-10-07T16:00:00Z',
		terms: 'Net 30 hari via transfer Bank Mandiri',
		notes: 'Inverter dan proximity sensor cadangan',
		createdAt: '2026-10-07T11:00:00Z',
		updatedAt: '2026-10-07T16:00:00Z'
	};

	// PO 3: COMPLETED - Sudah tuntas, diterima gudang, faktur tercocokkan
	const po3 = {
		id: 'po-03',
		poNumber: 'PO-2026-0003',
		prId: null,
		vendorId: vendor2.id, // CV Cipta Kemasan
		createdBy: userPurchasing.id,
		approvedBy: userFinance.id,
		status: 'COMPLETED' as const,
		subtotal: 3700000,
		taxAmount: 407000,
		grandTotal: 4107000,
		deliveryExpectedDate: '2026-10-08',
		approvedAt: '2026-10-03T09:00:00Z',
		terms: 'Net 14 hari',
		notes: 'Restock karton kardus packing',
		createdAt: '2026-10-02T14:00:00Z',
		updatedAt: '2026-10-08T15:00:00Z'
	};

	await db.insert(schema.purchaseOrders).values([po1, po2, po3]);

	// PO Items
	const poi1 = {
		id: 'poi-01',
		poId: po1.id,
		productId: prod3.id,
		quantity: 40,
		unitPrice: 890000,
		totalPrice: 35600000,
		receivedQty: 0
	};

	const poi2 = {
		id: 'poi-02',
		poId: po2.id,
		productId: prod2.id,
		quantity: 5,
		unitPrice: 2450000,
		totalPrice: 12250000,
		receivedQty: 0
	};

	const poi3 = {
		id: 'poi-03',
		poId: po3.id,
		productId: prod5.id,
		quantity: 200,
		unitPrice: 18500,
		totalPrice: 3700000,
		receivedQty: 200
	};

	await db.insert(schema.purchaseOrderItems).values([poi1, poi2, poi3]);
	console.log('✅ Purchase Orders seeded');

	// 9. Seed Goods Receipt (GR) untuk PO-2026-0003
	const gr1 = {
		id: 'gr-01',
		grNumber: 'GR-2026-0001',
		poId: po3.id,
		deliveryNoteNumber: 'SJ-9981/CKP/X/2026',
		receivedBy: userWarehouse.id,
		receivedDate: '2026-10-08T10:30:00Z',
		status: 'VERIFIED' as const,
		notes: '200 pcs karton box diterima utuh tanpa cacat, kondisi kering dan rapi.',
		createdAt: '2026-10-08T11:00:00Z'
	};

	await db.insert(schema.goodsReceipts).values([gr1]);

	await db.insert(schema.goodsReceiptItems).values([
		{
			id: 'gri-01',
			grId: gr1.id,
			poItemId: poi3.id,
			productId: prod5.id,
			receivedQty: 200,
			acceptedQty: 200,
			rejectedQty: 0,
			rejectionReason: null
		}
	]);
	console.log('✅ Goods Receipts seeded');

	// 10. Seed Invoices & 3-Way Matching
	// Invoice 1: MATCHED - PO-2026-0003 vs GR-2026-0001 vs INV-2026-0001 (Semua cocok sempurna!)
	const invc1 = {
		id: 'invc-01',
		invoiceNumber: 'INV-2026-0001',
		poId: po3.id,
		grId: gr1.id,
		vendorInvoiceRef: 'INV/CKP/2026/10/0812',
		amount: 4107000, // Termasuk PPN
		status: 'MATCHED' as const,
		matchScore: 1.0,
		matchDiscrepancyNotes: '3-Way Match 100% Sempurna: PO Rp 4.107.000 == GR 200 Pcs == Inv Rp 4.107.000',
		dueDate: '2026-10-22',
		paidAt: null,
		createdAt: '2026-10-09T09:00:00Z'
	};

	// Invoice 2: PENDING_MATCH - Untuk PO-2026-0002 yang baru tiba
	const invc2 = {
		id: 'invc-02',
		invoiceNumber: 'INV-2026-0002',
		poId: po2.id,
		grId: null,
		vendorInvoiceRef: 'INV/MEJ/X/2026/044',
		amount: 13597500,
		status: 'PENDING_MATCH' as const,
		matchScore: 0.5,
		matchDiscrepancyNotes: 'Menunggu penerimaan fisik barang di gudang (Goods Receipt belum diinput).',
		dueDate: '2026-11-06',
		paidAt: null,
		createdAt: '2026-10-10T11:00:00Z'
	};

	await db.insert(schema.invoices).values([invc1, invc2]);
	console.log('✅ Invoices & 3-Way Matching seeded');

	console.log('🎉 Seeding completed successfully! Ready for prototype demonstration.');
}

// Allow direct CLI execution
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.ts')) {
	runSeed().catch((err) => {
		console.error('❌ Seeding failed:', err);
		process.exit(1);
	});
}
