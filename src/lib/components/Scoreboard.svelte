<script lang="ts">
	import type { Elimination, Frame } from '$lib/stores/game';

	export let frame: Frame;

	$: sortedSnakes = [...frame.snakes].sort((a, b) => {
		if (a.isEliminated != b.isEliminated) {
			return a.isEliminated ? 1 : -1;
		}
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	function snakeIdToName(id: string) {
		for (let i = 0; i < frame.snakes.length; i++) {
			if (frame.snakes[i].id == id) {
				return frame.snakes[i].name;
			}
		}
		return 'UNKNOWN';
	}

	function eliminationToString(elimination: Elimination) {
		// See https://github.com/BattlesnakeOfficial/rules/blob/master/standard.go
		switch (elimination.cause) {
			case 'snake-collision':
				return `Collided with body of ${snakeIdToName(elimination.by)}`;
			case 'snake-self-collision':
				return 'Collided with itself';
			case 'out-of-health':
				return 'Out of health';
			case 'hazard':
				return 'Eliminated by hazard';
			case 'head-collision':
				return `Lost head-to-head with ${snakeIdToName(elimination.by)}`;
			case 'wall-collision':
				return 'Moved out of bounds';
			default:
				return elimination.cause;
		}
	}
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
			<div class="flex flex-row text-xs">
				<p class="grow truncate">by {snake.author}</p>
				<p class="text-right">{snake.latency ? `${snake.latency}ms` : ''}</p>
			</div>

			<div class="h-4 text-xs">
				{#if snake.isEliminated}
					<p>{eliminationToString(snake.elimination)}</p>
				{:else}
					<div class="healthbar w-full h-full bg-gray-200 rounded-full mt-2">
						<div
							class="transition-all h-full rounded-full text-white ps-2"
							style="background: {snake.color}; width: {snake.health}%"
						>
							{snake.health}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.healthbar {
		text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
	}
</style>
