import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const prList = await db.query.purchaseRequisitions.findMany({
		with: {
			requester: true,
			items: {
				with: {
					product: true
				}
			},
			orders: true
		},
		orderBy: [desc(schema.purchaseRequisitions.createdAt)]
	});

	const productsList = await db.query.products.findMany({
		with: {
			inventory: true
		}
	});

	const vendorsList = await db.query.vendors.findMany({
		where: eq(schema.vendors.status, 'active')
	});

	return {
		requisitions: prList,
		products: productsList,
		vendors: vendorsList
	};
};

export const actions: Actions = {
	createPR: async ({ request }) => {
		const formData = await request.formData();
		const requestedBy = formData.get('requestedBy')?.toString() || 'usr-wh-01';
		const priority = formData.get('priority')?.toString() as any || 'MEDIUM';
		const notes = formData.get('notes')?.toString() || '';
		const productId = formData.get('productId')?.toString();
		const requestedQty = parseInt(formData.get('requestedQty')?.toString() || '0', 10);

		if (!productId || requestedQty <= 0) {
			return fail(400, { message: 'Pilih produk dan masukkan jumlah yang diminta' });
		}

		const product = await db.query.products.findFirst({
			where: eq(schema.products.id, productId)
		});

		if (!product) {
			return fail(404, { message: 'Produk tidak ditemukan' });
		}

		const prId = `pr-${Date.now().toString(36)}`;
		const prCount = (await db.query.purchaseRequisitions.findMany()).length + 1;
		const prNumber = `PR-2026-${String(prCount).padStart(4, '0')}`;
		const totalEstimated = requestedQty * product.unitPrice;

		// Insert PR header
		await db.insert(schema.purchaseRequisitions).values({
			id: prId,
			prNumber,
			requestedBy,
			department: 'Warehouse & Logistics',
			status: 'PENDING',
			priority,
			totalEstimatedAmount: totalEstimated,
			notes,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});

		// Insert PR line item
		await db.insert(schema.purchaseRequisitionItems).values({
			id: `pri-${Date.now().toString(36)}`,
			prId,
			productId,
			requestedQty,
			estimatedUnitPrice: product.unitPrice,
			remarks: notes
		});

		return { success: true, message: `Permintaan Pembelian ${prNumber} berhasil diajukan!` };
	},

	convertToPO: async ({ request }) => {
		const formData = await request.formData();
		const prId = formData.get('prId')?.toString();
		const vendorId = formData.get('vendorId')?.toString();
		const createdBy = formData.get('createdBy')?.toString() || 'usr-purch-01';

		if (!prId || !vendorId) {
			return fail(400, { message: 'Pilih Vendor untuk memproses Purchase Order' });
		}

		const pr = await db.query.purchaseRequisitions.findFirst({
			where: eq(schema.purchaseRequisitions.id, prId),
			with: {
				items: {
					with: {
						product: true
					}
				}
			}
		});

		if (!pr || !pr.items || pr.items.length === 0) {
			return fail(404, { message: 'Data PR tidak valid' });
		}

		const poId = `po-${Date.now().toString(36)}`;
		const poCount = (await db.query.purchaseOrders.findMany()).length + 1;
		const poNumber = `PO-2026-${String(poCount).padStart(4, '0')}`;

		const subtotal = pr.totalEstimatedAmount;
		const taxAmount = Math.round(subtotal * 0.11); // PPN 11%
		const grandTotal = subtotal + taxAmount;

		// 1. Insert PO Header
		await db.insert(schema.purchaseOrders).values({
			id: poId,
			poNumber,
			prId: pr.id,
			vendorId,
			createdBy,
			approvedBy: null,
			status: 'PENDING_APPROVAL',
			subtotal,
			taxAmount,
			grandTotal,
			deliveryExpectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0],
			terms: 'Net 30 hari via Bank Transfer',
			notes: `Konversi dari ${pr.prNumber}. Catatan: ${pr.notes ?? '-'}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});

		// 2. Insert PO line items
		for (const item of pr.items) {
			await db.insert(schema.purchaseOrderItems).values({
				id: `poi-${Date.now().toString(36)}-${Math.random().toString(36).substring(7)}`,
				poId,
				productId: item.productId,
				quantity: item.requestedQty,
				unitPrice: item.estimatedUnitPrice,
				totalPrice: item.requestedQty * item.estimatedUnitPrice,
				receivedQty: 0
			});
		}

		// 3. Update PR status to CONVERTED
		await db
			.update(schema.purchaseRequisitions)
			.set({
				status: 'CONVERTED',
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.purchaseRequisitions.id, pr.id));

		return {
			success: true,
			message: `Berhasil mengonversi ${pr.prNumber} menjadi Purchase Order ${poNumber}!`
		};
	}
};
