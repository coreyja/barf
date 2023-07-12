<script lang="ts">
	import type { Frame } from '$lib/stores/game';
	import { type SvgCalcParams, svgCalcCellRect } from '$lib/components/svg-calculator';

	import SvgHazard from './SvgHazard.svelte';
	import SvgSnake from './SvgSnake.svelte';
	import SvgFood from './SvgFood.svelte';

	// Grid sizing
	const CELL_SIZE = 20;
	const CELL_SIZE_HALF = CELL_SIZE / 2;
	const CELL_SPACING = 4;
	const CELL_COLOR = '#f1f1f1';

	export let frame: Frame;

	$: svgWidth = frame.width * (CELL_SIZE + CELL_SPACING) + CELL_SPACING;
	$: svgHeight = frame.height * (CELL_SIZE + CELL_SPACING) + CELL_SPACING;

	$: svgCalcParams = {
		cellSize: CELL_SIZE,
		cellSizeHalf: CELL_SIZE_HALF,
		cellSpacing: CELL_SPACING,
		height: svgHeight,
		width: svgWidth
	} as SvgCalcParams;
</script>

<svg class="gameboard" viewBox="0 0 {svgWidth} {svgHeight}">
	<!-- Grid -->
	{#each { length: frame.width } as _, x}
		{#each { length: frame.height } as _, y}
			<rect
				id={`grid-${x}-${y}`}
				class="grid"
				fill={CELL_COLOR}
				{...svgCalcCellRect(svgCalcParams, { x, y })}
			/>
		{/each}
	{/each}

	<!-- Eliminated Snakes -->
	{#each frame.snakes as snake}
		{#if snake.isEliminated}
			<SvgSnake {snake} {svgCalcParams} />
		{/if}
	{/each}

	<!-- Alive Snakes -->
	{#each frame.snakes as snake}
		{#if !snake.isEliminated}
			<SvgSnake {snake} {svgCalcParams} />
		{/if}
	{/each}

	<!-- Hazards -->
	{#each frame.hazards as hazard, i}
		<SvgHazard point={hazard} key={`${i}`} {svgCalcParams} />
	{/each}

	<!-- Food -->
	{#each frame.food as food, i}
		<SvgFood point={food} key={`${i}`} {svgCalcParams} />
	{/each}
</svg>
