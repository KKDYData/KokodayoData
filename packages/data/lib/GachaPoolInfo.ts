// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IInfo {
    gachaPoolId:      string;
    gachaIndex:       number;
    openTime:         number;
    endTime:          number;
    gachaPoolName:    string;
    gachaPoolSummary: string;
    gachaPoolDetail:  null | string;
    guarantee5Avail:  number;
    guarantee5Count:  number;
    CDPrimColor:      null | string;
    CDSecColor:       null | string;
    LMTGSID:          null | string;
    gachaRuleType:    GachaRuleType;
    storeTextColor?:  string;
    linkageRuleId?:   string;
    linkageParam?:    LinkageParam;
}

export enum GachaRuleType {
    Limited = "LIMITED",
    Linkage = "LINKAGE",
    Normal = "NORMAL",
}

export interface LinkageParam {
    guaranteeTarget6Count: number;
}
