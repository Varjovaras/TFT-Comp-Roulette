<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	const blameReasons = [
		'Mortdog personally lowered your roll chances.',
		'Your 3-star carry decided to target a target dummy.',
		'Lag spike right when you needed to roll down.',
		'The RNG gods are displeased with your scouting.',
		'Someone else high-rolled a 3-star 4-cost at level 7.',
		'You forgot to itemize your main tank.',
		"Phantom items didn't land where they should have.",
		'The carousel was an absolute disaster.',
		'Bad positioning against the Shroud of Stillness.',
		'You were contested by three other players.',
		'The Augment choices were purely malicious.',
		'Your frontline melted like butter.'
	];

	let currentBlame = '';
	let isBlaming = false;
	let showResult = false;

	function handleBlame() {
		isBlaming = true;
		showResult = false;

		setTimeout(() => {
			currentBlame = blameReasons[Math.floor(Math.random() * blameReasons.length)];
			isBlaming = false;
			showResult = true;
		}, 1000);
	}
</script>

<div class="px-4 py-20 text-slate-50">
	<main class="mx-auto max-w-4xl">
		<header class="mb-16 text-center">
			<div class="relative inline-block">
				<div
					class="absolute inset-0 -top-4 -right-4 -bottom-4 -left-4 bg-red-500/10 blur-3xl"
				></div>
				<h1 class="relative text-6xl font-black tracking-tighter uppercase sm:text-7xl">
					TFT <span class="text-red-500">BLAMER</span>
				</h1>
			</div>
			<p class="mt-4 text-lg font-semibold tracking-wide text-slate-400 uppercase">
				Official Loss Justification System
			</p>
		</header>

		<div class="glass-panel mx-auto max-w-2xl rounded-3xl p-10 text-center ring-1 ring-white/10">
			<div class="mb-10">
				<div
					class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 shadow-inner ring-4 ring-red-500/30 ring-offset-4 ring-offset-slate-900"
				>
					<svg class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 class="text-3xl font-bold">Who took your LP?</h2>
				<p class="mt-2 text-slate-400">Our advanced algorithm will find the culprit.</p>
			</div>

			<div
				class="relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-2xl bg-slate-950/50 p-8 ring-1 ring-white/5"
			>
				{#if isBlaming}
					<div transition:fade class="flex flex-col items-center gap-4">
						<div
							class="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"
						></div>
						<p class="animate-pulse font-bold tracking-widest text-red-400 uppercase">
							Analyzing VODs...
						</p>
					</div>
				{:else if showResult}
					<div in:fly={{ y: 20, duration: 500, easing: backOut }} class="space-y-4">
						<div class="text-[10px] font-black tracking-widest text-red-500 uppercase">
							Identified Culprit
						</div>
						<p class="text-2xl leading-tight font-extrabold text-white">{currentBlame}</p>
					</div>
				{:else}
					<p class="text-lg text-slate-500 italic">Ready to shift responsibility...</p>
				{/if}
			</div>

			<button
				on:click={handleBlame}
				disabled={isBlaming}
				class="group relative mt-10 w-full overflow-hidden rounded-xl bg-slate-900 py-5 text-xl font-black tracking-widest text-white uppercase shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 opacity-90 transition-opacity group-hover:opacity-100"
				></div>
				<div class="absolute inset-x-0 top-0 h-px bg-white/20"></div>
				<span class="relative z-10">Blame Someone</span>
			</button>
		</div>
	</main>
</div>
