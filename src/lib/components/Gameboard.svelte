<script lang="ts">
	import type { Frame } from '$lib/stores/game';
	import type { SvgCalcParams } from '$lib/svg-calculator';

	import SvgHazard from './SvgHazard.svelte';
	import SvgSnake from './SvgSnake.svelte';
	import SvgFood from './SvgFood.svelte';
	import SvgGrid from './SvgGrid.svelte';

	// Grid constants
	const CELL_SIZE = 20;
	const CELL_SIZE_HALF = CELL_SIZE / 2;
	const CELL_SPACING = 4;
	const GRID_BORDER = 10;

	export let frame: Frame;
	export let showCoordinates: boolean;

	$: svgWidth =
		2 * GRID_BORDER + frame.width * CELL_SIZE + Math.max(frame.width - 1, 0) * CELL_SPACING;
	$: svgHeight =
		2 * GRID_BORDER + frame.height * CELL_SIZE + Math.max(frame.height - 1, 0) * CELL_SPACING;

	$: svgCalcParams = {
		cellSize: CELL_SIZE,
		cellSizeHalf: CELL_SIZE_HALF,
		cellSpacing: CELL_SPACING,
		gridBorder: GRID_BORDER,
		height: svgHeight,
		width: svgWidth
	} as SvgCalcParams;
</script>

<svg class="gameboard flex-shrink" viewBox="0 0 {svgWidth} {svgHeight}">
	<!-- Grid -->
	<SvgGrid
		gridWidth={frame.width}
		gridHeight={frame.height}
		showLabels={showCoordinates}
		{svgCalcParams}
	/>

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
