<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, formatDate, formatDateShort } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		ShoppingCart,
		Building2,
		CheckCircle2,
		XCircle,
		Send,
		ShieldCheck,
		FileText,
		Calendar,
		ArrowRight
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="space-y-6 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">Purchase Orders (PO)</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
					{data.orders.length} Dokumen PO
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Surat pesanan resmi ke vendor. Wajib disetujui oleh Finance Manager sebelum diteruskan ke vendor.
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
				<XCircle class="w-5 h-5 text-rose-400 shrink-0" />
			{/if}
			<p class="text-xs font-semibold">{form.message}</p>
		</div>
	{/if}

	<!-- Orders Grid / List -->
	<div class="space-y-4">
		{#if data.orders.length === 0}
			<div class="p-12 text-center text-slate-500 rounded-2xl bg-slate-900 border border-slate-800">
				Belum ada Purchase Order yang diterbitkan.
			</div>
		{:else}
			{#each data.orders as po}
				<div
					class="rounded-2xl bg-slate-900 border border-slate-800 p-5 md:p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
				>
					<!-- PO Header Bar -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
								<ShoppingCart class="w-5 h-5 text-indigo-400" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono font-black text-base text-white">{po.poNumber}</span>
									<Badge status={po.status} />
								</div>
								<p class="text-xs text-slate-400 mt-0.5">
									Dibuat: <span class="text-slate-300">{formatDate(po.createdAt)}</span> • 
									Oleh: <span class="text-slate-300 font-semibold">{po.creator?.name}</span>
								</p>
							</div>
						</div>

						<div class="text-left sm:text-right">
							<span class="text-xs text-slate-400 block">Total Pesanan (Inc. PPN 11%)</span>
							<span class="text-xl font-black text-emerald-400 font-mono tracking-tight">
								{formatRupiah(po.grandTotal)}
							</span>
						</div>
					</div>

					<!-- Details Grid: Vendor & Terms -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 text-xs">
						<div>
							<span class="text-slate-500 flex items-center gap-1 font-semibold uppercase text-[10px]">
								<Building2 class="w-3.5 h-3.5 text-indigo-400" />
								Vendor Pemasok
							</span>
							<p class="text-white font-bold mt-1">{po.vendor?.companyName}</p>
							<p class="text-slate-400 text-[11px] mt-0.5">{po.vendor?.contactEmail}</p>
						</div>

						<div>
							<span class="text-slate-500 flex items-center gap-1 font-semibold uppercase text-[10px]">
								<Calendar class="w-3.5 h-3.5 text-amber-400" />
								Estimasi Tiba & Termin
							</span>
							<p class="text-white font-bold mt-1">
								{formatDateShort(po.deliveryExpectedDate)}
							</p>
							<p class="text-slate-400 text-[11px] mt-0.5">Term: {po.terms}</p>
						</div>

						<div>
							<span class="text-slate-500 flex items-center gap-1 font-semibold uppercase text-[10px]">
								<ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
								Status Approval
							</span>
							{#if po.approvedBy}
								<p class="text-emerald-400 font-bold mt-1">
									Disetujui oleh: {po.approver?.name}
								</p>
								<p class="text-slate-400 text-[11px] mt-0.5">{formatDate(po.approvedAt)}</p>
							{:else}
								<p class="text-amber-400 font-bold mt-1">Menunggu Review Finance</p>
								<p class="text-slate-500 text-[11px] mt-0.5">Memerlukan otorisasi pembayaran</p>
							{/if}
						</div>
					</div>

					<!-- Items Table -->
					<div class="overflow-x-auto rounded-xl border border-slate-800">
						<table class="w-full text-left text-xs">
							<thead class="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold">
								<tr>
									<th class="py-2.5 px-3">Produk / Barang</th>
									<th class="py-2.5 px-3 text-center">Jumlah Dipesan</th>
									<th class="py-2.5 px-3 text-right">Harga Satuan</th>
									<th class="py-2.5 px-3 text-right">Subtotal</th>
									<th class="py-2.5 px-3 text-center">Diterima Gudang</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-800/60">
								{#each po.items ?? [] as item}
									<tr>
										<td class="py-2.5 px-3 font-medium text-white">
											{item.product?.name}
											<span class="text-slate-500 font-mono ml-1">({item.product?.skuCode})</span>
										</td>
										<td class="py-2.5 px-3 text-center font-mono font-bold text-slate-200">
											{item.quantity} {item.product?.unit}
										</td>
										<td class="py-2.5 px-3 text-right font-mono text-slate-300">
											{formatRupiah(item.unitPrice)}
										</td>
										<td class="py-2.5 px-3 text-right font-mono font-bold text-white">
											{formatRupiah(item.totalPrice)}
										</td>
										<td class="py-2.5 px-3 text-center font-mono">
											<span class="{item.receivedQty >= item.quantity ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
												{item.receivedQty} / {item.quantity}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Bottom Action Toolbar -->
					<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
						<div class="text-[11px] text-slate-500">
							Subtotal: <span class="text-slate-300 font-mono">{formatRupiah(po.subtotal)}</span> • PPN 11%: <span class="text-slate-300 font-mono">{formatRupiah(po.taxAmount)}</span>
						</div>

						<div class="flex items-center gap-2">
							{#if po.status === 'PENDING_APPROVAL'}
								<!-- Reject Form -->
								<form method="POST" action="?/rejectPO">
									<input type="hidden" name="poId" value={po.id} />
									<button
										type="submit"
										class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
									>
										<XCircle class="w-3.5 h-3.5" />
										Tolak PO
									</button>
								</form>

								<!-- Approve Form -->
								<form method="POST" action="?/approvePO">
									<input type="hidden" name="poId" value={po.id} />
									<input type="hidden" name="approvedBy" value={roleStore.currentUser.id} />
									<button
										type="submit"
										class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
									>
										<CheckCircle2 class="w-3.5 h-3.5" />
										Setujui PO (Finance Approval)
									</button>
								</form>
							{:else if po.status === 'APPROVED'}
								<form method="POST" action="?/sendToVendor">
									<input type="hidden" name="poId" value={po.id} />
									<button
										type="submit"
										class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
									>
										<Send class="w-3.5 h-3.5" />
										Kirim PO ke Vendor
									</button>
								</form>
							{:else if po.status === 'SENT'}
								<a
									href="/warehouse/receipts"
									class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
								>
									Barang Dikirim Vendor → Cek Penerimaan Gudang <ArrowRight class="w-3.5 h-3.5" />
								</a>
							{:else if po.status === 'COMPLETED'}
								<span class="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
									<CheckCircle2 class="w-4 h-4" /> Transaksi Tuntas & Diterima Lengkap
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
