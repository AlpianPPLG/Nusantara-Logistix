<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { roleStore } from '$lib/stores/role.svelte';
	import { formatRupiah, getStockStatus } from '$lib/utils/format';
	import Modal from '$lib/components/ui/Modal.svelte';
	import {
		Search,
		Plus,
		Filter,
		SlidersHorizontal,
		ArrowUpDown,
		Package,
		Boxes,
		ShieldAlert,
		CheckCircle2,
		X
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Reactive filtering state using Svelte 5 Runes
	let searchQuery = $state('');
	let selectedCategory = $state('ALL');
	let stockFilter = $state<'ALL' | 'LOW' | 'NORMAL'>('ALL');

	// Modal states
	let isAdjustModalOpen = $state(false);
	let selectedProductForAdjust = $state<(typeof data.products)[0] | null>(null);
	let isAddProductModalOpen = $state(false);

	let filteredProducts = $derived(
		data.products.filter((p: (typeof data.products)[0]) => {
			const matchesSearch =
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.inventory?.warehouseLocation ?? '').toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === 'ALL' || p.categoryId === selectedCategory;

			const currentQty = p.inventory?.currentQuantity ?? 0;
			const minStock = p.inventory?.minimumStock ?? 10;
			const isLow = currentQty <= minStock;

			const matchesStock =
				stockFilter === 'ALL' ||
				(stockFilter === 'LOW' && isLow) ||
				(stockFilter === 'NORMAL' && !isLow);

			return matchesSearch && matchesCategory && matchesStock;
		})
	);

	function openAdjustModal(product: (typeof data.products)[0]) {
		selectedProductForAdjust = product;
		isAdjustModalOpen = true;
	}
</script>

<div class="space-y-6 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">Katalog & Stok Gudang</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
					{data.products.length} SKU
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Pemantauan inventori multi-lokasi rak, reorder point, dan safety stock secara real-time.
			</p>
		</div>

		{#if roleStore.currentRole === 'warehouse' || roleStore.currentRole === 'admin'}
			<button
				type="button"
				onclick={() => (isAddProductModalOpen = true)}
				class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all shrink-0"
			>
				<Plus class="w-4 h-4" />
				Tambah Master Barang
			</button>
		{/if}
	</div>

	<!-- Success or Error Feedback Alert -->
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

	<!-- Search & Filter Controls -->
	<div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3">
		<!-- Search input -->
		<div class="relative flex-1">
			<Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari SKU, Nama Barang, atau Lokasi Rak Gudang..."
				class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
			/>
		</div>

		<!-- Category Filter -->
		<div class="w-full md:w-56">
			<select
				bind:value={selectedCategory}
				class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
			>
				<option value="ALL">Semua Kategori</option>
				{#each data.categories as cat}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
		</div>

		<!-- Health status pills -->
		<div class="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
			<button
				type="button"
				onclick={() => (stockFilter = 'ALL')}
				class="px-3 py-1 rounded-lg text-xs font-semibold transition-all {stockFilter === 'ALL'
					? 'bg-indigo-600 text-white shadow'
					: 'text-slate-400 hover:text-slate-200'}"
			>
				Semua
			</button>
			<button
				type="button"
				onclick={() => (stockFilter = 'LOW')}
				class="px-3 py-1 rounded-lg text-xs font-semibold transition-all {stockFilter === 'LOW'
					? 'bg-rose-500 text-white shadow'
					: 'text-slate-400 hover:text-slate-200'}"
			>
				⚠️ Kritis / Low
			</button>
			<button
				type="button"
				onclick={() => (stockFilter = 'NORMAL')}
				class="px-3 py-1 rounded-lg text-xs font-semibold transition-all {stockFilter === 'NORMAL'
					? 'bg-emerald-600 text-white shadow'
					: 'text-slate-400 hover:text-slate-200'}"
			>
				Aman
			</button>
		</div>
	</div>

	<!-- Products Table -->
	<div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						<th class="py-3 px-4">Barang & SKU</th>
						<th class="py-3 px-4">Kategori</th>
						<th class="py-3 px-4">Lokasi Rak</th>
						<th class="py-3 px-4">Harga Satuan</th>
						<th class="py-3 px-4 text-center">Stok / Buffer Level</th>
						<th class="py-3 px-4">Status</th>
						<th class="py-3 px-4 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60 text-xs">
					{#if filteredProducts.length === 0}
						<tr>
							<td colspan="7" class="py-12 text-center text-slate-500">
								Tidak ada data barang yang sesuai dengan kriteria pencarian.
							</td>
						</tr>
					{:else}
						{#each filteredProducts as product}
							{@const inv = product.inventory}
							{@const currentQty = inv?.currentQuantity ?? 0}
							{@const minStock = inv?.minimumStock ?? 10}
							{@const reorderPoint = inv?.reorderPoint ?? 20}
							{@const maxStock = inv?.maximumStock ?? 200}
							{@const status = getStockStatus(currentQty, minStock, reorderPoint)}
							{@const percent = Math.min(100, Math.round((currentQty / maxStock) * 100))}

							<tr class="hover:bg-slate-800/40 transition-colors">
								<!-- Product & SKU -->
								<td class="py-3.5 px-4">
									<div class="flex items-center gap-3">
										<div
											class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden"
										>
											{#if product.imageUrl}
												<img
													src={product.imageUrl}
													alt={product.name}
													class="w-full h-full object-cover"
												/>
											{:else}
												<Package class="w-5 h-5 text-slate-400" />
											{/if}
										</div>
										<div class="min-w-0">
											<p class="font-bold text-white tracking-tight">{product.name}</p>
											<p class="font-mono text-[11px] text-slate-400">{product.skuCode}</p>
										</div>
									</div>
								</td>

								<!-- Category -->
								<td class="py-3.5 px-4">
									<span class="text-slate-300 font-medium">
										{product.category?.name ?? 'Umum'}
									</span>
								</td>

								<!-- Location -->
								<td class="py-3.5 px-4 font-mono text-slate-300">
									{inv?.warehouseLocation ?? '-'}
								</td>

								<!-- Unit Price -->
								<td class="py-3.5 px-4 font-bold text-slate-200">
									{formatRupiah(product.unitPrice)}
									<span class="text-[10px] text-slate-500 font-normal">/{product.unit}</span>
								</td>

								<!-- Stock & Visual Progress -->
								<td class="py-3.5 px-4 text-center min-w-44">
									<div class="inline-block text-left w-full max-w-[160px]">
										<div class="flex items-baseline justify-between mb-1">
											<span class="font-mono font-black text-sm {status.color}">
												{currentQty} <span class="text-[10px] font-normal text-slate-400">{product.unit}</span>
											</span>
											<span class="text-[10px] text-slate-500 font-mono">
												Min: {minStock}
											</span>
										</div>
										<!-- Mini Bar -->
										<div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
											<div
												class="h-full rounded-full transition-all duration-500 {status.isCritical
													? 'bg-rose-500'
													: status.isLow
														? 'bg-amber-400'
														: 'bg-emerald-500'}"
												style="width: {percent}%"
											></div>
										</div>
									</div>
								</td>

								<!-- Status Badge -->
								<td class="py-3.5 px-4">
									<span class="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold {status.bgColor}">
										{status.label}
									</span>
								</td>

								<!-- Action Buttons -->
								<td class="py-3.5 px-4 text-right">
									<button
										type="button"
										onclick={() => openAdjustModal(product)}
										class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-all"
									>
										Sesuaikan Stok
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal 1: Penyesuaian Stok (Stock Adjustment) -->
<Modal
	open={isAdjustModalOpen}
	title="Sesuaikan Stok: {selectedProductForAdjust?.name ?? ''}"
	description="Ubah saldo stok barang, catat mutasi masuk/keluar ke dalam ledger audit."
	onClose={() => (isAdjustModalOpen = false)}
>
	{#if selectedProductForAdjust}
		<form method="POST" action="?/adjustStock" class="space-y-4">
			<input
				type="hidden"
				name="inventoryId"
				value={selectedProductForAdjust.inventory?.id}
			/>
			<input type="hidden" name="performedBy" value={roleStore.currentUser.name} />

			<div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
				<div>
					<span class="text-slate-400">SKU:</span>
					<span class="font-mono text-white ml-1">{selectedProductForAdjust.skuCode}</span>
				</div>
				<div>
					<span class="text-slate-400">Stok Saat Ini:</span>
					<span class="font-bold text-indigo-400 ml-1">
						{selectedProductForAdjust.inventory?.currentQuantity} {selectedProductForAdjust.unit}
					</span>
				</div>
			</div>

			<!-- Tipe Mutasi -->
			<div>
				<label for="adjust-type" class="block text-xs font-semibold text-slate-300 mb-1.5">Tipe Penyesuaian</label>
				<select
					id="adjust-type"
					name="type"
					required
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				>
					<option value="IN">Stok Masuk (+ Restock / Retur / Penemuan)</option>
					<option value="OUT">Stok Keluar (- Pengeluaran Produksi / Rusak)</option>
					<option value="ADJUSTMENT">Koreksi Saldo Opname (Set nilai persis)</option>
				</select>
			</div>

			<!-- Jumlah -->
			<div>
				<label for="adjust-qty" class="block text-xs font-semibold text-slate-300 mb-1.5">
					Jumlah ({selectedProductForAdjust.unit})
				</label>
				<input
					id="adjust-qty"
					type="number"
					name="quantity"
					min="1"
					required
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
					placeholder="Contoh: 10"
				/>
			</div>

			<!-- Keterangan / Alasan -->
			<div>
				<label for="adjust-notes" class="block text-xs font-semibold text-slate-300 mb-1.5">Alasan / Catatan Mutasi</label>
				<input
					id="adjust-notes"
					type="text"
					name="notes"
					required
					placeholder="Contoh: Stok opname berkala gudang A"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>

			<div class="pt-2 flex justify-end gap-2">
				<button
					type="button"
					onclick={() => (isAdjustModalOpen = false)}
					class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
				>
					Batal
				</button>
				<button
					type="submit"
					class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
				>
					Simpan Mutasi
				</button>
			</div>
		</form>
	{/if}
</Modal>

<!-- Modal 2: Tambah Barang Baru (Add Product) -->
<Modal
	open={isAddProductModalOpen}
	title="Tambah Master Barang Baru"
	description="Daftarkan SKU baru beserta saldo awal dan parameter safety stock gudang."
	onClose={() => (isAddProductModalOpen = false)}
>
	<form method="POST" action="?/addProduct" class="space-y-3.5">
		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="sku-code" class="block text-xs font-semibold text-slate-300 mb-1">Kode SKU</label>
				<input
					id="sku-code"
					type="text"
					name="skuCode"
					required
					placeholder="Contoh: ELC-MCB-003"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
				/>
			</div>
			<div>
				<label for="category-id" class="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
				<select
					id="category-id"
					name="categoryId"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				>
					{#each data.categories as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label for="product-name" class="block text-xs font-semibold text-slate-300 mb-1">Nama Barang Lengkap</label>
			<input
				id="product-name"
				type="text"
				name="name"
				required
				placeholder="Contoh: Miniature Circuit Breaker 3-Pole 32A"
				class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
			/>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="unit-price" class="block text-xs font-semibold text-slate-300 mb-1">Harga Satuan (IDR)</label>
				<input
					id="unit-price"
					type="number"
					name="unitPrice"
					required
					placeholder="Contoh: 150000"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>
			<div>
				<label for="product-unit" class="block text-xs font-semibold text-slate-300 mb-1">Satuan</label>
				<input
					id="product-unit"
					type="text"
					name="unit"
					required
					placeholder="PCS / UNIT / BOX"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
				/>
			</div>
		</div>

		<div>
			<label for="warehouse-loc" class="block text-xs font-semibold text-slate-300 mb-1">Lokasi Rak / Bin Gudang</label>
			<input
				id="warehouse-loc"
				type="text"
				name="warehouseLocation"
				required
				placeholder="Contoh: Zone A - Rack 05"
				class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
			/>
		</div>

		<div class="grid grid-cols-3 gap-3">
			<div>
				<label for="initial-qty" class="block text-xs font-semibold text-slate-300 mb-1">Stok Awal</label>
				<input
					id="initial-qty"
					type="number"
					name="initialQty"
					min="0"
					value="20"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>
			<div>
				<label for="min-stock" class="block text-xs font-semibold text-slate-300 mb-1">Safety Stock (Min)</label>
				<input
					id="min-stock"
					type="number"
					name="minStock"
					min="1"
					value="10"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>
			<div>
				<label for="reorder-point" class="block text-xs font-semibold text-slate-300 mb-1">Reorder Point</label>
				<input
					id="reorder-point"
					type="number"
					name="reorderPoint"
					min="1"
					value="15"
					class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
				/>
			</div>
		</div>

		<div class="pt-3 flex justify-end gap-2 border-t border-slate-800">
			<button
				type="button"
				onclick={() => (isAddProductModalOpen = false)}
				class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
			>
				Batal
			</button>
			<button
				type="submit"
				class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
			>
				Simpan Master Barang
			</button>
		</div>
	</form>
</Modal>
