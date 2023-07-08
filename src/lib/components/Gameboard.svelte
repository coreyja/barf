<script lang="ts">
	import type { Frame, Point, Snake } from '$lib/stores/game';
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
		const [head, tail] = [body[0], body[body.length - 1]];
		const bodyCenterPoints = body.slice(1, -1).map((p) => {
			const { cx, cy } = svgCirclePropsAtPoint(p);
			return `${cx},${cy}`;
		});
		return { points: bodyCenterPoints.join(' ') };
	}

	function svgTransformForSnakeHead(snake: Snake): string {
		const [head, neck] = snake.body.slice(0, 2);
		if (head.x < neck.x) {
			// Moving left
			return 'scale(-1,1) translate(-100, 0)';
		} else if (head.y > neck.y) {
			// Moving up
			return 'rotate(-90, 50, 50)';
		} else if (head.y < neck.y) {
			// Moving down
			return 'rotate(90, 50, 50)';
		}
		// Moving right
		return '';
	}

	function svgTransformForSnakeTail(snake: Snake): string {
		const [preTail, tail] = snake.body.slice(-2);
		if (preTail.x > tail.x) {
			// Moving right
			return 'scale(-1,1) translate(-100,0)';
		} else if (preTail.y > tail.y) {
			// Moving up
			return 'scale(-1,1) translate(-100,0) rotate(90, 50, 50)';
		} else if (preTail.y < tail.y) {
			// Moving down
			return 'scale(-1,1) translate(-100,0) rotate(-90, 50, 50)';
		}
		// Moving left
		return '';
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
				<g transform={svgTransformForSnakeHead(snake)}>
					{#await fetchCustomizationSvgDef('head', snake.head) then headSvgDef}
						{@html headSvgDef}
					{/await}
				</g>
			</svg>
			<!-- Tail -->
			<svg
				viewBox="0 0 100 100"
				fill={snake.color}
				{...svgRectPropsAtPoint(snake.body[snake.body.length - 1])}
			>
				<g transform={svgTransformForSnakeTail(snake)}>
					{#await fetchCustomizationSvgDef('tail', snake.tail) then tailSvgDef}
						{@html tailSvgDef}
					{/await}
				</g>
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
