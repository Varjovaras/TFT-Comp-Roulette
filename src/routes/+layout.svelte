<script lang="ts">
	import '../app.css';
	import Navigator from '$lib/components/Navigator.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let url = page.url;
	console.log(url);

	function navigateToRoulette() {
		goto('/');
	}

	function navigateToBlamer() {
		goto('/blamer');
	}
</script>

<div class="min-h-screen bg-gray-900">
	<Navigator />
	<slot />
</div>
