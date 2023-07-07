<script>
	import { onMount } from 'svelte';
	import { gameFrames, loadGameStore } from '$lib/stores/game';
	import { playbackReady } from '$lib/stores/playback';

	onMount(async () => {
		loadGameStore('engine.battlesnake.com', '1a9db4f2-cb92-4708-a9bc-964ea8f0b5d3');
	});

	const exampleURL = 'https://board.battlesnake.com?engine=<ENGINE_HOST>&game=<GAME_ID>';
</script>

<div>
	{#if !$playbackReady}
		<p>Loading game data...</p>
	{:else}
		<p>Playback ready!</p>
		{#each $gameFrames as gameFrame}
			<p>{gameFrame.snakes.length}, {gameFrame.turn}</p>
		{/each}
	{/if}

	<!-- IF ERROR -->
	<!-- <p class="mb-2 font-bold">To display a game specify engine and game parameters in the URL.</p>
	<p>For example: {exampleURL}</p> -->
</div>
