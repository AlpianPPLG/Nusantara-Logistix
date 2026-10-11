import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const vendorsList = await db.query.vendors.findMany({
		with: {
			// orders could be counted
		},
		orderBy: [desc(schema.vendors.rating)]
	});

	const orders = await db.query.purchaseOrders.findMany();

	return {
		vendors: vendorsList,
		orders
	};
};
