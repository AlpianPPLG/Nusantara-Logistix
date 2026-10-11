import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const productsList = await db.query.products.findMany({
		with: {
			category: true,
			inventory: true
		},
		orderBy: [desc(schema.products.createdAt)]
	});

	const categoriesList = await db.query.categories.findMany();

	return {
		products: productsList,
		categories: categoriesList
	};
};

export const actions: Actions = {
	adjustStock: async ({ request }) => {
		const formData = await request.formData();
		const inventoryId = formData.get('inventoryId')?.toString();
		const type = formData.get('type')?.toString() as 'IN' | 'OUT' | 'ADJUSTMENT';
		const quantity = parseInt(formData.get('quantity')?.toString() || '0', 10);
		const notes = formData.get('notes')?.toString() || 'Penyesuaian stok manual';
		const performedBy = formData.get('performedBy')?.toString() || 'Warehouse Staff';

		if (!inventoryId || !type || quantity <= 0) {
			return fail(400, { message: 'Data penyesuaian stok tidak valid' });
		}

		// Get current inventory
		const currentInv = await db.query.inventory.findFirst({
			where: eq(schema.inventory.id, inventoryId)
		});

		if (!currentInv) {
			return fail(404, { message: 'Data inventaris tidak ditemukan' });
		}

		let newQty = currentInv.currentQuantity;
		if (type === 'IN') {
			newQty += quantity;
		} else if (type === 'OUT') {
			if (currentInv.currentQuantity < quantity) {
				return fail(400, { message: 'Jumlah stok keluar melebihi stok yang tersedia saat ini' });
			}
			newQty -= quantity;
		} else if (type === 'ADJUSTMENT') {
			newQty = quantity;
		}

		// Update inventory quantity
		await db
			.update(schema.inventory)
			.set({
				currentQuantity: newQty,
				lastAuditDate: new Date().toISOString()
			})
			.where(eq(schema.inventory.id, inventoryId));

		// Insert stock movement record
		await db.insert(schema.stockMovements).values({
			inventoryId: inventoryId,
			type: type,
			quantity: quantity,
			previousQuantity: currentInv.currentQuantity,
			newQuantity: newQty,
			referenceType: type === 'IN' ? 'PURCHASE_RECEIPT' : type === 'OUT' ? 'DISPATCH' : 'MANUAL_CORRECTION',
			notes: notes,
			performedBy: performedBy
		});

		return { success: true, message: `Stok berhasil diperbarui: ${currentInv.currentQuantity} → ${newQty}` };
	},

	addProduct: async ({ request }) => {
		const formData = await request.formData();
		const skuCode = formData.get('skuCode')?.toString()?.trim();
		const name = formData.get('name')?.toString()?.trim();
		const categoryId = formData.get('categoryId')?.toString();
		const unit = formData.get('unit')?.toString() || 'PCS';
		const unitPrice = parseInt(formData.get('unitPrice')?.toString() || '0', 10);
		const location = formData.get('warehouseLocation')?.toString() || 'Zone A';
		const initialQty = parseInt(formData.get('initialQty')?.toString() || '0', 10);
		const minStock = parseInt(formData.get('minStock')?.toString() || '10', 10);
		const reorderPoint = parseInt(formData.get('reorderPoint')?.toString() || '20', 10);

		if (!skuCode || !name) {
			return fail(400, { message: 'SKU dan Nama Barang wajib diisi' });
		}

		// Insert product
		const productId = `prd-${Date.now().toString(36)}`;
		await db.insert(schema.products).values({
			id: productId,
			skuCode,
			name,
			categoryId: categoryId || null,
			unit,
			unitPrice,
			createdAt: new Date().toISOString()
		});

		// Insert inventory entry
		const inventoryId = `inv-${Date.now().toString(36)}`;
		await db.insert(schema.inventory).values({
			id: inventoryId,
			productId: productId,
			warehouseLocation: location,
			currentQuantity: initialQty,
			minimumStock: minStock,
			maximumStock: 500,
			reorderPoint: reorderPoint,
			lastAuditDate: new Date().toISOString()
		});

		if (initialQty > 0) {
			await db.insert(schema.stockMovements).values({
				inventoryId: inventoryId,
				type: 'IN',
				quantity: initialQty,
				previousQuantity: 0,
				newQuantity: initialQty,
				referenceType: 'MANUAL_CORRECTION',
				notes: 'Saldo stok awal barang baru',
				performedBy: 'System / Admin'
			});
		}

		return { success: true, message: `Barang ${name} (${skuCode}) berhasil ditambahkan!` };
	}
};
