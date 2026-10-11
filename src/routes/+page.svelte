<script lang="ts">
	import type { PageData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, formatDate, formatDateShort, getStockStatus } from '$lib/utils/format';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Boxes,
		AlertTriangle,
		ShoppingCart,
		Scale,
		TrendingUp,
		ArrowRight,
		FileText,
		CheckCircle2,
		Clock,
		ShieldAlert,
		Sparkles
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-8 animate-in fade-in duration-300">
	<!-- Hero / Welcome Bar -->
	<div
		class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl"
	>
		<div
			class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
		></div>

		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2 mb-2">
					<span
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
					>
						<Sparkles class="w-3.5 h-3.5 text-indigo-400" />
						Mode Demo Terintegrasi (2026 Trend Tech Stack)
					</span>
				</div>
				<h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
					Selamat Datang, {roleStore.currentUser.name}
				</h2>
				<p class="text-sm text-slate-400 mt-1">
					Anda sedang mengakses portal sebagai <span class="text-indigo-400 font-semibold">{roleStore.currentUser.title}</span>. Seluruh alur data terhubung otomatis secara real-time.
				</p>
			</div>

			<!-- Role-based quick action pills -->
			<div class="flex flex-wrap items-center gap-2">
				{#if roleStore.currentRole === 'warehouse'}
					<a
						href="/procurement/requisitions"
						class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
					>
						<FileText class="w-4 h-4" />
						Ajukan PR Baru
					</a>
					<a
						href="/warehouse/receipts"
						class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
					>
						<Boxes class="w-4 h-4" />
						Input Goods Receipt
					</a>
				{:else if roleStore.currentRole === 'purchasing'}
					<a
						href="/procurement/orders"
						class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
					>
						<ShoppingCart class="w-4 h-4" />
						Kelola & Buat PO
					</a>
				{:else if roleStore.currentRole === 'finance'}
					<a
						href="/finance/3-way-match"
						class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
					>
						<Scale class="w-4 h-4" />
						Verifikasi 3-Way Match
					</a>
				{:else}
					<a
						href="/workflow-docs"
						class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
					>
						Lihat Arsitektur Lengkap
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- 4 Core KPI Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard
			title="Nilai Total Stok Gudang"
			value={formatRupiah(data.metrics.totalAssetValue)}
			subtext="{data.metrics.totalSku} SKU aktif terdaftar di sistem"
			variant="indigo"
		>
			{#snippet icon()}
				<Boxes class="w-5 h-5 text-indigo-400" />
			{/snippet}
		</StatCard>

		<StatCard
			title="Peringatan Stok Kritis"
			value="{data.metrics.lowStockCount} Item"
			subtext="Di bawah minimum buffer stock"
			variant={data.metrics.lowStockCount > 0 ? 'rose' : 'emerald'}
			isPositive={data.metrics.lowStockCount === 0}
			trend={data.metrics.lowStockCount > 0 ? 'Perlu Restock' : 'Aman'}
		>
			{#snippet icon()}
				<AlertTriangle class="w-5 h-5 text-rose-400" />
			{/snippet}
		</StatCard>

		<StatCard
			title="PO Menunggu Persetujuan"
			value="{data.metrics.pendingPOCount} PO"
			subtext="Memerlukan approval Finance Manager"
			variant="amber"
			isPositive={false}
			trend="{data.metrics.pendingPRCount} PR Draft/Pending"
		>
			{#snippet icon()}
				<ShoppingCart class="w-5 h-5 text-amber-400" />
			{/snippet}
		</StatCard>

		<StatCard
			title="Audit 3-Way Matching"
			value="{data.metrics.matchedInvoicesCount} Cocok"
			subtext="Kesesuaian PO, Surat Jalan & Faktur"
			variant="emerald"
			isPositive={true}
			trend="100% Valid"
		>
			{#snippet icon()}
				<Scale class="w-5 h-5 text-emerald-400" />
			{/snippet}
		</StatCard>
	</div>

	<!-- Two Main Actionable Grid Columns -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
		<!-- Left Column: Critical Stock & Reorder Alerts (7 Cols) -->
		<div class="lg:col-span-7 space-y-6">
			<!-- Critical Stock Alert Card -->
			<div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
				<div class="flex items-center justify-between pb-4 border-b border-slate-800">
					<div class="flex items-center gap-2.5">
						<div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
							<ShieldAlert class="w-4 h-4 text-rose-400" />
						</div>
						<div>
							<h3 class="text-sm font-bold text-white">Item Perlu Restock (Automated Alert)</h3>
							<p class="text-xs text-slate-400">Triggered otomatis saat stok $\le$ Minimum Safety Stock</p>
						</div>
					</div>
					<a
						href="/inventory"
						class="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
					>
						Semua Stok <ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>

				<div class="divide-y divide-slate-800/60 mt-3">
					{#each data.lowStockItems as item}
						{@const status = getStockStatus(
							item.inventory?.currentQuantity ?? 0,
							item.inventory?.minimumStock ?? 10,
							item.inventory?.reorderPoint ?? 20
						)}
						<div class="py-3.5 flex items-center justify-between gap-4">
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<span class="text-xs font-mono font-semibold text-slate-400">{item.skuCode}</span>
									<span class="text-xs px-2 py-0.5 rounded-full {status.bgColor} font-semibold">
										{status.label}
									</span>
								</div>
								<p class="text-sm font-bold text-white truncate mt-0.5">{item.name}</p>
								<p class="text-xs text-slate-400 mt-0.5">
									Lokasi: <span class="text-slate-300">{item.inventory?.warehouseLocation}</span> • 
									Harga: <span class="text-slate-300">{formatRupiah(item.unitPrice)}</span>/{item.unit}
								</p>
							</div>

							<div class="text-right shrink-0">
								<div class="text-lg font-black text-rose-400">
									{item.inventory?.currentQuantity} <span class="text-xs font-normal text-slate-400">{item.unit}</span>
								</div>
								<div class="text-[11px] text-slate-400">
									Min: {item.inventory?.minimumStock} {item.unit}
								</div>
								<a
									href="/procurement/requisitions"
									class="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
								>
									Buat PR <ArrowRight class="w-3 h-3" />
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Live Stock Ledger / Movements Audit Trail -->
			<div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
				<div class="flex items-center justify-between pb-4 border-b border-slate-800">
					<div>
						<h3 class="text-sm font-bold text-white">Audit Mutasi Stok Terakhir (Real-Time Ledger)</h3>
						<p class="text-xs text-slate-400">Pencatatan keluar/masuk barang otomatis tanpa manipulasi</p>
					</div>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
						Automated WMS
					</span>
				</div>

				<div class="divide-y divide-slate-800/60 mt-3">
					{#each data.recentMovements as mov}
						<div class="py-3 flex items-start justify-between gap-3">
							<div class="flex items-start gap-3">
								<div
									class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 {mov.type === 'IN' || mov.type === 'RECEIPT'
										? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
										: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}"
								>
									{#if mov.type === 'IN' || mov.type === 'RECEIPT'}
										↓
									{:else}
										↑
									{/if}
								</div>
								<div>
									<p class="text-xs font-bold text-white">
										{mov.inventory?.product?.name ?? 'Item Stok'}
									</p>
									<p class="text-[11px] text-slate-400 mt-0.5">{mov.notes ?? mov.referenceType}</p>
									<p class="text-[10px] text-slate-500 font-mono mt-0.5">
										Oleh: {mov.performedBy} • {formatDate(mov.createdAt)}
									</p>
								</div>
							</div>

							<div class="text-right shrink-0">
								<span
									class="text-xs font-mono font-bold {mov.type === 'IN' || mov.type === 'RECEIPT'
										? 'text-emerald-400'
										: 'text-rose-400'}"
								>
									{mov.type === 'IN' || mov.type === 'RECEIPT' ? '+' : '-'}{mov.quantity}
								</span>
								<div class="text-[10px] text-slate-500">
									Stok: {mov.previousQuantity} → {mov.newQuantity}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right Column: Pending Approvals & 3-Way Match Preview (5 Cols) -->
		<div class="lg:col-span-5 space-y-6">
			<!-- Purchase Orders Waiting Approval -->
			<div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
				<div class="flex items-center justify-between pb-4 border-b border-slate-800">
					<div>
						<h3 class="text-sm font-bold text-white">PO Menunggu Persetujuan Finance</h3>
						<p class="text-xs text-slate-400">Verifikasi batas anggaran & vendor rekanan</p>
					</div>
					<a
						href="/procurement/orders"
						class="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
					>
						Lihat PO <ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>

				<div class="space-y-3 mt-4">
					{#if data.pendingPOs.length === 0}
						<div class="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-950 border border-slate-850">
							Tidak ada pesanan pembelian yang menunggu persetujuan.
						</div>
					{:else}
						{#each data.pendingPOs as po}
							<div
								class="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all"
							>
								<div class="flex items-center justify-between">
									<span class="text-xs font-mono font-bold text-indigo-400">{po.poNumber}</span>
									<Badge status={po.status} />
								</div>
								<div class="mt-2">
									<p class="text-xs text-slate-300 font-semibold">{po.vendor?.companyName}</p>
									<p class="text-sm font-black text-white mt-0.5">{formatRupiah(po.grandTotal)}</p>
									<p class="text-[11px] text-slate-500 mt-0.5">
										Dibuat oleh: {po.creator?.name} • Term: {po.vendor?.paymentTerms}
									</p>
								</div>
								<div class="mt-3 pt-3 border-t border-slate-850 flex items-center justify-between">
									<span class="text-[11px] text-slate-400">
										Estimasi Tiba: {formatDateShort(po.deliveryExpectedDate)}
									</span>
									<a
										href="/procurement/orders"
										class="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
									>
										Review & Approve
									</a>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 3-Way Match Audit Box -->
			<div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
				<div class="flex items-center justify-between pb-4 border-b border-slate-800">
					<div class="flex items-center gap-2">
						<div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
							<Scale class="w-3.5 h-3.5 text-emerald-400" />
						</div>
						<div>
							<h3 class="text-sm font-bold text-white">3-Way Match Reconciliation</h3>
							<p class="text-xs text-slate-400">Pencocokan PO vs Goods Receipt vs Faktur</p>
						</div>
					</div>
					<a
						href="/finance/3-way-match"
						class="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
					>
						Detail <ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>

				<div class="space-y-3 mt-4">
					{#each data.allInvoices as inv}
						<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
							<div class="flex items-center justify-between">
								<span class="text-xs font-mono font-bold text-slate-200">{inv.invoiceNumber}</span>
								<Badge status={inv.status} />
							</div>
							<div class="mt-2 text-xs">
								<div class="flex justify-between text-slate-400">
									<span>Ref Vendor:</span>
									<span class="text-slate-200 font-mono">{inv.vendorInvoiceRef}</span>
								</div>
								<div class="flex justify-between text-slate-400 mt-1">
									<span>Total Tagihan:</span>
									<span class="text-white font-bold">{formatRupiah(inv.amount)}</span>
								</div>
								<div class="flex justify-between text-slate-400 mt-1">
									<span>Kesesuaian:</span>
									<span class="{inv.matchScore === 1 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}">
										{inv.matchScore * 100}% Sesuai
									</span>
								</div>
							</div>
							<p class="text-[11px] text-slate-400 mt-2 bg-slate-900/60 p-2 rounded border border-slate-800/50">
								{inv.matchDiscrepancyNotes}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
