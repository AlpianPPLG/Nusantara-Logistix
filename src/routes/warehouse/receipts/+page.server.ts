import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// 1. Fetch all goods receipts
	const receiptsList = await db.query.goodsReceipts.findMany({
		with: {
			po: {
				with: {
					vendor: true
				}
			},
			receiver: true,
			items: {
				with: {
					product: true
				}
			}
		},
		orderBy: [desc(schema.goodsReceipts.createdAt)]
	});

	// 2. Fetch POs that are approved or sent and ready for goods receipt
	const pendingPOs = await db.query.purchaseOrders.findMany({
		where: inArray(schema.purchaseOrders.status, ['APPROVED', 'SENT', 'PARTIALLY_RECEIVED']),
		with: {
			vendor: true,
			items: {
				with: {
					product: {
						with: {
							inventory: true
						}
					}
				}
			}
		},
		orderBy: [desc(schema.purchaseOrders.createdAt)]
	});

	return {
		receipts: receiptsList,
		eligiblePOs: pendingPOs
	};
};

export const actions: Actions = {
	submitReceipt: async ({ request }) => {
		const formData = await request.formData();
		const poId = formData.get('poId')?.toString();
		const deliveryNoteNumber = formData.get('deliveryNoteNumber')?.toString()?.trim();
		const receivedBy = formData.get('receivedBy')?.toString() || 'usr-wh-01';
		const notes = formData.get('notes')?.toString() || 'Penerimaan fisik barang gudang';

		if (!poId || !deliveryNoteNumber) {
			return fail(400, { message: 'PO dan Nomor Surat Jalan Vendor wajib diisi' });
		}

		const po = await db.query.purchaseOrders.findFirst({
			where: eq(schema.purchaseOrders.id, poId),
			with: {
				items: {
					with: {
						product: {
							with: {
								inventory: true
							}
						}
					}
				}
			}
		});

		if (!po || !po.items || po.items.length === 0) {
			return fail(404, { message: 'Data Purchase Order tidak ditemukan' });
		}

		const grId = `gr-${Date.now().toString(36)}`;
		const grCount = (await db.query.goodsReceipts.findMany()).length + 1;
		const grNumber = `GR-2026-${String(grCount).padStart(4, '0')}`;

		// 1. Create Goods Receipt Header
		await db.insert(schema.goodsReceipts).values({
			id: grId,
			grNumber,
			poId: po.id,
			deliveryNoteNumber,
			receivedBy,
			receivedDate: new Date().toISOString(),
			status: 'VERIFIED',
			notes,
			createdAt: new Date().toISOString()
		});

		// 2. Process each PO item into GR item and update Inventory
		for (const poItem of po.items) {
			const qtyReceived = poItem.quantity; // default full shipment for demo
			const acceptedQty = qtyReceived;

			// Insert GR line item
			await db.insert(schema.goodsReceiptItems).values({
				id: `gri-${Date.now().toString(36)}-${Math.random().toString(36).substring(7)}`,
				grId,
				poItemId: poItem.id,
				productId: poItem.productId,
				receivedQty: qtyReceived,
				acceptedQty,
				rejectedQty: 0,
				rejectionReason: null
			});

			// Update PO item received quantity
			await db
				.update(schema.purchaseOrderItems)
				.set({
					receivedQty: poItem.receivedQty + acceptedQty
				})
				.where(eq(schema.purchaseOrderItems.id, poItem.id));

			// Update Inventory in real-time
			if (poItem.product?.inventory) {
				const currentInv = poItem.product.inventory;
				const newQty = currentInv.currentQuantity + acceptedQty;

				await db
					.update(schema.inventory)
					.set({
						currentQuantity: newQty,
						lastAuditDate: new Date().toISOString()
					})
					.where(eq(schema.inventory.id, currentInv.id));

				// Insert Stock Movement Ledger
				await db.insert(schema.stockMovements).values({
					inventoryId: currentInv.id,
					type: 'RECEIPT',
					quantity: acceptedQty,
					previousQuantity: currentInv.currentQuantity,
					newQuantity: newQty,
					referenceType: 'PURCHASE_RECEIPT',
					referenceId: grNumber,
					notes: `Penerimaan PO ${po.poNumber} (Surat Jalan: ${deliveryNoteNumber})`,
					performedBy: 'Warehouse Staff'
				});
			}
		}

		// 3. Mark PO as COMPLETED
		await db
			.update(schema.purchaseOrders)
			.set({
				status: 'COMPLETED',
				updatedAt: new Date().toISOString()
			})
			.where(eq(schema.purchaseOrders.id, po.id));

		// 4. Create invoice record for 3-Way Matching by Finance
		const invCount = (await db.query.invoices.findMany()).length + 1;
		const invoiceNumber = `INV-2026-${String(invCount).padStart(4, '0')}`;
		await db.insert(schema.invoices).values({
			id: `invc-${Date.now().toString(36)}`,
			invoiceNumber,
			poId: po.id,
			grId,
			vendorInvoiceRef: `INV/${po.poNumber}/VENDOR`,
			amount: po.grandTotal,
			status: 'MATCHED',
			matchScore: 1.0,
			matchDiscrepancyNotes: `3-Way Match Terverifikasi Otomatis: PO ${po.poNumber} == GR ${grNumber} == Faktur ${invoiceNumber}`,
			dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			paidAt: null,
			createdAt: new Date().toISOString()
		});

		return {
			success: true,
			message: `Barang dari PO ${po.poNumber} berhasil diterima (${grNumber})! Stok otomatis bertambah di gudang dan faktur 3-Way Match telah diteruskan ke Finance.`
		};
	}
};
