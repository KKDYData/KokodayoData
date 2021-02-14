export interface Data {
    id:        string;
    direction: number;
    grids:     Grid[];
}

export interface Grid {
    row: number;
    col: number;
}
