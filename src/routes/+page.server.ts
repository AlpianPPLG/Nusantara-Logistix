import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// 1. Fetch products with category & inventory
	const allProducts = await db.query.products.findMany({
		with: {
			category: true,
			inventory: true
		}
	});

	// Calculate stock metrics
	let totalAssetValue = 0;
	const lowStockItems: typeof allProducts = [];

	for (const p of allProducts) {
		const qty = p.inventory?.currentQuantity ?? 0;
		const min = p.inventory?.minimumStock ?? 10;
		totalAssetValue += qty * p.unitPrice;

		if (qty <= min) {
			lowStockItems.push(p);
		}
	}

	// 2. Fetch Pending Purchase Orders (Waiting for Approval)
	const pendingPOs = await db.query.purchaseOrders.findMany({
		where: eq(schema.purchaseOrders.status, 'PENDING_APPROVAL'),
		with: {
			vendor: true,
			creator: true,
			items: {
				with: {
					product: true
				}
			}
		},
		orderBy: [desc(schema.purchaseOrders.createdAt)]
	});

	// 3. Fetch Pending PRs
	const pendingPRs = await db.query.purchaseRequisitions.findMany({
		where: eq(schema.purchaseRequisitions.status, 'PENDING'),
		with: {
			requester: true,
			items: {
				with: {
					product: true
				}
			}
		},
		orderBy: [desc(schema.purchaseRequisitions.createdAt)]
	});

	// 4. Fetch Invoices for 3-Way Match overview
	const allInvoices = await db.query.invoices.findMany({
		with: {
			po: {
				with: {
					vendor: true
				}
			},
			gr: true
		},
		orderBy: [desc(schema.invoices.createdAt)]
	});

	// 5. Recent Stock Movements
	const recentMovements = await db.query.stockMovements.findMany({
		with: {
			inventory: {
				with: {
					product: true
				}
			}
		},
		limit: 6,
		orderBy: [desc(schema.stockMovements.createdAt)]
	});

	return {
		metrics: {
			totalSku: allProducts.length,
			totalAssetValue,
			lowStockCount: lowStockItems.length,
			pendingPOCount: pendingPOs.length,
			pendingPRCount: pendingPRs.length,
			matchedInvoicesCount: allInvoices.filter((i) => i.status === 'MATCHED').length
		},
		lowStockItems,
		pendingPOs,
		pendingPRs,
		allInvoices,
		recentMovements
	};
};
