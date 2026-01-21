<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import RouletteIcon from './icons/RouletteIcon.svelte';

	const navItems = [
		{
			label: 'Roulette',
			href: '/',
			icon: RouletteIcon
		}
	];

	function gotoNav(href: string) {
		goto(href);
	}
</script>

<nav
	class="glass-panel sticky top-0 z-50 flex flex-col items-center justify-between gap-6 px-8 py-4 shadow-xl ring-1 ring-white/5 sm:flex-row sm:rounded-b-3xl"
>
	<div class="flex items-center gap-4">
		<div class="relative">
			<div class="bg-tft-gold/20 absolute inset-0 blur-xl"></div>
			<img
				src="/tf.svg"
				alt="TFT"
				class="relative z-10 h-12 w-12 transition-transform hover:rotate-12"
			/>
		</div>
		<a
			href="/"
			class="hover:text-tft-gold text-3xl font-black tracking-tighter text-white drop-shadow-sm transition-colors"
		>
			TFT<span class="gold-text">ROLL</span>
		</a>
	</div>

	<div class="flex items-center gap-3">
		{#each navItems as item (item.href)}
			<button
				on:click={() => gotoNav(item.href)}
				class="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 font-bold transition-all duration-300
					{page.url.pathname === item.href
					? 'bg-tft-gold scale-105 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
					: 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}"
			>
				<span class="relative z-10 flex items-center gap-2">
					<div class="opacity-70 transition-opacity group-hover:opacity-100">
						<svelte:component this={item.icon} />
					</div>
					{item.label}
				</span>

				{#if page.url.pathname !== item.href}
					<div
						class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"
					></div>
				{/if}
			</button>
		{/each}
	</div>
</nav>
