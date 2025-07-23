<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import {  page } from '$app/navigation';

	$: ({ url } = $page);

	function navigateToRoulette() {
		goto('/');
	}

	function navigateToBlamer() {
		goto('/blamer');
	}
</script>

<div class="min-h-screen bg-gray-900">
	<nav class="flex justify-center gap-4 border-b border-gray-700 bg-gray-800 p-4">
		<button
			on:click={navigateToRoulette}
			class="rounded-md px-6 py-2 font-bold text-white transition-colors duration-200 {(url.pathname === '/') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'}"
		>
			Roulette
		</button>
		<button
			on:click={navigateToBlamer}
			class="rounded-md px-6 py-2 font-bold text-white transition-colors duration-200 {(url.pathname === '/blamer') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'}"
		>
			Blamer
		</button>
	</nav>

	<slot />
</div>
