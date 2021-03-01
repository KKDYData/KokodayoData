// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IBuff {
    buffId:       string;
    buffName:     string;
    buffIcon:     BuffIcon;
    skillIcon:    string;
    sortId:       number;
    buffColor:    BuffColor;
    textColor:    TextColor;
    buffCategory: BuffCategory;
    roomType:     RoomType;
    description:  string;
}

export enum BuffCategory {
    Function = "FUNCTION",
    Output = "OUTPUT",
    Recovery = "RECOVERY",
}

export enum BuffColor {
    Dd653F = "#dd653f",
    E3Eb00 = "#e3eb00",
    Ffd800 = "#ffd800",
    The005752 = "#005752",
    The0075A9 = "#0075a9",
    The21Cdcb = "#21cdcb",
    The565656 = "#565656",
    The7D0022 = "#7d0022",
    The8Fc31F = "#8fc31f",
}

export enum BuffIcon {
    Control = "control",
    Dormitory = "dormitory",
    Hire = "hire",
    Manufacture = "manufacture",
    Meeting = "meeting",
    Power = "power",
    Trading = "trading",
    Training = "training",
    Workshop = "workshop",
}

export enum RoomType {
    Control = "CONTROL",
    Dormitory = "DORMITORY",
    Hire = "HIRE",
    Manufacture = "MANUFACTURE",
    Meeting = "MEETING",
    Power = "POWER",
    Trading = "TRADING",
    Training = "TRAINING",
    Workshop = "WORKSHOP",
}

export enum TextColor {
    Ffffff = "#ffffff",
    The333333 = "#333333",
}
