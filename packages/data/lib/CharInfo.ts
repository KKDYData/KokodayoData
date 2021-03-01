// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IInfo {
    charID:          string;
    drawName:        string;
    infoName:        string;
    storyTextAudio:  StoryTextAudio[];
    handbookAvgList: HandbookAvgList[];
}

export interface HandbookAvgList {
    storySetId:   string;
    storySetName: string;
    sortId:       number;
    storyGetTime: number;
    rewardItem:   any[];
    unlockParam:  UnlockParam[];
    avgList:      AvgList[];
    charId:       string;
}

export interface AvgList {
    storyId:      string;
    storySetId:   string;
    storySort:    number;
    storyCanShow: boolean;
    storyIntro:   string;
    storyInfo:    string;
    storyTxt:     string;
}

export interface UnlockParam {
    unlockType:   number;
    unlockParam1: string;
    unlockParam2: null | string;
    unlockParam3: null;
}

export interface StoryTextAudio {
    stories:     Story[];
    storyTitle:  StoryTitle;
    unLockorNot: boolean;
}

export interface Story {
    storyText:    string;
    unLockType:   number;
    unLockParam:  string;
    unLockString: UnLockString;
}

export enum UnLockString {
    Empty = "",
    UnLockString = "？？？？？",
}

export enum StoryTitle {
    Empty = "？？？",
    临床诊断分析 = "临床诊断分析",
    升变档案一 = "升变档案一",
    基础档案 = "基础档案",
    客观履历 = "客观履历",
    情报资料一 = "情报资料一",
    晋升记录 = "晋升记录",
    晋升资料 = "晋升资料",
    档案资料一 = "档案资料一",
    档案资料三 = "档案资料三",
    档案资料二 = "档案资料二",
    档案资料四 = "档案资料四",
    源石技艺评定 = "源石技艺评定",
    综合体检测试 = "综合体检测试",
    综合性能检测结果 = "综合性能检测结果",
}
