<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/state';

const navItems = [
	{
		label: 'Roulette',
		href: '/roulette',
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

<nav class="relative flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 py-4 min-h-[5rem] bg-gradient-to-r from-[#f7d774]/80 via-[#274472]/80 to-[#1b263b]/80 shadow-lg ring-1 ring-[#f7d774]/30 mb-6 rounded-b-2xl overflow-visible">
	<div class="flex items-center gap-2 mb-2 sm:mb-0 mr-0 sm:mr-8 select-none relative w-full sm:w-auto justify-center sm:justify-start">
		<!-- tf.svg needs fixing in the future by making a better svg file -->
		<img src="/tf.svg" alt="TFT" class="h-20 w-20 sm:h-32 sm:w-32 absolute left-8 sm:left-0 -top-6 sm:-top-11 transform scale-110 sm:scale-125 z-10" />
		<a href="/" class="text-2xl font-extrabold tracking-widest text-[#f7d774] drop-shadow ml-0 sm:ml-36 hover:underline focus:underline outline-none">
			TFTroll
		</a>
	</div>
	<div class="flex flex-row gap-2 sm:gap-6 w-full sm:w-auto justify-center">
		{#each navItems as item}
			<button
				on:click={() => gotoNav(item.href)}
				class="flex items-center gap-2 rounded-full px-4 sm:px-6 py-2 font-bold text-white transition-all duration-200 text-base sm:text-lg
					{(page.url.pathname === item.href)
						? 'bg-[#212f45] text-[#f7d774] shadow-lg scale-105 ring-2 ring-[#f7d774]/60'
						: 'bg-[#274472]/80 hover:bg-[#1a2233] hover:text-[#f7d774]'}"
			>
				{@html item.icon}{item.label}
			</button>
		{/each}
	</div>
</nav>
