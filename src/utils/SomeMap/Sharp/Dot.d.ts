import { BaseOption } from './Base';
declare class Dot {
    x: number;
    y: number;
    z: number;
    theta: number;
    phi: number;
    radius: number;
    globalRadius: number;
    canvasWidth: number;
    canvasHeight: number;
    xProjected: number;
    yProjected: number;
    scaleProjected: number;
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, { canvasWidth, canvasHeight }: BaseOption);
    project(PERSPECTIVE: number, PROJECTION_CENTER_X: number, PROJECTION_CENTER_Y: number): void;
    draw(p: number, px: number, py: number): void;
}
export default Dot;
