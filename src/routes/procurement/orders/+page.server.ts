import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const poList = await db.query.purchaseOrders.findMany({
		with: {
			vendor: true,
			creator: true,
			approver: true,
			items: {
				with: {
					product: true
				}
			},
			receipts: true
		},
		orderBy: [desc(schema.purchaseOrders.createdAt)]
	});

	return {
		orders: poList
	};
};

export const actions: Actions = {
	approvePO: async ({ request }) => {
		const formData = await request.formData();
		const poId = formData.get('poId')?.toString();
		const approvedBy = formData.get('approvedBy')?.toString() || 'usr-fin-01';

		if (!poId) {
			return fail(400, { message: 'PO ID tidak valid' });
		}

		const po = await db.query.purchaseOrders.findFirst({
			where: eq(schema.purchaseOrders.id, poId)
		});

		if (!po) {
			return fail(404, { message: 'Purchase Order tidak ditemukan' });
		}

		await db
			.update(schema.purchaseOrders)
			.set({
				status: 'APPROVED',
				approvedBy,
				approvedAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.purchaseOrders.id, poId));

		return { success: true, message: `PO ${po.poNumber} berhasil disetujui oleh Finance Manager!` };
	},

	rejectPO: async ({ request }) => {
		const formData = await request.formData();
		const poId = formData.get('poId')?.toString();
		const reason = formData.get('reason')?.toString() || 'Ditolak oleh manajemen';

		if (!poId) {
			return fail(400, { message: 'PO ID tidak valid' });
		}

		const po = await db.query.purchaseOrders.findFirst({
			where: eq(schema.purchaseOrders.id, poId)
		});

		if (!po) {
			return fail(404, { message: 'Purchase Order tidak ditemukan' });
		}

		await db
			.update(schema.purchaseOrders)
			.set({
				status: 'REJECTED',
				notes: `Alasan penolakan: ${reason}`,
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.purchaseOrders.id, poId));

		return { success: true, message: `PO ${po.poNumber} telah ditolak.` };
	},

	sendToVendor: async ({ request }) => {
		const formData = await request.formData();
		const poId = formData.get('poId')?.toString();

		if (!poId) {
			return fail(400, { message: 'PO ID tidak valid' });
		}

		const po = await db.query.purchaseOrders.findFirst({
			where: eq(schema.purchaseOrders.id, poId)
		});

		if (!po) {
			return fail(404, { message: 'Purchase Order tidak ditemukan' });
		}

		await db
			.update(schema.purchaseOrders)
			.set({
				status: 'SENT',
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.purchaseOrders.id, poId));

		return { success: true, message: `PO ${po.poNumber} berhasil dikirimkan ke Vendor rekanan!` };
	}
};
