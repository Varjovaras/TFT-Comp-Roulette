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
	class="relative mx-1 box-border flex h-56 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl transition-all duration-300 hover:scale-105 hover:z-10 hover:border-white/20"
	class:winner={isWinner}
	style="width: {width}px; --rarity-color: {rarityColor};"
>
	<!-- Rarity Bar -->
	<div class="absolute top-0 left-0 h-1.5 w-full opacity-80" style="background-color: {rarityColor};"></div>
	
	<!-- Glow Background -->
	<div class="absolute inset-0 opacity-10" style="background: radial-gradient(circle at center, {rarityColor}, transparent 70%);"></div>

	<div class="relative flex h-full flex-col">
		<div
			class="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-950/50 p-2 ring-1 ring-white/5"
		>
			{#if item.image}
				<img
					src={item.image}
					alt={item.name}
					class="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-500 hover:scale-110"
				/>
			{:else}
				<span
					class="flex h-full w-full items-center justify-center text-center text-sm font-bold text-slate-300"
					>{item.name}</span
				>
			{/if}
		</div>
		
		<div class="pt-3 pb-1">
			<div
				class="overflow-hidden text-center text-[10px] font-bold tracking-wider uppercase text-slate-400"
			>
				{item.rarity || 'Common'}
			</div>
			<div
				class="mt-0.5 overflow-hidden text-center text-xs font-extrabold tracking-tight text-white line-clamp-2"
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
