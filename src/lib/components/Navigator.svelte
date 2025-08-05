<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import RouletteIcon from './icons/RouletteIcon.svelte';
	import BlamerIcon from './icons/BlamerIcon.svelte';

	const navItems = [
		{
			label: 'Roulette',
			href: '/roulette',
			icon: RouletteIcon
		},
		{
			label: 'Blamer',
			href: '/blamer',
			icon: BlamerIcon
		}
	];

	function gotoNav(href: string) {
		goto(href);
	}
</script>

<nav
	class="relative mb-6 flex min-h-[5rem] flex-col items-center justify-center gap-2 overflow-visible rounded-b-2xl bg-gradient-to-r from-[#f7d774]/80 via-[#274472]/80 to-[#1b263b]/80 py-4 shadow-lg ring-1 ring-[#f7d774]/30 sm:flex-row sm:gap-6"
>
	<div
		class="relative mr-0 mb-2 flex w-full items-center justify-center gap-2 select-none sm:mr-8 sm:mb-0 sm:w-auto sm:justify-start"
	>
		<!-- tf.svg needs fixing in the future by making a better svg file -->
		<img
			src="/tf.svg"
			alt="TFT"
			class="absolute -top-6 left-8 z-10 h-20 w-20 scale-110 transform sm:-top-11 sm:left-0 sm:h-32 sm:w-32 sm:scale-125"
		/>
		<a
			href="/"
			class="ml-0 text-2xl font-extrabold tracking-widest text-[#f7d774] drop-shadow outline-none hover:underline focus:underline sm:ml-36"
		>
			TFTroll
		</a>
	</div>
	<div class="flex w-full flex-row justify-center gap-2 sm:w-auto sm:gap-6">
		{#each navItems as item (item.href)}
			<button
				on:click={() => gotoNav(item.href)}
				class="flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold text-white transition-all duration-200 sm:px-6 sm:text-lg
					{page.url.pathname === item.href
					? 'scale-105 bg-[#212f45] text-[#f7d774] shadow-lg ring-2 ring-[#f7d774]/60'
					: 'bg-[#274472]/80 hover:bg-[#1a2233] hover:text-[#f7d774]'}"
			>
				<svelte:component this={item.icon} />{item.label}
			</button>
		{/each}
	</div>
</nav>
