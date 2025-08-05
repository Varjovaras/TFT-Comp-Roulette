<script lang="ts">
	const hello = ':D';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center p-8 text-white">
	<div class="mb-8 flex flex-col items-center">
		<div class="mb-2 flex items-center gap-2">
			<svg class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
				><circle cx="12" cy="12" r="10" stroke-width="2" /><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6v6l4 2"
				/></svg
			>
			<h1 class="text-5xl font-extrabold tracking-tight">TFT Blamer</h1>
		</div>
		<p class="text-lg text-gray-400">Find out who to blame for your TFT loss!</p>
	</div>
	<div class="flex w-full max-w-md flex-col items-center rounded-xl bg-gray-800 p-8 shadow-lg">
		<div class="mb-4 animate-bounce text-3xl font-semibold">{hello}</div>
		<button
			class="mt-4 rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
		>
			Blame Someone
		</button>
	</div>
</div>
