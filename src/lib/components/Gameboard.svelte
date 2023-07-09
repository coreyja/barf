<script lang="ts">
	import type { Frame, Point, Snake } from '$lib/stores/game';
	import { fetchCustomizationSvgDef } from '$lib/stores/customizations';

	// Grid sizing
	const CELL_SIZE = 20;
	const CELL_SIZE_HALF = CELL_SIZE / 2;
	const CELL_SPACING = 4;
	const CELL_COLOR = '#f1f1f1';

	// Used to extend body to connect head and tail
	const GAP_SIZE = CELL_SPACING + 1; // Fill 1 extra to ensure overlap

	const FOOD_RADIUS = (CELL_SIZE / 3.25).toFixed(2);
	const FOOD_COLOR = '#ff5c75';

	const HAZARD_COLOR = '#000000';
	const HAZARD_OPACITY = 0.3;

	export let frame: Frame;

	$: svgWidth = CELL_SIZE * frame.width + CELL_SPACING * frame.width + CELL_SPACING;
	$: svgHeight = CELL_SIZE * frame.height + CELL_SPACING * frame.height + CELL_SPACING;

	function displayHead(snake: Snake): boolean {
		// Snake heads are always shown
		return true;
	}

	function displayTail(snake: Snake): boolean {
		// Snake heads take priority
		const [head, tail] = [snake.body[0], snake.body[snake.body.length - 1]];
		if (head.x == tail.x && head.y == tail.y) {
			return false;
		}
		return true;
	}

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
			cx: rect.x + CELL_SIZE_HALF,
			cy: rect.y + CELL_SIZE_HALF
		};
	}

	function svgPolylinePropsForSnakeBody(body: Point[]) {
		const strokeWidth = CELL_SIZE;
		const strokeLinejoin = 'round';
		let strokeLinecap = 'square';

		const [head, tail] = [body[0], body[body.length - 1]];

		const bodyCenterPoints = [];
		for (let i = 0; i < body.length; i++) {
			const p = body[i];

			// Ignore points that overlap with the head and tail
			if (head.x == p.x && head.y == p.y) {
				continue;
			} else if (tail.x == p.x && tail.y == p.y) {
				continue;
			}

			const { cx, cy } = svgCirclePropsAtPoint(p);
			bodyCenterPoints.push({ cx: cx, cy: cy, x: p.x, y: p.y });
		}

		// If we're drawing *any* body, we want to extend the first and last points
		// to connect to the head and tail across the cell spacing.
		if (bodyCenterPoints.length > 0) {
			// Extend first point towards head
			const first = bodyCenterPoints[0];
			if (head.x > first.x) {
				bodyCenterPoints.unshift({ cx: first.cx + GAP_SIZE, cy: first.cy, x: 0, y: 0 });
			} else if (head.x < first.x) {
				bodyCenterPoints.unshift({ cx: first.cx - GAP_SIZE, cy: first.cy, x: 0, y: 0 });
			} else if (head.y > first.y) {
				bodyCenterPoints.unshift({ cx: first.cx, cy: first.cy - GAP_SIZE, x: 0, y: 0 });
			} else if (head.y < first.y) {
				bodyCenterPoints.unshift({ cx: first.cx, cy: first.cy + GAP_SIZE, x: 0, y: 0 });
			}

			// Extend last point towards tail
			const last = bodyCenterPoints[bodyCenterPoints.length - 1];
			if (tail.x > last.x) {
				bodyCenterPoints.push({ cx: last.cx + GAP_SIZE, cy: last.cy });
			} else if (tail.x < last.x) {
				bodyCenterPoints.push({ cx: last.cx - GAP_SIZE, cy: last.cy });
			} else if (tail.y > last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy - GAP_SIZE });
			} else if (tail.y < last.y) {
				bodyCenterPoints.push({ cx: last.cx, cy: last.cy + GAP_SIZE });
			}
		}

		// If we're drawing no body, but head and tail are different,
		// they still need to be connected.
		if (bodyCenterPoints.length == 0) {
			// We're only filling the spacing gap, so we need to
			// stop the line at the given coordinates.
			strokeLinecap = 'butt'; // lol.

			if (head.x != tail.x || head.y != tail.y) {
				const { cx, cy } = svgCirclePropsAtPoint(head);
				if (head.x > tail.x) {
					bodyCenterPoints.push({ cx: cx - CELL_SIZE_HALF + 1, cy: cy });
					bodyCenterPoints.push({ cx: cx - CELL_SIZE_HALF - CELL_SPACING - 1, cy: cy });
				} else if (head.x < tail.x) {
					bodyCenterPoints.push({ cx: cx + CELL_SIZE_HALF - 1, cy: cy });
					bodyCenterPoints.push({ cx: cx + CELL_SIZE_HALF + CELL_SPACING + 1, cy: cy });
				} else if (head.y > tail.y) {
					bodyCenterPoints.push({ cx: cx, cy: cy + CELL_SIZE_HALF - 1 });
					bodyCenterPoints.push({ cx: cx, cy: cy + CELL_SIZE_HALF + CELL_SPACING + 1 });
				} else if (head.y < tail.y) {
					bodyCenterPoints.push({ cx: cx, cy: cy - CELL_SIZE_HALF + 1 });
					bodyCenterPoints.push({ cx: cx, cy: cy - CELL_SIZE_HALF - CELL_SPACING - 1 });
				}
			}
		}

		// Finally, translate to svg polyline attribute
		const polylinePoints = bodyCenterPoints
			.map((p) => {
				return `${p.cx},${p.cy}`;
			})
			.join(' ');

		return {
			points: polylinePoints,
			'stroke-width': strokeWidth,
			'stroke-linecap': strokeLinecap,
			'stroke-linejoin': strokeLinejoin
		};
	}

	function svgTransformForSnakeHead(snake: Snake): string {
		const [head, neck] = snake.body.slice(0, 2);

		// Return transform based on relative position between neck and tail.
		// Note that if the neck and tail overlap, we return the default (right).
		// This is intended.
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
		const tailIndex = snake.body.length - 1;
		const tail = snake.body[tailIndex];

		// We need to work backwards from the tail until we reach a segment
		// that doesn't overlap or is stacked.
		let preTailIndex = tailIndex - 1;
		let preTail = snake.body[preTailIndex];

		while (preTail.x == tail.x && preTail.y == tail.y) {
			preTailIndex -= 1;
			preTail = snake.body[preTailIndex];
		}

		// Return transform based on relative location
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
				stroke={snake.color}
				fill="transparent"
				{...svgPolylinePropsForSnakeBody(snake.body)}
			/>

			<!-- Head -->
			{#await fetchCustomizationSvgDef('head', snake.head) then headSvgDef}
				{#if displayHead(snake)}
					<svg viewBox="0 0 100 100" fill={snake.color} {...svgRectPropsAtPoint(snake.body[0])}>
						<g transform={svgTransformForSnakeHead(snake)}>
							{@html headSvgDef}
						</g>
					</svg>
				{/if}
			{/await}

			<!-- Tail -->
			{#await fetchCustomizationSvgDef('tail', snake.tail) then tailSvgDef}
				{#if displayTail(snake)}
					<svg
						viewBox="0 0 100 100"
						fill={snake.color}
						{...svgRectPropsAtPoint(snake.body[snake.body.length - 1])}
					>
						<g transform={svgTransformForSnakeTail(snake)}>
							{@html tailSvgDef}
						</g>
					</svg>
				{/if}
			{/await}
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
