<script lang="ts">
	import type { Point, Frame } from '$lib/stores/game';
	import { fetchCustomizationSvgDef } from '$lib/stores/customizations';

	const CELL_SIZE = 20;
	const CELL_SPACING = 4;
	const CELL_COLOR = '#f1f1f1';

	const FOOD_RADIUS = (CELL_SIZE / 3.25).toFixed(2);
	const FOOD_COLOR = '#ff5c75';

	const HAZARD_COLOR = '#000000';
	const HAZARD_OPACITY = 0.3;

	export let frame: Frame;

	$: svgWidth = CELL_SIZE * frame.width + CELL_SPACING * frame.width + CELL_SPACING;
	$: svgHeight = CELL_SIZE * frame.height + CELL_SPACING * frame.height + CELL_SPACING;

	function svgRectPropsAtPoint(p: Point) {
		return {
			// (x, y) should be the top left corner of the square
			x: CELL_SPACING + p.x * (CELL_SIZE + CELL_SPACING),
			y: svgHeight - (p.y + 1) * (CELL_SIZE + CELL_SPACING),
			width: CELL_SIZE,
			height: CELL_SIZE
		};
	}

	function svgCirclePropsAtPoint(p: Point) {
		const rect = svgRectPropsAtPoint(p);
		return {
			cx: rect.x + CELL_SIZE / 2,
			cy: rect.y + CELL_SIZE / 2
		};
	}

	function svgPolylinePropsForSnakeBody(body: Point[]) {
		const bodyCenterPoints = body.slice(1, -1).map((p) => {
			const { cx, cy } = svgCirclePropsAtPoint(p);
			return `${cx},${cy}`;
		});
		return { points: bodyCenterPoints.join(' ') };
	}
</script>

<svg class="gameboard" viewBox="0 0 {svgWidth} {svgHeight}">
	<!-- Grid -->
	{#each { length: frame.width } as _, x}
		{#each { length: frame.height } as _, y}
			<rect
				id={`grid-${x}-${y}`}
				class="grid"
				fill={CELL_COLOR}
				{...svgRectPropsAtPoint({ x, y })}
			/>
		{/each}
	{/each}

	<!-- Snakes -->
	{#each frame.snakes as snake}
		<g id={`snake-${snake.id}`} class="snake">
			<!-- Body -->
			<polyline
				stroke-width={CELL_SIZE}
				stroke-linecap="square"
				stroke-linejoin="round"
				stroke={snake.color}
				fill="transparent"
				{...svgPolylinePropsForSnakeBody(snake.body)}
			/>
			<!-- Head -->
			<svg viewBox="0 0 100 100" fill={snake.color} {...svgRectPropsAtPoint(snake.body[0])}>
				{#await fetchCustomizationSvgDef('head', snake.head) then headSvgDef}
					{@html headSvgDef}
				{/await}
			</svg>
			<!-- Tail -->
			<svg
				viewBox="0 0 100 100"
				fill={snake.color}
				{...svgRectPropsAtPoint(snake.body[snake.body.length - 1])}
			>
				{#await fetchCustomizationSvgDef('tail', snake.tail) then tailSvgDef}
					{@html tailSvgDef}
				{/await}
			</svg>
		</g>
	{/each}

	<!-- Hazards -->
	{#each frame.hazards as hazard, i}
		<rect
			id={`hazard-${i}`}
			class="hazard"
			fill={HAZARD_COLOR}
			fill-opacity={HAZARD_OPACITY}
			{...svgRectPropsAtPoint(hazard)}
		/>
	{/each}

	<!-- Food -->
	{#each frame.food as food, i}
		<circle
			id={`food-${i}`}
			class="food"
			r={FOOD_RADIUS}
			fill={FOOD_COLOR}
			{...svgCirclePropsAtPoint(food)}
		/>
	{/each}
</svg>

<p class="text-center">
	Board: {frame.width} x {frame.height}, Turn: {frame.turn}, SVG: {svgWidth} x {svgHeight}
</p>
