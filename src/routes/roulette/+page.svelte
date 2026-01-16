<script lang="ts">
import { onMount } from 'svelte';
import CaseRoulette from '../../lib/components/roulette/CaseRoulette.svelte';
import WinningModal from '../../lib/components/roulette/modals/WinningModal.svelte';
import type { CaseItem } from '../../lib/components/roulette/types';

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
		const response = await fetch('/comps.json');
		const result = await response.json();

		if (result) {
			rouletteItems = result.map((comp: { name: string; link: string; color?: string }) => ({
				name: comp.name,
				rarity: 'Consumer',
				weight: 100,
				image: `https://via.placeholder.com/100x100/CCCCCC/000000?text=${comp.name.substring(0, 1)}`,
				link: comp.link,
				color: comp.color,
				id: comp.link
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

<div class="min-h-screen bg-slate-950 px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
	<!-- Hero Section -->
	<header class="mb-16 text-center">
		<div class="relative inline-block">
			<div class="absolute inset-0 -top-4 -left-4 -right-4 -bottom-4 bg-tft-gold/10 blur-3xl"></div>
			<h1 class="gold-text relative text-6xl font-black uppercase tracking-tighter sm:text-7xl">
				Comp Roulette
			</h1>
		</div>
		<p class="mt-4 text-lg font-semibold tracking-wide text-slate-400 uppercase">
			Teamfight Tactics Strategy Generator
		</p>
	</header>

	<main class="mx-auto max-w-6xl">
		{#if loading}
			<div class="flex flex-col items-center justify-center space-y-4 py-20">
				<div class="h-12 w-12 animate-spin rounded-full border-4 border-tft-gold border-t-transparent"></div>
				<p class="text-xl font-bold text-slate-400">Loading compositions...</p>
			</div>
		{:else if error}
			<div class="glass-panel mx-auto max-w-lg rounded-2xl border-red-500/20 p-8 text-center ring-1 ring-red-500/30">
				<div class="mb-4 text-red-400">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-white">Scraping Error</h2>
				<p class="mt-2 text-slate-400">{error}</p>
			</div>
		{:else if rouletteItems.length > 0}
			<section class="space-y-12">
				<CaseRoulette
					items={rouletteItems}
					onItemWon={handleItemWon}
					spinDuration={8}
					itemWidth={160}
					itemsInView={5}
				/>
				
				<!-- Instructions/Info -->
				<div class="grid gap-6 md:grid-cols-3">
					<div class="glass-panel rounded-2xl p-6 transition-transform hover:scale-[1.02]">
						<h3 class="font-bold text-tft-gold uppercase">1. Spin</h3>
						<p class="mt-2 text-sm text-slate-400">Click the golden button to start the roulette. Good luck!</p>
					</div>
					<div class="glass-panel rounded-2xl p-6 transition-transform hover:scale-[1.02]">
						<h3 class="font-bold text-tft-gold uppercase">2. Research</h3>
						<p class="mt-2 text-sm text-slate-400">View detailed guides for your winning composition.</p>
					</div>
					<div class="glass-panel rounded-2xl p-6 transition-transform hover:scale-[1.02]">
						<h3 class="font-bold text-tft-gold uppercase">3. Dominate</h3>
						<p class="mt-2 text-sm text-slate-400">Use your new strategy to climb the ranks in TFT.</p>
					</div>
				</div>
			</section>
		{:else}
			<div class="glass-panel mx-auto max-w-lg rounded-2xl p-8 text-center">
				<p class="text-lg text-slate-400">Scraping yielded no compositions. Please try again later.</p>
			</div>
		{/if}
	</main>

	{#if showWinningModal && winningComp}
		<WinningModal item={winningComp} onClose={closeWinningModal} />
	{/if}
</div>
