<script lang="ts">
	export let onClick: () => void;
	export let isSpinning: boolean;
	export let isDisabled: boolean;
</script>

<button
	on:click={onClick}
	disabled={isDisabled}
	class="focus:ring-opacity-75 mt-4 rounded-md bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none
  disabled:cursor-not-allowed disabled:bg-gray-400"
>
	{#if isSpinning}
		Spinning...
	{:else}
		Spin
	{/if}
</button>
