export interface TileInfo {
    name: string;
    description: string;
    color: string;
}
export interface TilesInfo {
    [index: string]: TileInfo;
}
declare const tileInfo: TilesInfo;
export { tileInfo };
