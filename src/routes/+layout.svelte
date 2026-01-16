<script lang="ts">
	import '../app.css';
	import Navigator from '$lib/components/Navigator.svelte';
</script>

<div class="min-h-screen">
	<Navigator />
	<slot />
</div>
