<script lang="ts">
	import type { Item } from '../types';
	import RouletteItem from './RouletteItem.svelte';
	import SpinButton from './SpinButton.svelte';

	export let isSpinning: boolean;
	export let spinOffset: number;
	export let rouletteItems: Item[];
	export let itemWidth: number;
	export let trackRef: HTMLDivElement;
	export let onSpinClick: () => void;
	export let isSpinButtonDisabled: boolean;
</script>

<div
	class="relative h-56 w-full overflow-hidden rounded-xl border border-white/5 bg-slate-950/50 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
>
	<!-- Enhanced Indicator -->
	<div
		class="pointer-events-none absolute top-0 left-1/2 z-20 h-full w-1 -translate-x-1/2 transform"
	>
		<div
			class="from-tft-gold to-tft-gold absolute inset-0 bg-gradient-to-b via-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
		></div>

		<!-- Top Pointer -->
		<div
			class="bg-tft-gold absolute top-0 left-1/2 h-4 w-6 -translate-x-1/2 transform rounded-b-full shadow-lg"
		>
			<div class="absolute inset-x-1 top-0 bottom-1 rounded-b-full bg-amber-200/50"></div>
		</div>

		<!-- Bottom Pointer -->
		<div
			class="bg-tft-gold absolute bottom-0 left-1/2 h-4 w-6 -translate-x-1/2 transform rounded-t-full shadow-lg"
		>
			<div class="absolute inset-x-1 top-1 bottom-0 rounded-t-full bg-amber-200/50"></div>
		</div>
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
