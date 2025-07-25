<script lang="ts">
	const hello = ':D';
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-8 text-white">
	<div class="mb-8 flex flex-col items-center">
		<div class="mb-2 flex items-center gap-2">
			<svg class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" /></svg>
			<h1 class="text-5xl font-extrabold tracking-tight">TFT Blamer</h1>
		</div>
		<p class="text-gray-400 text-lg">Find out who to blame for your TFT loss!</p>
	</div>
	<div class="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
		<div class="text-3xl font-semibold mb-4 animate-bounce">{hello}</div>
		<button class="mt-4 rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
			Blame Someone
		</button>
	</div>
</div>
