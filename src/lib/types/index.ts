export type UserRole = 'admin' | 'warehouse' | 'purchasing' | 'finance';

export interface User {
	id: string;
	username: string;
	name: string;
	email: string;
	role: UserRole;
	avatar: string | null;
	lastLogin: string | null;
	createdAt: string;
}

export interface Category {
	id: string;
	name: string;
	code: string;
	description: string | null;
}

export interface Vendor {
	id: string;
	code: string;
	companyName: string;
	contactName: string;
	contactEmail: string;
	contactPhone: string | null;
	address: string | null;
	rating: number;
	status: 'active' | 'inactive';
	paymentTerms: string;
}

export interface Product {
	id: string;
	skuCode: string;
	name: string;
	categoryId: string | null;
	unit: string;
	unitPrice: number;
	description: string | null;
	imageUrl: string | null;
	createdAt: string;
	category?: Category | null;
	inventory?: Inventory | null;
}

export interface Inventory {
	id: string;
	productId: string;
	warehouseLocation: string;
	currentQuantity: number;
	minimumStock: number;
	maximumStock: number;
	reorderPoint: number;
	lastAuditDate: string | null;
	product?: Product | null;
}

export interface StockMovement {
	id: string;
	inventoryId: string;
	type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RECEIPT';
	quantity: number;
	previousQuantity: number;
	newQuantity: number;
	referenceType: 'PURCHASE_RECEIPT' | 'DISPATCH' | 'MANUAL_CORRECTION' | 'SCRAP';
	referenceId: string | null;
	notes: string | null;
	performedBy: string;
	createdAt: string;
}

export type PRStatus = 'PENDING' | 'APPROVED' | 'CONVERTED' | 'REJECTED';
export type PRPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PurchaseRequisitionItem {
	id: string;
	prId: string;
	productId: string;
	requestedQty: number;
	estimatedUnitPrice: number;
	remarks: string | null;
	product?: Product | null;
}

export interface PurchaseRequisition {
	id: string;
	prNumber: string;
	requestedBy: string;
	department: string;
	status: PRStatus;
	priority: PRPriority;
	totalEstimatedAmount: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	requester?: User | null;
	items?: PurchaseRequisitionItem[];
}

export type POStatus =
	| 'DRAFT'
	| 'PENDING_APPROVAL'
	| 'APPROVED'
	| 'REJECTED'
	| 'SENT'
	| 'PARTIALLY_RECEIVED'
	| 'COMPLETED'
	| 'CANCELLED';

export interface PurchaseOrderItem {
	id: string;
	poId: string;
	productId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	receivedQty: number;
	product?: Product | null;
}

export interface PurchaseOrder {
	id: string;
	poNumber: string;
	prId: string | null;
	vendorId: string;
	createdBy: string;
	approvedBy: string | null;
	status: POStatus;
	subtotal: number;
	taxAmount: number;
	grandTotal: number;
	deliveryExpectedDate: string | null;
	approvedAt: string | null;
	terms: string | null;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	vendor?: Vendor | null;
	creator?: User | null;
	approver?: User | null;
	items?: PurchaseOrderItem[];
	receipts?: GoodsReceipt[];
	invoices?: Invoice[];
}

export type GRStatus = 'VERIFIED' | 'DISCREPANCY' | 'PENDING_INSPECTION';

export interface GoodsReceiptItem {
	id: string;
	grId: string;
	poItemId: string;
	productId: string;
	receivedQty: number;
	acceptedQty: number;
	rejectedQty: number;
	rejectionReason: string | null;
	product?: Product | null;
}

export interface GoodsReceipt {
	id: string;
	grNumber: string;
	poId: string;
	deliveryNoteNumber: string;
	receivedBy: string;
	receivedDate: string;
	status: GRStatus;
	notes: string | null;
	createdAt: string;
	receiver?: User | null;
	items?: GoodsReceiptItem[];
	po?: PurchaseOrder | null;
}

export type InvoiceStatus = 'PENDING_MATCH' | 'MATCHED' | 'DISPUTED' | 'PAID';

export interface Invoice {
	id: string;
	invoiceNumber: string;
	poId: string;
	grId: string | null;
	vendorInvoiceRef: string;
	amount: number;
	status: InvoiceStatus;
	matchScore: number;
	matchDiscrepancyNotes: string | null;
	dueDate: string | null;
	paidAt: string | null;
	createdAt: string;
	po?: PurchaseOrder | null;
	gr?: GoodsReceipt | null;
}
