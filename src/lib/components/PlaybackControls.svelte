<script lang="ts">
	import { type PlaybackHandlers, PlaybackState } from '$lib/playback';

	import IconPlay from '~icons/heroicons/play-solid';
	import IconPause from '~icons/heroicons/pause-solid';
	import IconNext from '~icons/heroicons/chevron-right-solid';
	import IconPrev from '~icons/heroicons/chevron-left-solid';
	import IconFirst from '~icons/heroicons/chevron-double-left-solid';

	export let handlers: PlaybackHandlers;
	export let state: PlaybackState;
</script>

<p class="text-center text-xl">
	{#if state == PlaybackState.PAUSED}
		<button class="mx-2" on:click={handlers.first}>
			<IconFirst />
		</button>
		<button class="mx-2" on:click={handlers.prev}>
			<IconPrev />
		</button>
		<button class="mx-2" on:click={handlers.play}>
			<IconPlay />
		</button>
		<button class="mx-2" on:click={handlers.next}>
			<IconNext />
		</button>
	{/if}
	{#if state == PlaybackState.PLAYING}
		<button class="mx-2" on:click={handlers.pause}>
			<IconPause />
		</button>
	{/if}
</p>
