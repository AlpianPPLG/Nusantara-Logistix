import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const invoicesList = await db.query.invoices.findMany({
		with: {
			po: {
				with: {
					vendor: true,
					items: {
						with: {
							product: true
						}
					}
				}
			},
			gr: {
				with: {
					items: {
						with: {
							product: true
						}
					},
					receiver: true
				}
			}
		},
		orderBy: [desc(schema.invoices.createdAt)]
	});

	return {
		invoices: invoicesList
	};
};

export const actions: Actions = {
	verifyMatch: async ({ request }) => {
		const formData = await request.formData();
		const invoiceId = formData.get('invoiceId')?.toString();

		if (!invoiceId) {
			return fail(400, { message: 'Invoice ID tidak valid' });
		}

		const invoice = await db.query.invoices.findFirst({
			where: eq(schema.invoices.id, invoiceId),
			with: {
				po: true,
				gr: true
			}
		});

		if (!invoice) {
			return fail(404, { message: 'Data Faktur tidak ditemukan' });
		}

		if (!invoice.gr) {
			return fail(400, {
				message: 'Barang fisik belum diterima di gudang (Goods Receipt belum ada). 3-Way Match tidak dapat diselesaikan.'
			});
		}

		await db
			.update(schema.invoices)
			.set({
				status: 'MATCHED',
				matchScore: 1.0,
				matchDiscrepancyNotes: '3-Way Match diverifikasi secara manual oleh Finance Manager: PO, GR, dan Faktur sesuai 100%.'
			})
			.where(eq(schema.invoices.id, invoiceId));

		return { success: true, message: `Faktur ${invoice.invoiceNumber} berhasil diverifikasi 3-Way Match!` };
	},

	payInvoice: async ({ request }) => {
		const formData = await request.formData();
		const invoiceId = formData.get('invoiceId')?.toString();

		if (!invoiceId) {
			return fail(400, { message: 'Invoice ID tidak valid' });
		}

		await db
			.update(schema.invoices)
			.set({
				status: 'PAID',
				paidAt: new Date().toISOString()
			})
			.where(eq(schema.invoices.id, invoiceId));

		return { success: true, message: `Pembayaran faktur berhasil diproses!` };
	}
};
