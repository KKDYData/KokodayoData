import Cube, { CubeSetOption } from './Sharp/Cube';
import PathLine from './Sharp/PathLine';
import { Grid } from 'pathfinding';
import { MapData, Route, R } from './data/mapdata';
import { Perspective, Pos, LinePoint } from './Sharp/Base';
import StopCube from './Sharp/StopCube';
interface StopRoute {
    animate: () => Promise<void>;
    set: () => void;
    draw: () => void;
}
declare class SomeMap {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;
    dots: Cube[];
    perspective: Perspective;
    i: number;
    theta: number;
    data: {
        width: number;
        height: number;
    };
    baseFloor: Cube;
    drawing: boolean;
    baseOpt: any;
    routes: Map<number, (PathLine | StopRoute | StopCube)[]>;
    RawRoutes: R[];
    r: number;
    xz: (x: Pos) => Pos;
    background: HTMLImageElement;
    grid: Grid;
    looping: boolean;
    constructor(container: HTMLCanvasElement, theta: number | undefined, PERSPECTIVE: number, mapData: MapData, routes: R[]);
    loop(): void;
    init(mapdata: MapData, routes: R[]): void;
    deleteRoute(index: number): void;
    deleteAll(): void;
    loopRoutes(from?: number, to?: number): Promise<void>;
    loopRoute(index: number, color: number): void;
    initRoute(raw: Route, rIndex: number, color?: number): void;
    initPath(points: LinePoint[], time?: number, color?: number, fly?: boolean): PathLine;
    setPerspective(opt: CubeSetOption): void;
    update(): void;
    draw(isMapUpdate: boolean): Promise<void>;
}
export default SomeMap;
