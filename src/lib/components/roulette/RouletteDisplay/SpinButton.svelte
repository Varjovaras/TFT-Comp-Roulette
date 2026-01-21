<script lang="ts">
	export let onClick: () => void;
	export let isSpinning: boolean;
	export let isDisabled: boolean;
</script>

<button
	on:click={onClick}
	disabled={isDisabled}
	class="group relative mt-10 overflow-hidden rounded-xl bg-slate-900 px-12 py-5 text-xl font-black tracking-widest text-white uppercase shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
>
	<!-- Gold Background Gradient -->
	<div
		class="from-tft-gold to-tft-gold-dark absolute inset-0 bg-gradient-to-br via-amber-400 opacity-90 transition-opacity group-hover:opacity-100"
	></div>

	<!-- Glow Effect -->
	<div
		class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"
	></div>

	<!-- Shine Animation -->
	<div
		class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
	></div>

	<span class="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
		{#if isSpinning}
			<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
					fill="none"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			Spinning...
		{:else}
			Spin
		{/if}
	</span>
</button>
