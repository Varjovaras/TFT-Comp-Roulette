<script lang="ts">
  import CaseRoulette from '../lib/components/roulette/CaseRoulette.svelte';
  import type { CaseItem } from '../lib/components/roulette/types';

  const dummyItems: CaseItem[] = [
    { name: 'Item A', rarity: 'Consumer', weight: 100, image: 'https://via.placeholder.com/100x100/FF0000/FFFFFF?text=A' },
    { name: 'Item B', rarity: 'Industrial', weight: 80, image: 'https://via.placeholder.com/100x100/00FF00/FFFFFF?text=B' },
    { name: 'Item C', rarity: 'Mil-spec', weight: 60, image: 'https://via.placeholder.com/100x100/0000FF/FFFFFF?text=C' },
    { name: 'Item D', rarity: 'Restricted', weight: 40, image: 'https://via.placeholder.com/100x100/FFFF00/000000?text=D' },
    { name: 'Item E', rarity: 'Classified', weight: 20, image: 'https://via.placeholder.com/100x100/FF00FF/FFFFFF?text=E' },
    { name: 'Item F', rarity: 'Covert', weight: 10, image: 'https://via.placeholder.com/100x100/00FFFF/000000?text=F' },
    { name: 'Item G', rarity: 'Rare Special Item', weight: 5, image: 'https://via.placeholder.com/100x100/FFA500/FFFFFF?text=G' },
  ];

  function handleItemWon(item: CaseItem) {
    console.log('Won item:', item.name);
    alert(`Congratulations! You won: ${item.name}`);
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
  <h1 class="text-5xl font-extrabold mb-8 text-center">
    Simple Roulette
  </h1>

  <CaseRoulette
    items={dummyItems}
    onItemWon={handleItemWon}
    spinDuration={8}
    itemWidth={140}
    itemsInView={5}
  />
</div>