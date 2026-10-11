<script lang="ts">
	import { roleStore, roleProfiles } from '$lib/stores/role.svelte';
	import type { UserRole } from '$lib/types';
	import {
		Boxes,
		RotateCcw,
		ShieldCheck,
		Database,
		CheckCircle2,
		Sparkles
	} from '@lucide/svelte';

	let isResetting = $state(false);
	let resetSuccess = $state(false);

	async function handleResetDb() {
		if (
			!confirm(
				'Reset database demo ke data awal? Semua transaksi akan di-reseed ke kondisi default.'
			)
		) {
			return;
		}

		try {
			isResetting = true;
			const res = await fetch('/api/reset-db', { method: 'POST' });
			if (res.ok) {
				resetSuccess = true;
				setTimeout(() => {
					window.location.reload();
				}, 600);
			} else {
				alert('Gagal mereset database.');
			}
		} catch (err) {
			console.error(err);
			alert('Terjadi kesalahan saat mereset database.');
		} finally {
			isResetting = false;
		}
	}

	const rolesList: { id: UserRole; label: string; icon: string }[] = [
		{ id: 'warehouse', label: 'Warehouse Staff', icon: '📦' },
		{ id: 'purchasing', label: 'Purchasing', icon: '🛒' },
		{ id: 'finance', label: 'Finance Manager', icon: '💳' },
		{ id: 'admin', label: 'Super Admin', icon: '⚡' }
	];
</script>

<header
	class="sticky top-0 z-40 w-full h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between"
>
	<!-- Brand & Platform -->
	<div class="flex items-center gap-3">
		<div
			class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20"
		>
			<Boxes class="w-5 h-5 text-white" />
		</div>
		<div>
			<div class="flex items-center gap-2">
				<h1 class="font-extrabold text-base tracking-tight text-white">Nusantara Logistix</h1>
				<span
					class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
				>
					WMS + E-Procurement
				</span>
			</div>
			<p class="text-[11px] text-slate-400 hidden sm:block">
				Enterprise Warehouse Management & 3-Way Match Procurement
			</p>
		</div>
	</div>

	<!-- Center / Live Status & Prototype Switcher -->
	<div class="flex items-center gap-2 sm:gap-4">
		<!-- DB Live Indicator -->
		<div
			class="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
		>
			<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
			<span>Drizzle ORM & SQLite Live</span>
		</div>

		<!-- Interactive Role Switcher for Testing Prototype -->
		<div
			class="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner"
		>
			<span class="text-[11px] font-semibold text-slate-400 px-2 hidden md:inline flex items-center gap-1">
				<ShieldCheck class="w-3.5 h-3.5 text-indigo-400" />
				Demo Role:
			</span>
			<div class="flex items-center gap-1">
				{#each rolesList as r}
					<button
						type="button"
						onclick={() => roleStore.setRole(r.id)}
						class="text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 {roleStore.currentRole ===
						r.id
							? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
							: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}"
						title="Beralih ke role {r.label}"
					>
						<span>{r.icon}</span>
						<span class="hidden sm:inline">{r.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Reset Database Button -->
		<button
			type="button"
			onclick={handleResetDb}
			disabled={isResetting}
			class="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all"
			title="Reset database transaksi ke awal"
		>
			{#if isResetting}
				<div class="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
				<span class="hidden sm:inline">Resetting...</span>
			{:else if resetSuccess}
				<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
				<span class="hidden sm:inline text-emerald-400">Tereset!</span>
			{:else}
				<RotateCcw class="w-3.5 h-3.5 text-slate-400" />
				<span class="hidden sm:inline">Reset Demo</span>
			{/if}
		</button>
	</div>
</header>
