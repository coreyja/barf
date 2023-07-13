<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { type PlaybackHandlers, PlaybackState } from '$lib/playback';
	import { type Frame, gameFrames, loadGameStore } from '$lib/stores/game';

	import Gameboard from '$lib/components/Gameboard.svelte';
	import PlaybackControls from '$lib/components/PlaybackControls.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';

	onMount(async () => {
		const engineHost = $page.url.searchParams.get('engine') || 'engine.battlesnake.com';
		const gameID: string = $page.url.searchParams.get('game') || '';

		if (engineHost.length == 0 || gameID.length == 0) {
			error = true;
			return;
		}

		loadGameStore(engineHost, gameID);
	});

	let error = false;

	let currentFrame: null | Frame = null;
	let currentFrameIndex = 0;

	function setCurrentFrame(index: number) {
		// TODO: DEEP COPY & TRANSFORM ???
		currentFrame = $gameFrames[index];
		currentFrameIndex = index;
	}

	// Load initial frame and svgs once game frames are ready
	$: if (!currentFrame && $gameFrames.length > 0) {
		// setPlaybackState(PlaybackState.PAUSED);
		setCurrentFrame(0);
	}

	let playbackState: PlaybackState = PlaybackState.PAUSED;

	const playbackHandlers: PlaybackHandlers = {
		play: function () {},
		pause: function () {},
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
	{#if error}
		<div class="text-center p-4">
			<p class="mb-2 font-bold">To display a game specify engine and game parameters in the URL.</p>
			<p>For example: {'https://board.battlesnake.com?engine=<ENGINE_HOST>&game=<GAME_ID>'}</p>
		</div>
	{:else if !currentFrame}
		<p>Loading game data...</p>
	{:else if currentFrame}
		<div class="flex">
			<div class="w-3/5">
				<Gameboard frame={currentFrame} />
				<PlaybackControls state={playbackState} handlers={playbackHandlers} />
			</div>
			<div class="w-2/5">
				<Scoreboard frame={currentFrame} />
			</div>
		</div>
	{/if}
</div>
