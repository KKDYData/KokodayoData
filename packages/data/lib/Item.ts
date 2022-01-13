// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    itemId:              string;
    name:                string;
    description:         null | string;
    rarity:              number;
    iconId:              string;
    overrideBkg:         null;
    stackIconId:         null | string;
    sortId:              number;
    usage:               null | string;
    obtainApproach:      null | string;
    classifyType:        ClassifyType;
    itemType:            string;
    stageDropList:       StageDropList[];
    buildingProductList: BuildingProductList[];
    hideInItemGet?:      boolean;
}

export interface BuildingProductList {
    roomType:  RoomType;
    formulaId: string;
}

export enum RoomType {
    Manufacture = "MANUFACTURE",
    Workshop = "WORKSHOP",
}

export enum ClassifyType {
    Consume = "CONSUME",
    Material = "MATERIAL",
    None = "NONE",
    Normal = "NORMAL",
}

export interface StageDropList {
    stageId: string;
    occPer:  OccPer;
}

export enum OccPer {
    Almost = "ALMOST",
    Always = "ALWAYS",
    Often = "OFTEN",
    Sometimes = "SOMETIMES",
    Usual = "USUAL",
}
