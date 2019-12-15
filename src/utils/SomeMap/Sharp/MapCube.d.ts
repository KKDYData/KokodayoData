import Cube, { CubeOption } from "./Cube";
import { TileInfo } from '../data/tailInfo';
interface MapCubeOption extends CubeOption {
    tileInfo: TileInfo;
}
declare class MapCube extends Cube {
    tileInfo: TileInfo;
    constructor(opt: MapCubeOption);
}
export default MapCube;
