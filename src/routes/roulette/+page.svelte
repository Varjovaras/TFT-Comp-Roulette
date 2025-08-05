<script lang="ts">
	import { onMount } from 'svelte';
	import CaseRoulette from '../../lib/components/roulette/CaseRoulette.svelte';
	import type { Item } from '../../lib/components/roulette/types';

	interface CompCaseItem extends Item {
		link: string;
		teamCode?: string;
	}

	let rouletteItems: CompCaseItem[] = [];
	let loading = true;
	let error: string | null = null;

	let showWinningModal = false;
	let winningComp: CompCaseItem | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/comps.json');
			const result = await response.json();

			if (result) {
				rouletteItems = result.map(
					(comp: { name: string; link: string; color?: string; teamCode?: string }) => ({
						name: comp.name,
						rarity: 'Consumer',
						weight: 100,
						image: `https://via.placeholder.com/100x100/CCCCCC/000000?text=${comp.name.substring(
							0,
							1
						)}`,
						link: comp.link,
						color: comp.color || '#b0c3d9',
						teamCode: comp.teamCode,
						id: comp.link
					})
				);
			} else {
				error = 'No comps found in comps.json';
			}
		} catch {
			// error = e.message;
		} finally {
			loading = false;
		}
	});

	function handleItemWon(item: Item) {
		winningComp = item as CompCaseItem;
		showWinningModal = true;
	}

	function closeWinningModal() {
		showWinningModal = false;
		winningComp = null;
	}

	let copyButtonText = 'Copy Team Code';

	function copyTeamCode(teamCode?: string) {
		if (!teamCode) {
			return;
		}
		if (navigator.clipboard) {
			navigator.clipboard.writeText(teamCode).then(
				() => {
					copyButtonText = 'Copied!';
					setTimeout(() => {
						copyButtonText = 'Copy Team Code';
					}, 2000);
				},
				(err) => {
					console.error('Failed to copy team code: ', err);
				}
			);
		} else {
			console.error('Clipboard API not available');
		}
	}
</script>

<div class="flex flex-col items-center justify-center p-8 text-white">
	<h1 class="mb-8 text-center text-5xl font-extrabold">TFT Comp Roulette</h1>

	{#if loading}
		<div class="loader"></div>
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
				{#if winningComp.teamCode}
					<button
						on:click={() => copyTeamCode(winningComp?.teamCode ?? undefined)}
						class="mt-4 ml-2 rounded-md bg-green-600 px-4 py-2 font-bold text-white transition-colors duration-200 hover:bg-green-700"
					>
						{copyButtonText}
					</button>
				{/if}
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

<style>
	.loader {
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-top: 4px solid #fff;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
