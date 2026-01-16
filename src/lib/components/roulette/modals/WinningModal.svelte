<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import type { Item } from '../types';

	export let item: Item;
	export let onClose: () => void;
	export let onCopyTeamCode: () => void = () => {};
	export let copyButtonText: string = 'Copy Team Code';

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
		<div
			class="via-tft-gold absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent"
		></div>

		<!-- Animated Background Glow -->
		<div
			class="bg-tft-gold/10 absolute -top-24 -left-24 h-64 w-64 animate-pulse blur-[100px]"
		></div>
		<div class="bg-tft-blue-deep/50 absolute -right-24 -bottom-24 h-64 w-64 blur-[100px]"></div>

		<div class="relative p-8 text-center">
			<div class="mb-6">
				<div
					class="ring-tft-gold/50 mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 shadow-inner ring-4 ring-offset-4 ring-offset-slate-900"
				>
					<svg class="text-tft-gold h-10 w-10 shadow-lg" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<h2 class="gold-text text-4xl font-black tracking-tight uppercase">Victory!</h2>
				<p class="mt-1 font-medium text-slate-400">You've unlocked a new strategy</p>
			</div>

			<div
				class="group relative mx-auto mb-8 w-48 overflow-hidden rounded-2xl bg-slate-950/50 p-4 ring-1 ring-white/10"
			>
				<div class="from-tft-gold/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
				{#if item.image}
					<img
						src={item.image}
						alt={item.name}
						class="relative z-10 mx-auto h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-110"
					/>
				{:else}
					<div
						class="text-tft-gold relative z-10 flex h-32 w-32 items-center justify-center text-5xl font-bold"
					>
						{item.name.charAt(0)}
					</div>
				{/if}
				<div class="relative z-10 mt-4">
					<div class="text-tft-gold text-[10px] font-bold tracking-widest uppercase">
						{item.rarity || 'Consumer'}
					</div>
					<div class="mt-1 text-lg font-extrabold text-white">{item.name}</div>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<a
					href={(item as any).link}
					target="_blank"
					rel="noopener noreferrer"
					class="group bg-tft-gold relative overflow-hidden rounded-xl px-8 py-4 text-center font-bold text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					<div
						class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
					></div>
					View Comp Details
				</a>

				{#if item.teamCode}
					<button
						on:click={onCopyTeamCode}
						class="group relative overflow-hidden rounded-xl bg-green-600 px-8 py-3 text-center font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
					>
						<div
							class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
						></div>
						{copyButtonText}
					</button>
				{/if}

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
