// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用quicktype 生成的类型，不要乱改！

export interface ISkill {
    charId:      string;
    maxManpower: number;
    buffChar:    BuffChar[];
}

export interface BuffChar {
    buffData: BuffDatum[];
}

export interface BuffDatum {
    buffId: string;
    cond:   Cond;
}

export interface Cond {
    phase: number;
    level: number;
}
