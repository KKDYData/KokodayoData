import Cube, { CubeSetOption } from './Sharp/Cube';
import PathLine from './Sharp/PathLine';
import { Grid } from 'pathfinding';
import { MapData, R } from './data/mapdata';
import { Perspective, Pos, LinePoint } from './Sharp/Base';
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
    updateArr: Cube[];
    drawing: boolean;
    baseOpt: any;
    routes: PathLine[];
    RawRoutes: R[];
    r: number;
    xz: (x: Pos) => Pos;
    background: HTMLImageElement;
    grid: Grid;
    constructor(container: HTMLCanvasElement, theta: number | undefined, PERSPECTIVE: number, mapData: MapData, routes: R[]);
    init(mapdata: MapData): void;
    loopRoutes(from?: number, to?: number): Promise<void>;
    addPath(points: LinePoint[], time?: number, color?: number): PathLine;
    setPerspective(opt: CubeSetOption): void;
    draw(isMapUpdate: boolean): Promise<void>;
}
export default SomeMap;
