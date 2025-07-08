<script lang="ts">
  import type { CaseItem } from '../types';
  import RouletteItem from './RouletteItem.svelte';
  import SpinButton from './SpinButton.svelte';

  export let isSpinning: boolean;
  export let spinOffset: number;
  export let rouletteItems: CaseItem[];
  export let itemWidth: number;
  export let trackRef: HTMLDivElement;
  export let onSpinClick: () => void;
  export let isSpinButtonDisabled: boolean;
</script>

<div class="w-full h-48 relative overflow-hidden rounded-md shadow-inner">
  <div class="absolute top-0 left-1/2 h-full w-1 bg-red-500 transform -translate-x-1/2 z-10 pointer-events-none">
    <div class="absolute left-1/2 transform -translate-x-1/2 top-0 w-0 h-0 border-solid border-t-8 border-x-4 border-transparent border-t-red-500"></div>
    <div class="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0 border-solid border-b-8 border-x-4 border-transparent border-b-red-500"></div>
  </div>
  <div
    bind:this={trackRef}
    class="flex absolute top-px left-0 h-full transition-all duration-200 linear"
    class:spinning="{isSpinning}"
    style="left: -{spinOffset}px; --spin-duration: {isSpinning ? `var(--spin-duration)` : '0s'};"
  >
    {#each rouletteItems as item (item.id)}
      <RouletteItem {item} width={itemWidth} />
    {/each}
  </div>
</div>
<SpinButton onClick={onSpinClick} {isSpinning} isDisabled={isSpinButtonDisabled} />

<style>
  .spinning {
    transition: left cubic-bezier(0.15, 0.85, 0.35, 1.0) var(--spin-duration, 8s);
  }
</style>
