<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { keybind } from '$lib/keybind';
	import { type PlaybackHandlers, PlaybackState, startPlayback, stopPlayback } from '$lib/playback';
	import { type Frame, gameFrames, loadGameStore } from '$lib/stores/game';
	import { autoplay, fps, showCoords } from '$lib/stores/settings';

	import Gameboard from '$lib/components/Gameboard.svelte';
	import PlaybackControls from '$lib/components/PlaybackControls.svelte';
	import Scoreboard from '$lib/components/Scoreboard.svelte';

	const AUTOPLAY_DELAY_MS = 1000;

	// URL Search Param Helpers
	function getBoolFromURL(key: string, defaultValue: boolean): boolean {
		const val = $page.url.searchParams.get(key);
		if (val) {
			return val === 'true';
		}
		return defaultValue;
	}
	function getIntFromURL(key: string, defaultValue: number): number {
		const val = $page.url.searchParams.get(key);
		if (val) {
			return parseInt(val);
		}
		return defaultValue;
	}
	function getStringFromURL(key: string, defaultValue: string): string {
		const val = $page.url.searchParams.get(key);
		if (val) {
			return val;
		}
		return defaultValue;
	}

	onMount(async () => {
		const engineHost = getStringFromURL('engine', 'engine.battlesnake.com');
		const gameID: string = getStringFromURL('game', '');

		if (engineHost.length == 0 || gameID.length == 0) {
			error = true;
			return;
		}

		loadGameStore(engineHost, gameID);
	});

	let error = false;

	let currentFrame: null | Frame = null;
	let currentFrameIndex = 0;

	function setCurrentFrame(i: number) {
		const index = Math.min(Math.max(i, 0), $gameFrames.length - 1);
		currentFrame = $gameFrames[index];
		currentFrameIndex = index;

		// Pause playback if this is the final frame
		if (currentFrame.gameOver) {
			playbackHandlers.pause();
		}
	}

	// Settings
	$: settings = {
		autoplay: getBoolFromURL('autoplay', $autoplay),
		fps: getIntFromURL('fps', $fps),
		showCoords: getBoolFromURL('showCoords', $showCoords)
	};

	let playbackState: PlaybackState = PlaybackState.PAUSED;

	const playbackHandlers: PlaybackHandlers = {
		play: () => {
			startPlayback(settings.fps, () => {
				setCurrentFrame(currentFrameIndex + 1);
				return true;
			});
			playbackState = PlaybackState.PLAYING;
		},
		pause: () => {
			stopPlayback();
			playbackState = PlaybackState.PAUSED;
		},
		next: () => {
			if (playbackState == PlaybackState.PAUSED) {
				setCurrentFrame(currentFrameIndex + 1);
			}
		},
		prev: () => {
			if (playbackState == PlaybackState.PAUSED) {
				setCurrentFrame(currentFrameIndex - 1);
			}
		},
		first: () => {
			if (playbackState == PlaybackState.PAUSED) {
				setCurrentFrame(0);
			}
		},
		last: () => {
			if (playbackState == PlaybackState.PAUSED) {
				setCurrentFrame($gameFrames.length - 1);
			}
		}
	};

	function togglePlayPause() {
		if (playbackState == PlaybackState.PLAYING) {
			playbackHandlers.pause();
		} else if (playbackState == PlaybackState.PAUSED) {
			playbackHandlers.play();
		}
	}

	// Load initial frame and svgs once game frames are ready
	$: if (!currentFrame && $gameFrames.length > 0) {
		setCurrentFrame(0);
		playbackState = PlaybackState.PAUSED;
		if (settings.autoplay) {
			setTimeout(playbackHandlers.play, AUTOPLAY_DELAY_MS);
		}
	}
</script>

{#if error}
	<div class="text-center p-4">
		<p class="mb-2 font-bold">To display a game specify engine and game parameters in the URL.</p>
		<p>For example: {'https://board.battlesnake.com?engine=<ENGINE_HOST>&game=<GAME_ID>'}</p>
	</div>
{:else if !currentFrame}
	<div class="text-center p-4">
		<p>Loading game data...</p>
	</div>
{:else if currentFrame}
	<div
		class="h-screen w-full flex flex-row"
		use:keybind={{ key: 'r', f: playbackHandlers.first }}
		use:keybind={{ key: 'right', f: playbackHandlers.next }}
		use:keybind={{ key: 'left', f: playbackHandlers.prev }}
		use:keybind={{ key: 'space', f: togglePlayPause }}
	>
		<div class="w-3/5">
			<Gameboard frame={currentFrame} showCoordinates={settings.showCoords} />
			<div class="py-2">
				<PlaybackControls state={playbackState} handlers={playbackHandlers} />
				<p class="text-xs text-center"><a href="/settings">settings</a></p>
			</div>
		</div>
		<div class="w-2/5 px-4 py-6">
			<Scoreboard frame={currentFrame} />
		</div>
	</div>
{/if}
