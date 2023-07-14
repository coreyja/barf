<script lang="ts">
	import { type PlaybackHandlers, PlaybackState } from '$lib/playback';

	import IconPlay from '~icons/heroicons/play-solid';
	import IconPause from '~icons/heroicons/pause-solid';
	import IconNext from '~icons/heroicons/chevron-right-solid';
	import IconPrev from '~icons/heroicons/chevron-left-solid';
	import IconFirst from '~icons/heroicons/chevron-double-left-solid';
	import IconLast from '~icons/heroicons/chevron-double-right-solid';

	export let handlers: PlaybackHandlers;
	export let state: PlaybackState;

	$: disableDuringPlayback = state == PlaybackState.PLAYING;
</script>

<p class="text-center text-xl">
	<button
		class="mx-2 disabled:text-gray-300"
		on:click={handlers.first}
		disabled={disableDuringPlayback}
	>
		<IconFirst />
	</button>
	<button
		class="mx-2 disabled:text-gray-300"
		on:click={handlers.prev}
		disabled={disableDuringPlayback}
	>
		<IconPrev />
	</button>
	{#if state == PlaybackState.PLAYING}
		<button class="mx-2" on:click={handlers.pause}>
			<IconPause />
		</button>
	{:else if state == PlaybackState.PAUSED}
		<button class="mx-2" on:click={handlers.play}>
			<IconPlay />
		</button>
	{/if}
	<button
		class="mx-2 disabled:text-gray-300"
		on:click={handlers.next}
		disabled={disableDuringPlayback}
	>
		<IconNext />
	</button>
	<button
		class="mx-2 disabled:text-gray-300"
		on:click={handlers.next}
		disabled={disableDuringPlayback}
	>
		<IconLast />
	</button>
</p>
