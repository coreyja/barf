<script>
	import { onMount } from 'svelte';
	import { loadGameStore } from '$lib/stores/game';
	import { playbackFrames } from '$lib/stores/playback';

	onMount(async () => {
		loadGameStore('engine.battlesnake.com', '1a9db4f2-cb92-4708-a9bc-964ea8f0b5d3');
	});

	const exampleURL = 'https://board.battlesnake.com?engine=<ENGINE_HOST>&game=<GAME_ID>';
</script>

<div>
	<p class="mb-2 font-bold">To display a game specify engine and game parameters in the URL.</p>
	<p>For example: {exampleURL}</p>

	{#each $playbackFrames as frame}
		<p>{frame.turn}</p>
	{/each}
</div>

<style>
</style>
