<script lang="ts">
	interface Point {
		x: number;
		y: number;
	}
	interface Snake {
		id: string;
		name: string;
		color: string;
		body: Point[];
	}
	interface Frame {
		width: number;
		height: number;
		turn: number;
		snakes: Snake[];
		food: Point[];
		hazards: Point[];
	}
	export let frame: Frame;

	const CELL_SIZE = 20;
	const CELL_SPACING = 4;
	const CELL_COLOR = '#f1f1f1';

	const FOOD_RADIUS = (CELL_SIZE / 3.25).toFixed(2);
	const FOOD_COLOR = '#ff5c75';

	const HAZARD_COLOR = '#000000';
	const HAZARD_OPACITY = 0.3;

	$: svgWidth = CELL_SIZE * frame.width + CELL_SPACING * frame.width + CELL_SPACING;
	$: svgHeight = CELL_SIZE * frame.height + CELL_SPACING * frame.height + CELL_SPACING;

	function svgCirclePropsAtPoint({ x, y }: Point) {
		const rect = svgRectPropsAtPoint({ x, y });
		return {
			cx: rect.x + CELL_SIZE / 2,
			cy: rect.y + CELL_SIZE / 2
		};
	}

	function svgRectPropsAtPoint({ x, y }: Point) {
		return {
			x: CELL_SPACING + x * (CELL_SIZE + CELL_SPACING),
			y: svgHeight - (y + 1) * (CELL_SIZE + CELL_SPACING),
			width: CELL_SIZE,
			height: CELL_SIZE
		};
	}

	function polylinePoints(snake: Snake) {
		const points = [];
		for (let i = 0; i < snake.body.length; i++) {
			const { cx, cy } = svgCirclePropsAtPoint(snake.body[i]);
			points.push(`${cx},${cy}`);
		}
		return points.join(' ');
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
		<polyline
			points={polylinePoints(snake)}
			stroke-width={CELL_SIZE}
			stroke={snake.color}
			stroke-linecap="round"
			stroke-linejoin="round"
			fill="transparent"
		/>
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
