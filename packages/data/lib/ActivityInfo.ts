// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IInfo {
    id:                 string;
    type:               string;
    name:               string;
    startTime:          number;
    endTime:            number;
    rewardEndTime:      number;
    displayOnHome:      boolean;
    hasStage:           boolean;
    actTopBarColor:     null | string;
    actTopBarText:      null | string;
    templateShopId:     null | string;
    medalGroupId:       null | string;
    isReplicate:        boolean;
    displayType?:       DisplayType;
    ungroupedMedalIds?: string[];
}

export enum DisplayType {
    Branchline = "BRANCHLINE",
    Ministory = "MINISTORY",
    Sidestory = "SIDESTORY",
}
