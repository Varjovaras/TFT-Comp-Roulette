<script lang="ts">
	import { onMount } from 'svelte';
	import CaseRoulette from '../lib/components/roulette/CaseRoulette.svelte';
	import type { CaseItem } from '../lib/components/roulette/types';

	interface CompCaseItem extends CaseItem {
		link: string;
		color?: string;
	}

	let rouletteItems: CompCaseItem[] = [];
	let loading = true;
	let error: string | null = null;

	let showWinningModal = false;
	let winningComp: CompCaseItem | null = null;

	onMount(async () => {
		try {
			// Use static JSON in production
			const response = await fetch('/comps.json');
			const result = await response.json();

			if (result) {
				rouletteItems = result.map((comp: { name: string; link: string; color?: string }) => ({
					name: comp.name,
					rarity: 'Consumer', // Default rarity, adjust as needed
					weight: 100, // Default weight, adjust as needed
					image: `https://via.placeholder.com/100x100/CCCCCC/000000?text=${comp.name.substring(0, 1)}`,
					link: comp.link,
					color: comp.color,
					id: comp.link // Use link as unique id
				}));
			} else {
				error = 'No comps found in comps.json';
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	function handleItemWon(item: CaseItem) {
		winningComp = item as CompCaseItem;
		showWinningModal = true;
	}

	function closeWinningModal() {
		showWinningModal = false;
		winningComp = null;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
	<h1 class="mb-8 text-center text-5xl font-extrabold">TFT Comp Roulette</h1>

	{#if loading}
		<p>Loading comps...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if rouletteItems.length > 0}
		<CaseRoulette
			items={rouletteItems}
			onItemWon={handleItemWon}
			spinDuration={8}
			itemWidth={140}
			itemsInView={5}
		/>
	{:else}
		<p>No comps found. Scraping might have returned empty data or failed.</p>
	{/if}

	{#if showWinningModal && winningComp}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="rounded-lg bg-gray-800 p-8 text-center shadow-lg">
				<h2 class="mb-4 text-3xl font-bold">Congratulations!</h2>
				<p class="mb-4 text-xl">You won: {winningComp.name}</p>
				<a
					href={winningComp.link}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors duration-200 hover:bg-blue-700"
				>
					View Comp Details
				</a>
				<button
					on:click={closeWinningModal}
					class="mt-4 rounded-md bg-gray-600 px-4 py-2 font-bold text-white transition-colors duration-200 hover:bg-gray-700"
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>
