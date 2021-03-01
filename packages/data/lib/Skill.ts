// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface ISkill {
    skillId: string;
    iconId:  null | string;
    hidden:  boolean;
    levels:  Level[];
}

export interface Level {
    name:        string;
    rangeId:     RangeID | null;
    description: string;
    skillType:   number;
    spData:      SPData;
    prefabId:    null | string;
    duration:    number;
    blackboard:  Blackboard[];
}

export interface Blackboard {
    key:   string;
    value: number;
}

export enum RangeID {
    The01 = "0-1",
    The11 = "1-1",
    The12 = "1-2",
    The13 = "1-3",
    The22 = "2-2",
    The25 = "2-5",
    The31 = "3-1",
    The310 = "3-10",
    The312 = "3-12",
    The313 = "3-13",
    The314 = "3-14",
    The315 = "3-15",
    The316 = "3-16",
    The32 = "3-2",
    The33 = "3-3",
    The34 = "3-4",
    The37 = "3-7",
    The41 = "4-1",
    X1 = "x-1",
    X2 = "x-2",
    X3 = "x-3",
    X4 = "x-4",
    X5 = "x-5",
    X6 = "x-6",
    Y4 = "y-4",
    Y7 = "y-7",
    Y8 = "y-8",
}

export interface SPData {
    spType:        number;
    levelUpCost:   null;
    maxChargeTime: number;
    spCost:        number;
    initSp:        number;
    increment:     number;
}
