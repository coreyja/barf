import type { Point } from '$lib/stores/game';

export type SvgCalcParams = {
    cellSize: number,
    cellSizeHalf: number,
    cellSpacing: number,
    height: number,
    width: number
}

export function svgCalcCellCenter(params: SvgCalcParams, p: Point): number[] {
    const [x, y] = svgCalcCellTopLeft(params, p);
    return [x + params.cellSizeHalf, y + params.cellSizeHalf];
}

export function svgCalcCellTopLeft(params: SvgCalcParams, p: Point): number[] {
    return [
        params.cellSpacing + p.x * (params.cellSize + params.cellSpacing),
        params.height - (p.y + 1) * (params.cellSize + params.cellSpacing)
    ]
}

export function svgCalcCellCircle(params: SvgCalcParams, p: Point) {
    const [x, y] = svgCalcCellCenter(params, p);
    return { cx: x, cy: y }
}

export function svgCalcCellRect(params: SvgCalcParams, p: Point) {
    const [x, y] = svgCalcCellTopLeft(params, p);
    return { x: x, y: y, width: params.cellSize, height: params.cellSize };
}
