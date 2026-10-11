import type { UserRole } from '$lib/types';

export const roleProfiles: Record<
	UserRole,
	{ id: string; name: string; title: string; avatar: string; color: string; badge: string }
> = {
	warehouse: {
		id: 'usr-wh-01',
		name: 'Rian Pratama',
		title: 'Staf / Kepala Gudang',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
		color: 'from-amber-500 to-orange-600',
		badge: 'Warehouse & Stock'
	},
	purchasing: {
		id: 'usr-purch-01',
		name: 'Maya Indah',
		title: 'Spesialis Pengadaan (Procurement)',
		avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
		color: 'from-blue-500 to-indigo-600',
		badge: 'Purchasing / Procurement'
	},
	finance: {
		id: 'usr-fin-01',
		name: 'Hendra Gunawan, S.E.',
		title: 'Manager Keuangan (Finance Approval)',
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
		color: 'from-emerald-500 to-teal-600',
		badge: 'Finance & Accounting'
	},
	admin: {
		id: 'usr-admin-01',
		name: 'Budi Santoso',
		title: 'Super Administrator',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
		color: 'from-purple-500 to-pink-600',
		badge: 'System Admin'
	}
};

class RoleState {
	currentRole = $state<UserRole>('warehouse');

	get currentUser() {
		return roleProfiles[this.currentRole];
	}

	setRole(role: UserRole) {
		this.currentRole = role;
		if (typeof window !== 'undefined') {
			localStorage.setItem('active_prototype_role', role);
		}
	}

	init() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('active_prototype_role') as UserRole;
			if (saved && roleProfiles[saved]) {
				this.currentRole = saved;
			}
		}
	}
}

export const roleStore = new RoleState();
