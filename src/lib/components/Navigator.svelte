<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/state';

const navItems = [
	{
		label: 'Roulette',
		href: '/',
		icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 inline-block mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke-width='2'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6l4 2' /></svg>`
	},
	{
		label: 'Blamer',
		href: '/blamer',
		icon: `<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 inline-block mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z' /></svg>`
	}
];

function gotoNav(href: string) {
	goto(href);
}
</script>

<nav class="flex justify-center items-center gap-6 py-4 bg-gradient-to-r from-[#f7d774]/80 via-[#274472]/80 to-[#1b263b]/80 shadow-lg ring-1 ring-[#f7d774]/30 mb-6 rounded-b-2xl">
	<div class="flex items-center gap-2 mr-8 select-none">
		<img src="/favicon.svg" alt="TFT" class="h-8 w-8" />
		<span class="text-2xl font-extrabold tracking-widest text-[#f7d774] drop-shadow">TFTroll</span>
	</div>
	{#each navItems as item}
		<button
			on:click={() => gotoNav(item.href)}
			class="flex items-center gap-2 rounded-full px-6 py-2 font-bold text-white transition-all duration-200 text-lg
				{(page.url.pathname === item.href)
					? 'bg-[#212f45] text-[#f7d774] shadow-lg scale-105 ring-2 ring-[#f7d774]/60'
					: 'bg-[#274472]/80 hover:bg-[#1a2233] hover:text-[#f7d774]'}"
		>
			{@html item.icon}{item.label}
		</button>
	{/each}
</nav>
