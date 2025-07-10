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
      const response = await fetch('/api/scrape');
      const result = await response.json();

      if (result.success) {
        console.log('Scraped Comps for Roulette:', result.data); // Log the scraped data for verification
        // Process scraped data into CompCaseItem format
        rouletteItems = result.data.map((comp: { name: string; link: string; color?: string }) => ({
          name: comp.name,
          rarity: 'Consumer', // Default rarity, adjust as needed
          weight: 100, // Default weight, adjust as needed
          image: `https://via.placeholder.com/100x100/CCCCCC/000000?text=${comp.name.substring(0, 1)}`,
          link: comp.link,
          color: comp.color,
          id: comp.link, // Use link as unique id
        }));
      } else {
        error = result.message;
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

<div class="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
  <h1 class="text-5xl font-extrabold mb-8 text-center">
    TFT Comp Roulette
  </h1>

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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h2 class="text-3xl font-bold mb-4">Congratulations!</h2>
        <p class="text-xl mb-4">You won: {winningComp.name}</p>
        <a
          href={winningComp.link}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Comp Details
        </a>
        <button
          on:click={closeWinningModal}
          class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  {/if}
</div>
