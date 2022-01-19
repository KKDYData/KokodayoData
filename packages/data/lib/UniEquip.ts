// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IInfo {
    uniEquipId:        string;
    uniEquipName:      string;
    uniEquipIcon:      string;
    uniEquipDesc:      string;
    typeIcon:          string;
    typeName:          string;
    equipShiningColor: EquipShiningColor;
    showEvolvePhase:   number;
    unlockEvolvePhase: number;
    charId:            string;
    tmplId:            null;
    showLevel:         number;
    unlockLevel:       number;
    unlockFavorPoint:  number;
    missionList:       string[];
    itemCost:          ItemCost[] | null;
    type:              IInfoType;
}

export enum EquipShiningColor {
    Blue = "blue",
    Green = "green",
    Grey = "grey",
    Red = "red",
}

export interface ItemCost {
    id:    string;
    count: number;
    type:  ItemCostType;
}

export enum ItemCostType {
    Gold = "GOLD",
    Material = "MATERIAL",
}

export enum IInfoType {
    Advanced = "ADVANCED",
    Initial = "INITIAL",
}
