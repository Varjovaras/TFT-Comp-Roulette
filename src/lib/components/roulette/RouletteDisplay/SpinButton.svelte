<script lang="ts">
	export let onClick: () => void;
	export let isSpinning: boolean;
	export let isDisabled: boolean;
</script>

<button
	on:click={onClick}
	disabled={isDisabled}
	class="focus:ring-opacity-75 mt-8 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-10 py-4 text-xl font-extrabold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
>
	{#if isSpinning}
		Spinning...
	{:else}
		Spin
	{/if}
</button>
