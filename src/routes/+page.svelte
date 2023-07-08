<script lang="ts">
	import { onMount } from 'svelte';
	import type { Frame } from '$lib/stores/game';
	import { gameFrames, loadGameStore } from '$lib/stores/game';

	import Gameboard from '$lib/components/Gameboard.svelte';
	import PlaybackControls from '$lib/components/PlaybackControls.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';

	onMount(async () => {
		loadGameStore('engine.battlesnake.com', '5db0ada9-7a45-4c53-9ce0-fadf19d741ae');
	});

	let currentFrame: null | Frame = null;
	let currentFrameIndex = 0;

	function setCurrentFrame(index: number) {
		// TODO: DEEP COPY & TRANSFORM ???
		currentFrame = $gameFrames[index];
		currentFrameIndex = index;
	}

	// Load initial frame and svgs once game frames are ready
	$: if (!currentFrame && $gameFrames.length > 0) {
		setCurrentFrame(0);
	}

	const playbackHandlers = {
		next: function () {
			if (currentFrameIndex < $gameFrames.length - 1) {
				setCurrentFrame(currentFrameIndex + 1);
			}
		},
		prev: function () {
			if (currentFrameIndex > 0) {
				setCurrentFrame(currentFrameIndex - 1);
			}
		},
		first: function () {
			setCurrentFrame(0);
		}
	};
</script>

<div>
	<!-- IF ERROR -->
	<!-- <p class="mb-2 font-bold">To display a game specify engine and game parameters in the URL.</p>
	<p>For example: {'https://board.battlesnake.com?engine=<ENGINE_HOST>&game=<GAME_ID>'}</p> -->

	{#if !currentFrame}
		<p>Loading game data...</p>
	{:else if currentFrame}
		<Gameboard frame={currentFrame} />
		<hr />
		<PlaybackControls handlers={playbackHandlers} />
		<hr />
		<Scoreboard frame={currentFrame} />
	{/if}
</div>
