<script>
	export let handlers;
</script>

<p>
	<button class="mx-4" on:click={handlers.first}>First</button>
	<button class="mx-4" on:click={handlers.prev}>Previous</button>
	<button class="mx-4" on:click={handlers.next}>Next</button>
</p>
