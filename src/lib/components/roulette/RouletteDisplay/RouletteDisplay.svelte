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

<div class="relative h-48 w-full overflow-hidden rounded-md shadow-inner">
	<div
		class="pointer-events-none absolute top-0 left-1/2 z-10 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 shadow-lg animate-pulse"
	>
		<div
			class="absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-4 border-t-8 border-solid border-transparent border-t-blue-400 animate-bounce"
		></div>
		<div
			class="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-4 border-b-8 border-solid border-transparent border-b-blue-700 animate-bounce"
		></div>
	</div>
	<div
		bind:this={trackRef}
		class="linear absolute top-px left-0 flex h-full transition-all duration-200"
		class:spinning={isSpinning}
		style="left: -{spinOffset}px; --spin-duration: {isSpinning ? `var(--spin-duration)` : '0s'};"
	>
		{#each rouletteItems as item (item.id)}
			<RouletteItem {item} width={itemWidth} itemColor={item.color} />
		{/each}
	</div>
</div>
<SpinButton onClick={onSpinClick} {isSpinning} isDisabled={isSpinButtonDisabled} />

<style>
	.spinning {
		transition: left cubic-bezier(0.15, 0.85, 0.35, 1) var(--spin-duration, 8s);
	}
</style>
