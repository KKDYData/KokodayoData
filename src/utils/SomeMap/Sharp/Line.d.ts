import Base, { BaseOption, LinePoint, Pos } from "./Base";
import { CubeSetOption } from './Cube';
export interface LineOption extends BaseOption {
    points: LinePoint[];
    r: number;
    y?: number;
    width?: number;
}
declare class Line extends Base {
    points: Pos[];
    absPath: Pos[];
    width: number;
    strokeStyle: string | CanvasGradient;
    path: Path2D;
    i: number;
    constructor(opt: LineOption);
    set(opt: CubeSetOption): void;
    init(): void;
    draw(): void;
    viToXy({ x, y }: Pos): {
        size: number;
        x: number;
        y: number;
    };
}
export default Line;
