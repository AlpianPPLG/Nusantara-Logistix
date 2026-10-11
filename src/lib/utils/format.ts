export function formatRupiah(amount: number | null | undefined): string {
	if (amount == null || isNaN(amount)) return 'Rp 0';
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatDate(dateStr: string | null | undefined): string {
	if (!dateStr) return '-';
	try {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	} catch {
		return dateStr;
	}
}

export function formatDateShort(dateStr: string | null | undefined): string {
	if (!dateStr) return '-';
	try {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(date);
	} catch {
		return dateStr;
	}
}

export function getStockStatus(currentQty: number, minStock: number, reorderPoint: number) {
	if (currentQty <= 0) {
		return {
			label: 'Habis (Out of Stock)',
			color: 'text-rose-400',
			bgColor: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
			isLow: true,
			isCritical: true
		};
	}
	if (currentQty <= minStock) {
		return {
			label: 'Stok Kritis (Low Stock)',
			color: 'text-amber-400',
			bgColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
			isLow: true,
			isCritical: true
		};
	}
	if (currentQty <= reorderPoint) {
		return {
			label: 'Reorder Point (Perlu Restock)',
			color: 'text-yellow-400',
			bgColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
			isLow: true,
			isCritical: false
		};
	}
	return {
		label: 'Aman (Optimal)',
		color: 'text-emerald-400',
		bgColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
		isLow: false,
		isCritical: false
	};
}

export function getStatusBadge(status: string) {
	switch (status) {
		case 'APPROVED':
		case 'COMPLETED':
		case 'VERIFIED':
		case 'MATCHED':
		case 'active':
			return {
				label: status === 'APPROVED' ? 'Disetujui' : status === 'COMPLETED' ? 'Selesai' : status === 'VERIFIED' ? 'Terverifikasi' : status === 'MATCHED' ? 'Tercocokkan' : 'Aktif',
				classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
			};
		case 'PENDING':
		case 'PENDING_APPROVAL':
		case 'PENDING_MATCH':
		case 'PENDING_INSPECTION':
			return {
				label: status === 'PENDING_APPROVAL' ? 'Menunggu Approval' : status === 'PENDING_MATCH' ? 'Perlu 3-Way Match' : status === 'PENDING_INSPECTION' ? 'Menunggu Inspeksi' : 'Menunggu',
				classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
			};
		case 'REJECTED':
		case 'DISPUTED':
		case 'CANCELLED':
		case 'inactive':
			return {
				label: status === 'REJECTED' ? 'Ditolak' : status === 'DISPUTED' ? 'Selisih / Sengketa' : status === 'CANCELLED' ? 'Dibatalkan' : 'Non-aktif',
				classes: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
			};
		case 'CONVERTED':
		case 'SENT':
		case 'PARTIALLY_RECEIVED':
			return {
				label: status === 'CONVERTED' ? 'Dikonversi ke PO' : status === 'SENT' ? 'Terkirim ke Vendor' : 'Diterima Sebagian',
				classes: 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
			};
		default:
			return {
				label: status,
				classes: 'bg-slate-800 text-slate-300 border border-slate-700'
			};
	}
}
