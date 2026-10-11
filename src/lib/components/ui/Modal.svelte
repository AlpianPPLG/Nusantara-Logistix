<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		onClose?: () => void;
		children?: Snippet;
	}

	let { open = false, title, description, onClose, children }: Props = $props();

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	}
</script>

{#if open}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
		onclick={handleBackdrop}
		onkeydown={(e) => e.key === 'Escape' && onClose && onClose()}
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200 overflow-hidden"
		>
			<div class="flex items-start justify-between pb-4 border-b border-slate-800">
				<div>
					<h3 class="text-lg font-bold text-white tracking-tight">{title}</h3>
					{#if description}
						<p class="text-xs text-slate-400 mt-0.5">{description}</p>
					{/if}
				</div>
				{#if onClose}
					<button
						type="button"
						onclick={onClose}
						class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
						aria-label="Tutup"
					>
						<X class="w-5 h-5" />
					</button>
				{/if}
			</div>

			<div class="mt-4 max-h-[75vh] overflow-y-auto pr-1">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}
