<script lang="ts">
	import type { CaseItem } from '../types';
	import { getItemColor } from '../utils';

	export let item: CaseItem;
	export const width: number = 140;
	export const isWinner: boolean = false;
	export const itemColor: string = '';

	$: rarityColor = itemColor || getItemColor(item);
</script>

<div
	class="relative mx-1 box-border flex h-48 flex-shrink-0 flex-col rounded-md border-2 bg-gray-800 p-1.5 shadow-lg transition-transform duration-300 ease-in-out"
	class:winner={isWinner}
	style="width: {width}px; height: {width}px; --rarity-color: {rarityColor}; border-color: {rarityColor};"
>
	<div class="absolute top-0 left-0 h-1 w-full" style="background-color: {rarityColor};"></div>
	<div class="flex h-full flex-col justify-between">
		<div
			class="relative flex flex-1 items-center justify-center overflow-hidden rounded-sm bg-gray-900 p-1.5"
		>
			{#if item.image}
				<img
					src={item.image}
					alt={item.name}
					class="h-auto max-h-full w-auto max-w-full object-contain"
				/>
			{:else}
				<span
					class="flex h-full w-full items-center justify-center text-center text-sm font-bold text-white"
					>{item.name}</span
				>
			{/if}
		</div>
		<div class="p-2 text-center">
			<div
				class="mb-1 overflow-hidden text-xs font-bold text-ellipsis whitespace-nowrap text-white"
				title={item.name}
			>
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
