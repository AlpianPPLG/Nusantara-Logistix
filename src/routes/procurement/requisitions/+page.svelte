<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, formatDate } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import {
		FileText,
		Plus,
		ArrowRight,
		CheckCircle2,
		AlertCircle,
		ShieldAlert,
		Building2,
		ShoppingCart,
		Calendar
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isCreateModalOpen = $state(false);
	let isConvertModalOpen = $state(false);
	let selectedPRForConvert = $state<(typeof data.requisitions)[0] | null>(null);

	function openConvertModal(pr: (typeof data.requisitions)[0]) {
		selectedPRForConvert = pr;
		isConvertModalOpen = true;
	}
</script>

<div class="space-y-6 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">Purchase Requisition (PR)</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
					{data.requisitions.length} Pengajuan
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Daftar permintaan pengadaan barang dari staf gudang sebelum diterbitkan menjadi Purchase Order (PO).
			</p>
		</div>

		<button
			type="button"
			onclick={() => (isCreateModalOpen = true)}
			class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
		>
			<Plus class="w-4 h-4" />
			Ajukan PR Baru
		</button>
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

	<!-- PR Table -->
	<div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						<th class="py-3 px-4">No. PR & Prioritas</th>
						<th class="py-3 px-4">Item Diminta</th>
						<th class="py-3 px-4">Diajukan Oleh</th>
						<th class="py-3 px-4">Estimasi Total Biaya</th>
						<th class="py-3 px-4">Status</th>
						<th class="py-3 px-4 text-right">Aksi Konversi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60 text-xs">
					{#if data.requisitions.length === 0}
						<tr>
							<td colspan="6" class="py-12 text-center text-slate-500">
								Belum ada pengajuan Purchase Requisition.
							</td>
						</tr>
					{:else}
						{#each data.requisitions as pr}
							<tr class="hover:bg-slate-800/40 transition-colors">
								<!-- PR No & Priority -->
								<td class="py-4 px-4">
									<div class="flex items-center gap-2">
										<span class="font-mono font-bold text-sm text-indigo-400">{pr.prNumber}</span>
										<span
											class="text-[10px] font-bold px-2 py-0.5 rounded uppercase {pr.priority ===
											'HIGH' || pr.priority === 'CRITICAL'
												? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
												: 'bg-slate-800 text-slate-300'}"
										>
											{pr.priority}
										</span>
									</div>
									<p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
										<Calendar class="w-3 h-3" /> {formatDate(pr.createdAt)}
									</p>
								</td>

								<!-- Requested Items -->
								<td class="py-4 px-4">
									{#if pr.items && pr.items.length > 0}
										<div class="space-y-1">
											{#each pr.items as item}
												<div class="text-white font-medium">
													• {item.product?.name ?? 'Item'}
													<span class="font-mono text-indigo-400 font-bold ml-1">
														({item.requestedQty} {item.product?.unit})
													</span>
												</div>
											{/each}
										</div>
									{:else}
										<span class="text-slate-500">-</span>
									{/if}
									{#if pr.notes}
										<p class="text-[11px] text-slate-400 italic mt-1 bg-slate-950/60 p-1.5 rounded">
											"{pr.notes}"
										</p>
									{/if}
								</td>

								<!-- Requester -->
								<td class="py-4 px-4">
									<p class="text-white font-semibold">{pr.requester?.name ?? 'Staf Gudang'}</p>
									<p class="text-[11px] text-slate-400">{pr.department}</p>
								</td>

								<!-- Total Estimated -->
								<td class="py-4 px-4">
									<p class="font-bold text-white text-sm">
										{formatRupiah(pr.totalEstimatedAmount)}
									</p>
								</td>

								<!-- Status -->
								<td class="py-4 px-4">
									<Badge status={pr.status} />
								</td>

								<!-- Action -->
								<td class="py-4 px-4 text-right">
									{#if pr.status === 'PENDING'}
										<button
											type="button"
											onclick={() => openConvertModal(pr)}
											class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-md shadow-indigo-600/30 transition-all"
										>
											<ShoppingCart class="w-3.5 h-3.5" />
											Konversi ke PO
										</button>
									{:else if pr.status === 'CONVERTED'}
										<span class="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1 font-semibold">
											<CheckCircle2 class="w-3.5 h-3.5" /> PO Diterbitkan
										</span>
									{:else}
										<span class="text-slate-500 text-xs">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal 1: Ajukan PR Baru -->
<Modal
	open={isCreateModalOpen}
	title="Buat Purchase Requisition (PR)"
	description="Staf Gudang mengajukan permintaan pengadaan bahan atau restock stok yang menipis."
	onClose={() => (isCreateModalOpen = false)}
>
	<form method="POST" action="?/createPR" class="space-y-4">
		<input type="hidden" name="requestedBy" value={roleStore.currentUser.id} />

		<div>
			<label for="pr-product" class="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Produk / Material</label>
			<select
				id="pr-product"
				name="productId"
				required
				class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
			>
				<option value="">-- Pilih Barang --</option>
				{#each data.products as prod}
					<option value={prod.id}>
						[{prod.skuCode}] {prod.name} (Sisa Stok: {prod.inventory?.currentQuantity} {prod.unit})
					</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="pr-qty" class="block text-xs font-semibold text-slate-300 mb-1.5">Jumlah yang Diminta</label>
				<input
					id="pr-qty"
					type="number"
					name="requestedQty"
					min="1"
					required
					placeholder="Contoh: 20"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>
			<div>
				<label for="pr-priority" class="block text-xs font-semibold text-slate-300 mb-1.5">Tingkat Urgensi</label>
				<select
					id="pr-priority"
					name="priority"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				>
					<option value="NORMAL">Normal</option>
					<option value="MEDIUM">Medium</option>
					<option value="HIGH">High (Mendesak)</option>
					<option value="CRITICAL">Critical (Jalur Stop)</option>
				</select>
			</div>
		</div>

		<div>
			<label for="pr-notes" class="block text-xs font-semibold text-slate-300 mb-1.5">Alasan Permintaan / Keterangan</label>
			<textarea
				id="pr-notes"
				name="notes"
				rows="3"
				placeholder="Contoh: Stok di gudang sudah melewati batas reorder point untuk produksi Q4"
				class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
			></textarea>
		</div>

		<div class="pt-2 flex justify-end gap-2 border-t border-slate-800">
			<button
				type="button"
				onclick={() => (isCreateModalOpen = false)}
				class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
			>
				Batal
			</button>
			<button
				type="submit"
				class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
			>
				Kirim Permintaan (PR)
			</button>
		</div>
	</form>
</Modal>

<!-- Modal 2: Konversi PR ke Purchase Order (PO) -->
<Modal
	open={isConvertModalOpen}
	title="Konversi {selectedPRForConvert?.prNumber ?? ''} ke Purchase Order (PO)"
	description="Pilih vendor pemasok rekanan untuk menerbitkan PO resmi dari PR ini."
	onClose={() => (isConvertModalOpen = false)}
>
	{#if selectedPRForConvert}
		<form method="POST" action="?/convertToPO" class="space-y-4">
			<input type="hidden" name="prId" value={selectedPRForConvert.id} />
			<input type="hidden" name="createdBy" value={roleStore.currentUser.id} />

			<div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
				<div class="flex justify-between">
					<span class="text-slate-400">Pengaju:</span>
					<span class="text-white font-medium">{selectedPRForConvert.requester?.name}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-slate-400">Estimasi Nilai:</span>
					<span class="text-indigo-400 font-bold">
						{formatRupiah(selectedPRForConvert.totalEstimatedAmount)}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="text-slate-400">PPN 11% (Otomatis):</span>
					<span class="text-slate-300">
						{formatRupiah(Math.round(selectedPRForConvert.totalEstimatedAmount * 0.11))}
					</span>
				</div>
			</div>

			<div>
				<label for="po-vendor" class="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Vendor Rekanan Resmi</label>
				<select
					id="po-vendor"
					name="vendorId"
					required
					class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				>
					<option value="">-- Pilih Vendor --</option>
					{#each data.vendors as v}
						<option value={v.id}>
							[{v.code}] {v.companyName} (Rating: ⭐{v.rating} • Term: {v.paymentTerms})
						</option>
					{/each}
				</select>
			</div>

			<div class="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-[11px]">
				💡 PO yang dibuat akan berstatus <strong>PENDING_APPROVAL</strong> dan diteruskan ke <strong>Finance Manager</strong> untuk disetujui anggarannya sebelum dikirim ke vendor.
			</div>

			<div class="pt-2 flex justify-end gap-2 border-t border-slate-800">
				<button
					type="button"
					onclick={() => (isConvertModalOpen = false)}
					class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
				>
					Batal
				</button>
				<button
					type="submit"
					class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
				>
					Terbitkan PO Sekarang
				</button>
			</div>
		</form>
	{/if}
</Modal>
