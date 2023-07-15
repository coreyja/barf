<script lang="ts">
	import type { Frame } from '$lib/stores/game';

	export let frame: Frame;

	$: sortedSnakes = [...frame.snakes].sort((a, b) => {
		if (a.isEliminated != b.isEliminated) {
			return a.isEliminated ? 1 : -1;
		}
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
</script>

<div class="scoreboard px-4 pt-6">
	<div class="flex flex-row font-bold text-lg">
		<div class="basis-1/2 text-right">TURN</div>
		<div class="basis-1/2 pl-2">{frame.turn}</div>
	</div>
	{#each sortedSnakes as snake}
		<div class="p-2 cursor-pointer" class:text-gray-300={snake.isEliminated}>
			<div class="flex flex-row font-bold">
				<p class="grow truncate">{snake.name}</p>
				<p class="ps-4 text-right">{snake.length}</p>
			</div>
			<div class="flex flex-row mb-2 text-xs">
				<p class="grow truncate">by {snake.author}</p>
				<p class="text-right">{snake.latency ? `${snake.latency}ms` : ''}</p>
			</div>
			<div class="healthbar w-full bg-gray-200 rounded-full h-4">
				{#if !snake.isEliminated}
					<div
						class="transition-all h-full rounded-full ps-2 text-xs"
						style="background: {snake.color}; width: {snake.health}%"
					>
						{snake.health}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.healthbar {
		color: white;
		text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
	}
</style>
