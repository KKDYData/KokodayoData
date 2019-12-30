import SomeMap from '..';
import Cube from '../Sharp/Cube';
import { Pos } from '../Sharp/Base';
import { Options, P, GradientParm } from '.';
declare const setOption: (option: Options, target: any) => void;
declare const changeFaceColor: (color?: string) => (cube: Cube, context: SomeMap) => void;
declare const sleep: (time: number) => Promise<unknown>;
declare const changeXZ: (width: number, height: number, r: number, xOffset: number, yOffset: number) => ({ x, y }: Pos) => Pos;
declare const gradient: (ctx: CanvasRenderingContext2D, { vector, colors }: GradientParm) => CanvasGradient;
declare class TaskQueue {
    concurrency: number;
    running: number;
    queue: P[];
    finalTask: Function;
    constructor(concurrency?: number, finalTask?: () => void, queue?: P[]);
    pushTask(task: P): void;
    clear(): void;
    next(): void;
}
declare const arrangeCube: (arr: Cube[], defaultX: number) => Cube[];
declare const loadImage: (src: string) => Promise<HTMLImageElement>;
export { setOption, changeFaceColor, sleep, TaskQueue, arrangeCube, changeXZ, gradient, loadImage };
