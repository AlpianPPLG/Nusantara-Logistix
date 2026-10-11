<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		value: string | number;
		subtext?: string;
		trend?: string;
		isPositive?: boolean;
		variant?: 'indigo' | 'amber' | 'emerald' | 'rose' | 'sky';
		icon?: Snippet;
	}

	let {
		title,
		value,
		subtext,
		trend,
		isPositive = true,
		variant = 'indigo',
		icon
	}: Props = $props();

	const variantStyles = {
		indigo: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
		amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
		emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
		rose: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
		sky: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400'
	};
</script>

<div
	class="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-slate-700 hover:shadow-indigo-500/5 hover:-translate-y-0.5"
>
	<!-- Gradient ambient glow -->
	<div
		class="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br {variantStyles[variant]} blur-2xl opacity-40 pointer-events-none"
	></div>

	<div class="flex items-center justify-between mb-3">
		<span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
		{#if icon}
			<div
				class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br {variantStyles[variant]} border"
			>
				{@render icon()}
			</div>
		{/if}
	</div>

	<div class="flex items-baseline justify-between gap-2">
		<span class="text-2xl font-bold tracking-tight text-white">{value}</span>
		{#if trend}
			<span
				class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full {isPositive
					? 'bg-emerald-500/15 text-emerald-400'
					: 'bg-rose-500/15 text-rose-400'}"
			>
				{trend}
			</span>
		{/if}
	</div>

	{#if subtext}
		<p class="mt-2 text-xs text-slate-400 truncate">{subtext}</p>
	{/if}
</div>
