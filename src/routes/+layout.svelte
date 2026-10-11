<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { roleStore } from '$lib/stores/role.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children } = $props();

	onMount(() => {
		roleStore.init();
	});
</script>

<svelte:head>
	<title>Nusantara Logistix | WMS & E-Procurement 3-Way Match</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
	<Header />

	<div class="flex-1 flex overflow-hidden">
		<Sidebar />

		<main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
			{@render children()}
		</main>
	</div>
</div>
