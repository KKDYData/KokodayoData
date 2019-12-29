import Base, { BaseOption, Perspective, BaseTodo, Pos, MapMouseEvent } from './Base';
export interface CubeOption extends BaseOption {
    x: number;
    y: number;
    z: number;
    pos: Pos;
    theta?: number;
    radius?: number;
    cubeWidth?: number;
    cubeHeight?: number;
    cubeLength?: number;
    faceColor?: string;
    text?: string;
}
export interface CubeSetOption {
    theta?: number;
    perspective?: Perspective;
    faceColor?: FaceColor;
    clicked?: boolean;
}
export interface CubeBackState {
    attr: CubeSetOption;
    state: {
        [index: string]: any;
    };
}
export interface CubeAnimationOption extends CubeSetOption {
    x?: number;
    y?: number;
    z?: number;
}
export interface FaceColor {
    [index: number]: string;
}
export declare const CUBE_LINES: number[][];
export declare const CUBE_FACE: number[][];
export declare const CUBE_VERTICES: number[][];
declare class Cube extends Base {
    width: number;
    length: number;
    height: number;
    faces: Path2D[];
    faceColor: FaceColor;
    todo: BaseTodo;
    pos: Pos;
    strokeStyle: string;
    backUpAttr: CubeBackState;
    text: string;
    constructor(cubeOption: CubeOption);
    restore(): void;
    set(opt: CubeSetOption): void;
    pointInPath(evt: MapMouseEvent): boolean;
    on(type: keyof GlobalEventHandlersEventMap, todo: Function): void;
    animate(opt: CubeAnimationOption): void;
    viToXy([x, y, z]: number[]): {
        size: number;
        x: number;
        y: number;
    };
    drawFace(index?: number): void;
    draw(): void;
}
export default Cube;
