<script lang="ts">
  import type { CaseItem } from '../types';
  import { getItemColor } from '../utils';

  export let item: CaseItem;
  export let width: number = 140;
  export let isWinner: boolean = false;

  $: rarityColor = getItemColor(item);
</script>

<div
  class="flex-shrink-0 h-48 bg-gray-800 border-2 rounded-md mx-1 p-1.5 box-border flex flex-col relative transition-transform duration-300 ease-in-out shadow-lg"
  class:winner="{isWinner}"
  style="width: {width}px; height: {width}px; --rarity-color: {rarityColor}; border-color: {rarityColor};"
>
  <div class="absolute top-0 left-0 w-full h-1" style="background-color: {rarityColor};"></div>
  <div class="flex flex-col justify-between h-full">
    <div class="flex-1 flex items-center justify-center p-1.5 bg-gray-900 rounded-sm overflow-hidden relative">
      {#if item.image}
        <img src={item.image} alt={item.name} class="max-w-full max-h-full w-auto h-auto object-contain" />
      {:else}
        <span class="flex items-center justify-center h-full w-full text-center text-white font-bold text-sm">{item.name}</span>
      {/if}
    </div>
    <div class="p-2 text-center">
      <div class="text-xs font-bold text-white mb-1 whitespace-nowrap overflow-hidden text-ellipsis" title={item.name}>
        {item.name}
      </div>
    </div>
  </div>
</div>

<style>
  .winner {
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--rarity-color, #b0c3d9);
    z-index: 5;
  }
</style>
