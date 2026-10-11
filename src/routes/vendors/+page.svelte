<script lang="ts">
	import type { PageData } from './$types';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Building2,
		Mail,
		Phone,
		MapPin,
		Star,
		CreditCard,
		ShoppingCart
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6 animate-in fade-in duration-300">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2">
				<h2 class="text-2xl font-extrabold text-white tracking-tight">Vendor & Rekanan Resmi</h2>
				<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
					{data.vendors.length} Rekanan Terdaftar
				</span>
			</div>
			<p class="text-xs text-slate-400 mt-1">
				Penyedia material dan jasa rekanan perusahaan dengan evaluasi performa (SLA pengiriman & mutu).
			</p>
		</div>
	</div>

	<!-- Vendors Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
		{#each data.vendors as v}
			{@const poCount = data.orders.filter((o: (typeof data.orders)[0]) => o.vendorId === v.id).length}

			<div
				class="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="flex items-center gap-3">
						<div class="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
							<Building2 class="w-5 h-5 text-indigo-400" />
						</div>
						<div>
							<h3 class="text-base font-bold text-white tracking-tight">{v.companyName}</h3>
							<div class="flex items-center gap-2 mt-0.5">
								<span class="text-[11px] font-mono text-slate-400 font-semibold">{v.code}</span>
								<span class="text-[10px] text-slate-500">•</span>
								<div class="flex items-center text-amber-400 text-xs font-bold gap-1">
									<Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
									{v.rating} / 5.0
								</div>
							</div>
						</div>
					</div>

					<Badge status={v.status} />
				</div>

				<div class="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-2">
					<div class="flex items-center gap-2 text-slate-300">
						<MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
						<span class="truncate">{v.address ?? 'Alamat belum diatur'}</span>
					</div>
					<div class="flex items-center gap-2 text-slate-300">
						<Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
						<span class="truncate">{v.contactEmail} ({v.contactName})</span>
					</div>
					{#if v.contactPhone}
						<div class="flex items-center gap-2 text-slate-300">
							<Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
							<span>{v.contactPhone}</span>
						</div>
					{/if}
				</div>

				<div class="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
					<span class="flex items-center gap-1.5">
						<CreditCard class="w-3.5 h-3.5 text-emerald-400" />
						Term: <strong class="text-white">{v.paymentTerms}</strong>
					</span>
					<span class="flex items-center gap-1.5 font-semibold text-indigo-400">
						<ShoppingCart class="w-3.5 h-3.5" />
						{poCount} Pesanan PO Terkait
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>
