<script lang="ts">
	import { type PlaybackHandlers, PlaybackState } from '$lib/playback';

		export let handlers: PlaybackHandlers;
	export let state: PlaybackState;
</script>

<p class="text-center">
	{#if state == PlaybackState.PAUSED}
		<button class="mx-2" on:click={handlers.first}>First</button>
		<button class="mx-2" on:click={handlers.prev}>Previous</button>
		<button class="mx-2" on:click={handlers.play}>Play</button>
		<button class="mx-2" on:click={handlers.next}>Next</button>
	{/if}
	{#if state == PlaybackState.PLAYING}
		<button class="mx-2" on:click={handlers.pause}>Pause</button>
	{/if}
</p>
