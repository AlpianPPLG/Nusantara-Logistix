<script lang="ts">
	import { page } from '$app/state';
	import { roleStore } from '$lib/stores/role.svelte';
	import {
		LayoutDashboard,
		Package,
		PackageCheck,
		FileText,
		ShoppingCart,
		Building2,
		Scale,
		Workflow,
		ChevronRight,
		Shield,
		ArrowRight
	} from '@lucide/svelte';

	interface NavItem {
		href: string;
		label: string;
		icon: any;
		badge?: string;
		roles?: string[]; // Recommended roles
	}

	interface NavGroup {
		title: string;
		items: NavItem[];
	}

	const navGroups: NavGroup[] = [
		{
			title: 'UTAMA',
			items: [{ href: '/', label: 'Executive Dashboard', icon: LayoutDashboard }]
		},
		{
			title: 'PERGUDANGAN & INVENTARIS',
			items: [
				{
					href: '/inventory',
					label: 'Katalog & Stok Gudang',
					icon: Package,
					badge: 'Realtime'
				},
				{
					href: '/warehouse/receipts',
					label: 'Penerimaan (Goods Receipt)',
					icon: PackageCheck,
					roles: ['warehouse', 'admin']
				}
			]
		},
		{
			title: 'E-PROCUREMENT & PENGADAAN',
			items: [
				{
					href: '/procurement/requisitions',
					label: 'Permintaan Barang (PR)',
					icon: FileText
				},
				{
					href: '/procurement/orders',
					label: 'Pesanan Pembelian (PO)',
					icon: ShoppingCart,
					roles: ['purchasing', 'finance', 'admin']
				},
				{
					href: '/vendors',
					label: 'Vendor & Rekanan',
					icon: Building2
				}
			]
		},
		{
			title: 'KEUANGAN & AUDIT',
			items: [
				{
					href: '/finance/3-way-match',
					label: '3-Way Matching Engine',
					icon: Scale,
					badge: 'Audit PO-GR-Inv',
					roles: ['finance', 'admin']
				}
			]
		},
		{
			title: 'DOKUMENTASI SISTEM',
			items: [
				{
					href: '/workflow-docs',
					label: 'Arsitektur & UML Diagram',
					icon: Workflow
				}
			]
		}
	];
</script>

<aside
	class="w-64 border-r border-slate-800/80 bg-slate-950/95 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4"
>
	<!-- Navigation List -->
	<div class="space-y-6">
		{#each navGroups as group}
			<div>
				<div class="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
					{group.title}
				</div>
				<nav class="space-y-1">
					{#each group.items as item}
						{@const isActive =
							item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)}
						{@const isRoleRecommended =
							!item.roles || item.roles.includes(roleStore.currentRole)}
						<a
							href={item.href}
							class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group {isActive
								? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
								: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'}"
						>
							<div class="flex items-center gap-2.5 truncate">
								<item.icon
									class="w-4 h-4 shrink-0 transition-colors {isActive
										? 'text-indigo-400'
										: 'text-slate-400 group-hover:text-slate-200'}"
								/>
								<span class="truncate">{item.label}</span>
							</div>

							<div class="flex items-center gap-1.5 shrink-0">
								{#if item.badge}
									<span
										class="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700"
									>
										{item.badge}
									</span>
								{/if}
								{#if !isRoleRecommended}
									<span
										class="text-[9px] text-amber-500/70"
										title="Bukan tugas utama role aktif saat ini"
									>
										•
									</span>
								{/if}
							</div>
						</a>
					{/each}
				</nav>
			</div>
		{/each}
	</div>

	<!-- Current Active Persona Card -->
	<div
		class="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-md"
	>
		<div class="flex items-center gap-3">
			<img
				src={roleStore.currentUser.avatar}
				alt={roleStore.currentUser.name}
				class="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
			/>
			<div class="min-w-0 flex-1">
				<p class="text-xs font-bold text-white truncate">{roleStore.currentUser.name}</p>
				<p class="text-[10px] text-indigo-400 font-medium truncate">
					{roleStore.currentUser.title}
				</p>
			</div>
		</div>

		<div class="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
			<span class="text-slate-400 flex items-center gap-1">
				<Shield class="w-3 h-3 text-emerald-400" />
				Akses:
			</span>
			<span class="font-semibold text-slate-200 capitalize">{roleStore.currentRole}</span>
		</div>
	</div>
</aside>
