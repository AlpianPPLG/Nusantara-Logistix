import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { runSeed } from '$lib/server/db/seed';

export const POST: RequestHandler = async () => {
	try {
		await runSeed();
		return json({ success: true, message: 'Database reset to initial demo state' });
	} catch (error) {
		console.error('Failed to reset DB:', error);
		return json({ success: false, error: 'Database reset failed' }, { status: 500 });
	}
};
