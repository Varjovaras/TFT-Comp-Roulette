<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import type { CaseItem } from '../types';

	export let item: CaseItem;
	export let onClose: () => void;

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	on:click={handleBackdropClick}
	on:keydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
	transition:fade={{ duration: 300 }}
>
	<!-- Backdrop -->
	<div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>

	<!-- Modal Content -->
	<div
		class="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
		transition:scale={{ duration: 500, delay: 100, easing: backOut, start: 0.8 }}
	>
		<!-- Gold Header Flare -->
		<div class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-tft-gold to-transparent"></div>

		<!-- Animated Background Glow -->
		<div class="absolute -top-24 -left-24 h-64 w-64 bg-tft-gold/10 blur-[100px] animate-pulse"></div>
		<div class="absolute -bottom-24 -right-24 h-64 w-64 bg-tft-blue-deep/50 blur-[100px]"></div>

		<div class="relative p-8 text-center">
			<div class="mb-6">
				<div class="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 shadow-inner ring-4 ring-tft-gold/50 ring-offset-4 ring-offset-slate-900">
					<svg class="h-10 w-10 text-tft-gold shadow-lg" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<h2 class="gold-text text-4xl font-black uppercase tracking-tight">Victory!</h2>
				<p class="mt-1 text-slate-400 font-medium">You've unlocked a new strategy</p>
			</div>

			<div class="group relative mx-auto mb-8 w-48 overflow-hidden rounded-2xl bg-slate-950/50 p-4 ring-1 ring-white/10">
                <div class="absolute inset-0 bg-gradient-to-br from-tft-gold/5 to-transparent"></div>
				{#if item.image}
					<img
						src={item.image}
						alt={item.name}
						class="relative z-10 mx-auto h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-110"
					/>
				{:else}
					<div class="relative z-10 flex h-32 w-32 items-center justify-center text-5xl font-bold text-tft-gold">
						{item.name.charAt(0)}
					</div>
				{/if}
				<div class="relative z-10 mt-4">
					<div class="text-[10px] font-bold uppercase tracking-widest text-tft-gold">{item.rarity || 'Consumer'}</div>
					<div class="mt-1 text-lg font-extrabold text-white">{item.name}</div>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<a
					href={(item as any).link}
					target="_blank"
					rel="noopener noreferrer"
					class="group relative overflow-hidden rounded-xl bg-tft-gold px-8 py-4 text-center font-bold text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
                    <div class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
					View Comp Details
				</a>
				<button
					on:click={onClose}
					class="rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
				>
					Close
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom animations if needed */
</style>
