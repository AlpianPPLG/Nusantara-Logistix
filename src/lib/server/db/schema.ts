import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Users & Roles
export const users = sqliteTable('users', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull().unique(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	role: text('role', { enum: ['admin', 'warehouse', 'purchasing', 'finance'] }).notNull(),
	avatar: text('avatar'),
	lastLogin: text('last_login'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 2. Categories
export const categories = sqliteTable('categories', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	code: text('code').notNull().unique(),
	description: text('description')
});

// 3. Vendors / Suppliers
export const vendors = sqliteTable('vendors', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	code: text('code').notNull().unique(),
	companyName: text('company_name').notNull(),
	contactName: text('contact_name').notNull(),
	contactEmail: text('contact_email').notNull(),
	contactPhone: text('contact_phone'),
	address: text('address'),
	rating: real('rating').notNull().default(4.5),
	status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
	paymentTerms: text('payment_terms').notNull().default('Net 30')
});

// 4. Products / Master Barang
export const products = sqliteTable('products', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	skuCode: text('sku_code').notNull().unique(),
	name: text('name').notNull(),
	categoryId: text('category_id').references(() => categories.id),
	unit: text('unit').notNull().default('PCS'),
	unitPrice: integer('unit_price').notNull().default(0), // in IDR
	description: text('description'),
	imageUrl: text('image_url'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 5. Inventory / Stok Gudang Real-time
export const inventory = sqliteTable('inventory', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	productId: text('product_id').notNull().unique().references(() => products.id),
	warehouseLocation: text('warehouse_location').notNull(), // e.g. Rack A-01, Bin 12
	currentQuantity: integer('current_quantity').notNull().default(0),
	minimumStock: integer('minimum_stock').notNull().default(10),
	maximumStock: integer('maximum_stock').notNull().default(500),
	reorderPoint: integer('reorder_point').notNull().default(20),
	lastAuditDate: text('last_audit_date')
});

// 6. Stock Movements / Mutasi Stok (Ledger)
export const stockMovements = sqliteTable('stock_movements', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	inventoryId: text('inventory_id').notNull().references(() => inventory.id),
	type: text('type', { enum: ['IN', 'OUT', 'ADJUSTMENT', 'RECEIPT'] }).notNull(),
	quantity: integer('quantity').notNull(),
	previousQuantity: integer('previous_quantity').notNull(),
	newQuantity: integer('new_quantity').notNull(),
	referenceType: text('reference_type', {
		enum: ['PURCHASE_RECEIPT', 'DISPATCH', 'MANUAL_CORRECTION', 'SCRAP']
	}).notNull(),
	referenceId: text('reference_id'),
	notes: text('notes'),
	performedBy: text('performed_by').notNull(),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 7. Purchase Requisitions (PR)
export const purchaseRequisitions = sqliteTable('purchase_requisitions', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	prNumber: text('pr_number').notNull().unique(),
	requestedBy: text('requested_by').notNull().references(() => users.id),
	department: text('department').notNull().default('Warehouse & Logistics'),
	status: text('status', {
		enum: ['PENDING', 'APPROVED', 'CONVERTED', 'REJECTED']
	}).notNull().default('PENDING'),
	priority: text('priority', { enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
		.notNull()
		.default('MEDIUM'),
	totalEstimatedAmount: integer('total_estimated_amount').notNull().default(0),
	notes: text('notes'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 8. Purchase Requisition Items
export const purchaseRequisitionItems = sqliteTable('purchase_requisition_items', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	prId: text('pr_id').notNull().references(() => purchaseRequisitions.id),
	productId: text('product_id').notNull().references(() => products.id),
	requestedQty: integer('requested_qty').notNull(),
	estimatedUnitPrice: integer('estimated_unit_price').notNull(),
	remarks: text('remarks')
});

// 9. Purchase Orders (PO)
export const purchaseOrders = sqliteTable('purchase_orders', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	poNumber: text('po_number').notNull().unique(),
	prId: text('pr_id').references(() => purchaseRequisitions.id),
	vendorId: text('vendor_id').notNull().references(() => vendors.id),
	createdBy: text('created_by').notNull().references(() => users.id),
	approvedBy: text('approved_by').references(() => users.id),
	status: text('status', {
		enum: [
			'DRAFT',
			'PENDING_APPROVAL',
			'APPROVED',
			'REJECTED',
			'SENT',
			'PARTIALLY_RECEIVED',
			'COMPLETED',
			'CANCELLED'
		]
	}).notNull().default('PENDING_APPROVAL'),
	subtotal: integer('subtotal').notNull().default(0),
	taxAmount: integer('tax_amount').notNull().default(0), // PPN 11%
	grandTotal: integer('grand_total').notNull().default(0),
	deliveryExpectedDate: text('delivery_expected_date'),
	approvedAt: text('approved_at'),
	terms: text('terms').default('Standard Procurement Contract T&C'),
	notes: text('notes'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 10. Purchase Order Items
export const purchaseOrderItems = sqliteTable('purchase_order_items', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	poId: text('po_id').notNull().references(() => purchaseOrders.id),
	productId: text('product_id').notNull().references(() => products.id),
	quantity: integer('quantity').notNull(),
	unitPrice: integer('unit_price').notNull(),
	totalPrice: integer('total_price').notNull(),
	receivedQty: integer('received_qty').notNull().default(0)
});

// 11. Goods Receipts (GR / Penerimaan Barang)
export const goodsReceipts = sqliteTable('goods_receipts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	grNumber: text('gr_number').notNull().unique(),
	poId: text('po_id').notNull().references(() => purchaseOrders.id),
	deliveryNoteNumber: text('delivery_note_number').notNull(), // No. Surat Jalan Vendor
	receivedBy: text('received_by').notNull().references(() => users.id),
	receivedDate: text('received_date').notNull(),
	status: text('status', {
		enum: ['VERIFIED', 'DISCREPANCY', 'PENDING_INSPECTION']
	}).notNull().default('VERIFIED'),
	notes: text('notes'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

// 12. Goods Receipt Items
export const goodsReceiptItems = sqliteTable('goods_receipt_items', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	grId: text('gr_id').notNull().references(() => goodsReceipts.id),
	poItemId: text('po_item_id').notNull().references(() => purchaseOrderItems.id),
	productId: text('product_id').notNull().references(() => products.id),
	receivedQty: integer('received_qty').notNull(),
	acceptedQty: integer('accepted_qty').notNull(),
	rejectedQty: integer('rejected_qty').notNull().default(0),
	rejectionReason: text('rejection_reason')
});

// 13. Invoices (3-Way Matching: PO vs GR vs Invoice)
export const invoices = sqliteTable('invoices', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	invoiceNumber: text('invoice_number').notNull().unique(),
	poId: text('po_id').notNull().references(() => purchaseOrders.id),
	grId: text('gr_id').references(() => goodsReceipts.id),
	vendorInvoiceRef: text('vendor_invoice_ref').notNull(),
	amount: integer('amount').notNull(),
	status: text('status', {
		enum: ['PENDING_MATCH', 'MATCHED', 'DISPUTED', 'PAID']
	}).notNull().default('PENDING_MATCH'),
	matchScore: real('match_score').notNull().default(1.0),
	matchDiscrepancyNotes: text('match_discrepancy_notes'),
	dueDate: text('due_date'),
	paidAt: text('paid_at'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString())
});

// RELATIONS DEFINITIONS FOR TYPE-SAFE NESTED QUERIES
export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	inventory: one(inventory, {
		fields: [products.id],
		references: [inventory.productId]
	})
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
	product: one(products, {
		fields: [inventory.productId],
		references: [products.id]
	}),
	movements: many(stockMovements)
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
	inventory: one(inventory, {
		fields: [stockMovements.inventoryId],
		references: [inventory.id]
	})
}));

export const purchaseRequisitionsRelations = relations(purchaseRequisitions, ({ one, many }) => ({
	requester: one(users, {
		fields: [purchaseRequisitions.requestedBy],
		references: [users.id]
	}),
	items: many(purchaseRequisitionItems),
	orders: many(purchaseOrders)
}));

export const purchaseRequisitionItemsRelations = relations(purchaseRequisitionItems, ({ one }) => ({
	pr: one(purchaseRequisitions, {
		fields: [purchaseRequisitionItems.prId],
		references: [purchaseRequisitions.id]
	}),
	product: one(products, {
		fields: [purchaseRequisitionItems.productId],
		references: [products.id]
	})
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
	pr: one(purchaseRequisitions, {
		fields: [purchaseOrders.prId],
		references: [purchaseRequisitions.id]
	}),
	vendor: one(vendors, {
		fields: [purchaseOrders.vendorId],
		references: [vendors.id]
	}),
	creator: one(users, {
		fields: [purchaseOrders.createdBy],
		references: [users.id]
	}),
	approver: one(users, {
		fields: [purchaseOrders.approvedBy],
		references: [users.id]
	}),
	items: many(purchaseOrderItems),
	receipts: many(goodsReceipts),
	invoices: many(invoices)
}));

export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({ one }) => ({
	po: one(purchaseOrders, {
		fields: [purchaseOrderItems.poId],
		references: [purchaseOrders.id]
	}),
	product: one(products, {
		fields: [purchaseOrderItems.productId],
		references: [products.id]
	})
}));

export const goodsReceiptsRelations = relations(goodsReceipts, ({ one, many }) => ({
	po: one(purchaseOrders, {
		fields: [goodsReceipts.poId],
		references: [purchaseOrders.id]
	}),
	receiver: one(users, {
		fields: [goodsReceipts.receivedBy],
		references: [users.id]
	}),
	items: many(goodsReceiptItems)
}));

export const goodsReceiptItemsRelations = relations(goodsReceiptItems, ({ one }) => ({
	gr: one(goodsReceipts, {
		fields: [goodsReceiptItems.grId],
		references: [goodsReceipts.id]
	}),
	poItem: one(purchaseOrderItems, {
		fields: [goodsReceiptItems.poItemId],
		references: [purchaseOrderItems.id]
	}),
	product: one(products, {
		fields: [goodsReceiptItems.productId],
		references: [products.id]
	})
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
	po: one(purchaseOrders, {
		fields: [invoices.poId],
		references: [purchaseOrders.id]
	}),
	gr: one(goodsReceipts, {
		fields: [invoices.grId],
		references: [goodsReceipts.id]
	})
}));
