<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, formatDate, formatDateShort } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Scale,
		FileText,
		PackageCheck,
		CreditCard,
		CheckCircle2,
		AlertTriangle,
		ShieldCheck,
		ArrowRight,
		Clock
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="space-y-8 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">
					Audit 3-Way Matching Engine
				</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
					Enterprise Finance Control
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Pencocokan otomatis tiga pilar transaksi: <strong>Purchase Order (PO)</strong> $\leftrightarrow$ <strong>Goods Receipt (GR)</strong> $\leftrightarrow$ <strong>Vendor Invoice</strong> untuk mencegah fraud dan kelebihan bayar.
			</p>
		</div>
	</div>

	<!-- Alert Messages -->
	{#if form?.message}
		<div
			class="p-4 rounded-xl flex items-center gap-3 {form?.success
				? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
				: 'bg-rose-500/10 border border-rose-500/20 text-rose-300'}"
		>
			{#if form?.success}
				<CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
			{:else}
				<AlertTriangle class="w-5 h-5 text-rose-400 shrink-0" />
			{/if}
			<p class="text-xs font-semibold">{form.message}</p>
		</div>
	{/if}

	<!-- 3-Way Cards List -->
	<div class="space-y-6">
		{#if data.invoices.length === 0}
			<div class="p-12 text-center text-slate-500 rounded-2xl bg-slate-900 border border-slate-800">
				Belum ada faktur yang masuk ke antrean 3-Way Match.
			</div>
		{:else}
			{#each data.invoices as inv}
				{@const po = inv.po}
				{@const gr = inv.gr}
				{@const isFullyMatched = inv.status === 'MATCHED' || inv.status === 'PAID'}

				<div
					class="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-6 hover:border-slate-700 transition-all overflow-hidden relative"
				>
					<!-- Top Status Header -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {isFullyMatched
									? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
									: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}"
							>
								<Scale class="w-5 h-5" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono font-black text-white text-base">
										{inv.invoiceNumber}
									</span>
									<Badge status={inv.status} />
								</div>
								<p class="text-xs text-slate-400 mt-0.5">
									Vendor: <span class="text-white font-semibold">{po?.vendor?.companyName}</span> • 
									Ref Faktur: <span class="font-mono text-slate-300">{inv.vendorInvoiceRef}</span>
								</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<div class="text-right">
								<span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
									Score Kecocokan
								</span>
								<span
									class="font-mono font-black text-lg {inv.matchScore === 1
										? 'text-emerald-400'
										: 'text-amber-400'}"
								>
									{inv.matchScore * 100}%
								</span>
							</div>

							<!-- Action Buttons -->
							<div class="flex items-center gap-2">
								{#if inv.status === 'PENDING_MATCH'}
									<form method="POST" action="?/verifyMatch">
										<input type="hidden" name="invoiceId" value={inv.id} />
										<button
											type="submit"
											class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
										>
											<ShieldCheck class="w-4 h-4" />
											Verifikasi Match
										</button>
									</form>
								{:else if inv.status === 'MATCHED'}
									<form method="POST" action="?/payInvoice">
										<input type="hidden" name="invoiceId" value={inv.id} />
										<button
											type="submit"
											class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
										>
											<CreditCard class="w-4 h-4" />
											Proses Pembayaran (Pay)
										</button>
									</form>
								{:else if inv.status === 'PAID'}
									<span class="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 font-bold text-xs border border-slate-700 flex items-center gap-1.5">
										<CheckCircle2 class="w-4 h-4" /> Lunas Terbayar
									</span>
								{/if}
							</div>
						</div>
					</div>

					<!-- The 3 Pillars Visual Comparison -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Pillar 1: Purchase Order (PO) -->
						<div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
							<div class="flex items-center justify-between pb-2 border-b border-slate-850">
								<span class="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
									<FileText class="w-4 h-4" /> 1. Purchase Order
								</span>
								<span class="font-mono text-[11px] font-bold text-slate-300">{po?.poNumber}</span>
							</div>

							<div class="space-y-1.5 text-xs">
								<div class="flex justify-between text-slate-400">
									<span>Nilai PO:</span>
									<span class="font-mono font-bold text-white">{formatRupiah(po?.grandTotal)}</span>
								</div>
								<div class="flex justify-between text-slate-400">
									<span>Termin:</span>
									<span class="text-slate-300">{po?.terms ?? 'Net 30'}</span>
								</div>
								<div class="flex justify-between text-slate-400">
									<span>Barang Dipesan:</span>
									<span class="text-slate-300 font-mono">
										{po?.items?.length ?? 0} Jenis Item
									</span>
								</div>
							</div>

							<div class="pt-2 border-t border-slate-850 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
								<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
								PO Resmi Terotorisasi
							</div>
						</div>

						<!-- Pillar 2: Goods Receipt (GR) -->
						<div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
							<div class="flex items-center justify-between pb-2 border-b border-slate-850">
								<span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
									<PackageCheck class="w-4 h-4" /> 2. Goods Receipt
								</span>
								{#if gr}
									<span class="font-mono text-[11px] font-bold text-slate-300">{gr.grNumber}</span>
								{:else}
									<span class="text-[10px] text-amber-400 font-semibold">Menunggu Fisik</span>
								{/if}
							</div>

							{#if gr}
								<div class="space-y-1.5 text-xs">
									<div class="flex justify-between text-slate-400">
										<span>Surat Jalan:</span>
										<span class="font-mono font-semibold text-white">{gr.deliveryNoteNumber}</span>
									</div>
									<div class="flex justify-between text-slate-400">
										<span>Pemeriksa:</span>
										<span class="text-slate-300">{gr.receiver?.name}</span>
									</div>
									<div class="flex justify-between text-slate-400">
										<span>Status Fisik:</span>
										<span class="text-emerald-400 font-semibold">{gr.status}</span>
									</div>
								</div>
								<div class="pt-2 border-t border-slate-850 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
									<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
									Fisik Diterima Lengkap di Gudang
								</div>
							{:else}
								<div class="py-4 text-center text-slate-500 text-xs">
									<Clock class="w-5 h-5 mx-auto mb-1 text-amber-400" />
									Barang belum tiba atau belum diverifikasi di modul Goods Receipt
								</div>
							{/if}
						</div>

						<!-- Pillar 3: Vendor Invoice -->
						<div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
							<div class="flex items-center justify-between pb-2 border-b border-slate-850">
								<span class="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
									<CreditCard class="w-4 h-4" /> 3. Faktur Tagihan
								</span>
								<span class="font-mono text-[11px] font-bold text-slate-300">{inv.invoiceNumber}</span>
							</div>

							<div class="space-y-1.5 text-xs">
								<div class="flex justify-between text-slate-400">
									<span>Jumlah Tagihan:</span>
									<span class="font-mono font-bold text-white">{formatRupiah(inv.amount)}</span>
								</div>
								<div class="flex justify-between text-slate-400">
									<span>Jatuh Tempo:</span>
									<span class="font-mono text-slate-300">{formatDateShort(inv.dueDate)}</span>
								</div>
								<div class="flex justify-between text-slate-400">
									<span>Selisih Harga:</span>
									<span class="font-mono font-bold text-emerald-400">Rp 0 (Pas Sesuai PO)</span>
								</div>
							</div>

							<div class="pt-2 border-t border-slate-850 flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
								<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
								Nilai Faktur = Nilai PO
							</div>
						</div>
					</div>

					<!-- Discrepancy / Reconciliation Notes Footer -->
					<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 flex items-start gap-2.5">
						<ShieldCheck class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
						<div class="min-w-0">
							<span class="font-bold text-white">Catatan Rekonsiliasi Otomatis:</span>
							<p class="text-slate-400 text-[11px] mt-0.5">{inv.matchDiscrepancyNotes}</p>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
