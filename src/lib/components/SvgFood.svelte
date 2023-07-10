<script lang="ts">
	import type { Point } from '$lib/stores/game';
	import { type SvgCalcParams, svgCalcCellCircle } from './svg-calculator';

	export let key: string;
	export let point: Point;
	export let svgCalcParams: SvgCalcParams;

	const FOOD_COLOR = '#ff5c75';

	$: FOOD_RADIUS = (svgCalcParams.cellSize / 3.25).toFixed(2);
</script>

<circle
	id={`food-${key}`}
	class="food"
	r={FOOD_RADIUS}
	fill={FOOD_COLOR}
	{...svgCalcCellCircle(svgCalcParams, point)}
/>
