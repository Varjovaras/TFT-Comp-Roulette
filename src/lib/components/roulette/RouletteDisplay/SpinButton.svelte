<script lang="ts">
  export let onClick: () => void;
  export let isSpinning: boolean;
  export let isDisabled: boolean;
</script>

<button
  on:click={onClick}
  disabled={isDisabled}
  class="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200
  disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {#if isSpinning}
    Spinning...
  {:else}
    Spin
  {/if}
</button>
