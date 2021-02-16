// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用quicktype 生成的类型，不要乱改！

export interface IData {
    id:        string;
    direction: number;
    grids:     Grid[];
}

export interface Grid {
    row: number;
    col: number;
}
