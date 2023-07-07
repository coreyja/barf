<script>
	export let frame;

	const CELL_SIZE = 20;
	const CELL_SPACING = 4;
	const CELL_COLOR = '#f1f1f1';

	const FOOD_RADIUS = (CELL_SIZE / 3.25).toFixed(2);
	const FOOD_COLOR = '#ff5c75';

	const HAZARD_COLOR = '#000000';
	const HAZARD_OPACITY = 0.3;

	$: svgWidth = CELL_SIZE * frame.width + CELL_SPACING * frame.width + CELL_SPACING;
	$: svgHeight = CELL_SIZE * frame.height + CELL_SPACING * frame.height + CELL_SPACING;

	function coordToSVG(c) {
		return CELL_SPACING + c * (CELL_SIZE + CELL_SPACING);
	}
</script>

<p class="text-center">
	Board: {frame.width} x {frame.height}, Turn: {frame.turn}, SVG: {svgWidth} x {svgHeight}
</p>

<svg class="gameboard" viewBox="0 0 {svgWidth} {svgHeight}">
	<!-- Grid -->
	{#each { length: frame.width } as _, x}
		{#each { length: frame.height } as _, y}
			<rect
				id={`grid-${x}-${y}`}
				class="grid"
				x={coordToSVG(x)}
				y={coordToSVG(y)}
				width={CELL_SIZE}
				height={CELL_SIZE}
				fill={CELL_COLOR}
			/>
		{/each}
	{/each}
	<!-- Snakes -->
	{#each frame.snakes as snake}
		{#each snake.body as body, i}
			<rect
				id={`snake-${snake.id}-${i}`}
				class="snake"
				x={coordToSVG(body.x)}
				y={coordToSVG(body.y)}
				width={CELL_SIZE}
				height={CELL_SIZE}
				fill={snake.color}
			/>
		{/each}
	{/each}
	<!-- Hazards -->
	{#each frame.hazards as hazard, i}
		<rect
			id={`hazard-${i}`}
			class="hazard"
			x={coordToSVG(hazard.x)}
			y={coordToSVG(hazard.y)}
			width={CELL_SIZE}
			height={CELL_SIZE}
			fill={HAZARD_COLOR}
			fill-opacity={HAZARD_OPACITY}
		/>
	{/each}
	<!-- Food -->
	{#each frame.food as food, i}
		<circle
			id={`food-${i}`}
			class="food"
			cx={coordToSVG(food.x) + CELL_SIZE / 2}
			cy={coordToSVG(food.y) + CELL_SIZE / 2}
			r={FOOD_RADIUS}
			fill={FOOD_COLOR}
		/>
	{/each}
</svg>

<style>
	svg.gameboard .food {
		filter: drop-shadow(0.1em 0.1em 0.05em rgba(0, 0, 0, 0.3));
	}
</style>
