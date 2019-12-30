import Cube, { CubeOption } from './Cube';
interface StopCubeOption extends CubeOption {
    time: number;
}
declare class StopCube extends Cube {
    time: number;
    constructor(opt: StopCubeOption);
    drawFace(index?: number): void;
    animate(): Promise<void>;
}
export default StopCube;
