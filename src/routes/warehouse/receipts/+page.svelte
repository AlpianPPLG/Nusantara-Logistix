<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, formatDate, formatDateShort } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import {
		PackageCheck,
		Truck,
		CheckCircle2,
		ShieldAlert,
		Calendar,
		ArrowRight,
		FileCheck,
		Boxes
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isReceiptModalOpen = $state(false);
	let selectedPOForReceipt = $state<(typeof data.eligiblePOs)[0] | null>(null);

	function openReceiptModal(po: (typeof data.eligiblePOs)[0]) {
		selectedPOForReceipt = po;
		isReceiptModalOpen = true;
	}
</script>

<div class="space-y-8 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">
					Penerimaan Barang (Goods Receipt)
				</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
					{data.receipts.length} Penerimaan Tercatat
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Verifikasi fisik kiriman vendor terhadap PO resmi dan Surat Jalan. Stok inventori akan bertambah otomatis begitu diverifikasi.
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
				<ShieldAlert class="w-5 h-5 text-rose-400 shrink-0" />
			{/if}
			<p class="text-xs font-semibold">{form.message}</p>
		</div>
	{/if}

	<!-- Section 1: Eligible POs (Waiting for delivery receipt in warehouse) -->
	<div class="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
		<div class="flex items-center justify-between pb-3 border-b border-slate-800">
			<div class="flex items-center gap-2.5">
				<div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
					<Truck class="w-4 h-4 text-amber-400" />
				</div>
				<div>
					<h3 class="text-sm font-bold text-white">Pesanan Masuk Siap Diterima (Inbound PO)</h3>
					<p class="text-xs text-slate-400">PO yang telah disetujui Finance & siap diverifikasi fisiknya oleh tim Gudang</p>
				</div>
			</div>
			<span class="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
				{data.eligiblePOs.length} Menunggu Penerimaan
			</span>
		</div>

		{#if data.eligiblePOs.length === 0}
			<div class="py-8 text-center text-slate-500 text-xs">
				Tidak ada kiriman PO yang sedang menunggu penerimaan fisik saat ini.
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
				{#each data.eligiblePOs as po}
					<div
						class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
					>
						<div class="flex items-center justify-between">
							<span class="font-mono font-bold text-indigo-400 text-sm">{po.poNumber}</span>
							<Badge status={po.status} />
						</div>

						<div>
							<p class="text-xs text-slate-400">Vendor: <span class="text-white font-bold">{po.vendor?.companyName}</span></p>
							<p class="text-xs text-slate-400 mt-1">Estimasi Tiba: <span class="text-slate-200">{formatDateShort(po.deliveryExpectedDate)}</span></p>
						</div>

						<div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs space-y-1">
							{#each po.items as item}
								<div class="flex justify-between text-slate-300">
									<span class="truncate mr-2">• {item.product?.name}</span>
									<span class="font-mono font-bold text-white shrink-0">{item.quantity} {item.product?.unit}</span>
								</div>
							{/each}
						</div>

						<div class="pt-2 flex justify-between items-center">
							<span class="text-xs font-black text-emerald-400 font-mono">
								{formatRupiah(po.grandTotal)}
							</span>

							<button
								type="button"
								onclick={() => openReceiptModal(po)}
								class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
							>
								<PackageCheck class="w-4 h-4" />
								Input Penerimaan (GR)
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Section 2: Historical Goods Receipts Table -->
	<div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
		<div class="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<FileCheck class="w-4 h-4 text-emerald-400" />
				<h3 class="text-sm font-bold text-white">Riwayat Dokumen Penerimaan Barang (Goods Receipts)</h3>
			</div>
			<span class="text-xs text-slate-500 font-mono">Auto Stock Increments</span>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse text-xs">
				<thead>
					<tr class="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						<th class="py-3 px-4">No. GR & Surat Jalan</th>
						<th class="py-3 px-4">Referensi PO & Vendor</th>
						<th class="py-3 px-4">Item Diterima & Disetujui</th>
						<th class="py-3 px-4">Pemeriksa (Gudang)</th>
						<th class="py-3 px-4">Tanggal Terima</th>
						<th class="py-3 px-4 text-right">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60">
					{#if data.receipts.length === 0}
						<tr>
							<td colspan="6" class="py-10 text-center text-slate-500">
								Belum ada riwayat penerimaan barang.
							</td>
						</tr>
					{:else}
						{#each data.receipts as gr}
							<tr class="hover:bg-slate-800/40 transition-colors">
								<!-- No GR & Surat Jalan -->
								<td class="py-3.5 px-4">
									<span class="font-mono font-bold text-emerald-400">{gr.grNumber}</span>
									<p class="text-[11px] text-slate-400 mt-0.5">
										No. SJ: <span class="font-mono text-white font-semibold">{gr.deliveryNoteNumber}</span>
									</p>
								</td>

								<!-- PO & Vendor -->
								<td class="py-3.5 px-4">
									<span class="font-mono font-bold text-slate-200">{gr.po?.poNumber}</span>
									<p class="text-[11px] text-slate-400 mt-0.5">{gr.po?.vendor?.companyName}</p>
								</td>

								<!-- Items Received -->
								<td class="py-3.5 px-4">
									<div class="space-y-1">
										{#each gr.items ?? [] as item}
											<div class="text-white font-medium">
												• {item.product?.name}
												<span class="font-mono text-emerald-400 font-bold ml-1">
													({item.acceptedQty} {item.product?.unit})
												</span>
											</div>
										{/each}
									</div>
									{#if gr.notes}
										<p class="text-[11px] text-slate-500 mt-1 italic">"{gr.notes}"</p>
									{/if}
								</td>

								<!-- Receiver -->
								<td class="py-3.5 px-4">
									<p class="text-white font-semibold">{gr.receiver?.name ?? 'Staf Gudang'}</p>
									<p class="text-[11px] text-slate-500">{gr.receiver?.role}</p>
								</td>

								<!-- Date -->
								<td class="py-3.5 px-4 font-mono text-slate-300">
									{formatDate(gr.receivedDate)}
								</td>

								<!-- Status -->
								<td class="py-3.5 px-4 text-right">
									<Badge status={gr.status} />
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal Penerimaan Barang -->
<Modal
	open={isReceiptModalOpen}
	title="Verifikasi Penerimaan: {selectedPOForReceipt?.poNumber ?? ''}"
	description="Input Nomor Surat Jalan vendor, periksa jumlah barang fisik, dan setujui untuk memperbarui stok gudang."
	onClose={() => (isReceiptModalOpen = false)}
>
	{#if selectedPOForReceipt}
		<form method="POST" action="?/submitReceipt" class="space-y-4">
			<input type="hidden" name="poId" value={selectedPOForReceipt.id} />
			<input type="hidden" name="receivedBy" value={roleStore.currentUser.id} />

			<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
				<div class="flex justify-between">
					<span class="text-slate-400">Vendor:</span>
					<span class="text-white font-bold">{selectedPOForReceipt.vendor?.companyName}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-slate-400">Total Nilai PO:</span>
					<span class="text-emerald-400 font-bold">{formatRupiah(selectedPOForReceipt.grandTotal)}</span>
				</div>
			</div>

			<!-- Surat Jalan Input -->
			<div>
				<label for="gr-delivery-note" class="block text-xs font-semibold text-slate-300 mb-1.5">
					Nomor Surat Jalan Vendor (Wajib Tertera di Fisik)
				</label>
				<input
					id="gr-delivery-note"
					type="text"
					name="deliveryNoteNumber"
					required
					placeholder="Contoh: SJ-2026/MEJ/X/9921"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
				/>
			</div>

			<!-- Item Inspection Checklist -->
			<div>
				<div class="block text-xs font-semibold text-slate-300 mb-1.5">
					Daftar Barang yang Diterima
				</div>
				<div class="p-3 rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-850 text-xs">
					{#each selectedPOForReceipt.items as item}
						<div class="py-2 flex items-center justify-between">
							<div>
								<p class="text-white font-medium">{item.product?.name}</p>
								<p class="text-slate-500 text-[11px] font-mono">
									Lokasi Rak: {item.product?.inventory?.warehouseLocation}
								</p>
							</div>
							<div class="text-right">
								<span class="font-mono font-bold text-emerald-400 text-sm">
									{item.quantity} {item.product?.unit}
								</span>
								<p class="text-[10px] text-slate-500">Kondisi: Baik & Utuh</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Notes -->
			<div>
				<label for="gr-notes" class="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Hasil Pemeriksaan Fisik</label>
				<input
					id="gr-notes"
					type="text"
					name="notes"
					value="Semua barang telah dihitung fisik dan diverifikasi dalam kondisi prima."
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>

			<div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px]">
				⚡ <strong>Efek Otomatis Sistem:</strong> Begitu tombol di bawah ditekan, saldo stok produk terkait di katalog gudang akan <strong>otomatis bertambah</strong> secara riil, mutasi dicatat di ledger, dan faktur 3-Way Match disiapkan untuk Finance.
			</div>

			<div class="pt-2 flex justify-end gap-2 border-t border-slate-800">
				<button
					type="button"
					onclick={() => (isReceiptModalOpen = false)}
					class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
				>
					Batal
				</button>
				<button
					type="submit"
					class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
				>
					Verifikasi & Tambah Stok
				</button>
			</div>
		</form>
	{/if}
</Modal>
