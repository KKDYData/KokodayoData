import SomeMap from '..';
export interface BaseOption {
    ctx: CanvasRenderingContext2D;
    father: SomeMap;
    canvasWidth: number;
    canvasHeight: number;
}
export interface Vi {
    x: number;
    y: number;
    z: number;
}
export interface Perspective {
    PERSPECTIVE: number;
    PROJECTION_CENTER_X: number;
    PROJECTION_CENTER_Y: number;
}
export interface Pos {
    x: number;
    y: number;
}
export declare type LinePoint = Pos;
export interface Evt {
    x: number;
    y: number;
}
export interface BaseTodo {
    [index: string]: Function[];
}
export interface MapMouseEvent extends MouseEvent {
    readonly layerX: number;
    readonly layerY: number;
}
declare class Base {
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
    father: SomeMap;
    perspective: Perspective;
    constructor({ canvasWidth, canvasHeight, father, ctx }: BaseOption);
    project({ x, y, z }: Vi, { PERSPECTIVE, PROJECTION_CENTER_X, PROJECTION_CENTER_Y }: Perspective): {
        size: number;
        x: number;
        y: number;
    };
    update(): void;
}
export default Base;
