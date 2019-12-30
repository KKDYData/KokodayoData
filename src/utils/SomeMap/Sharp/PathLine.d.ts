import Line, { LineOption } from "./Line";
import { GradientColor } from '../utils';
export interface PathLineOption extends LineOption {
    gradientColors: GradientColor[];
    time?: number;
    color?: number;
}
declare class PathLine extends Line {
    private _gradientColors;
    run: boolean;
    time: number;
    color: number;
    constructor(opt: PathLineOption);
    update(): void;
    animate(_time: number, _color: number): Promise<unknown>;
    set strokeStyle(set: string | CanvasGradient);
    get strokeStyle(): "？？？？？？？" | CanvasGradient;
    set gradientColors(colors: GradientColor[]);
    get gradientColors(): GradientColor[];
}
export default PathLine;
