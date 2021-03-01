// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IStage {
    stageType:             StageType;
    difficulty:            Difficulty;
    performanceStageFlag:  PerformanceStageFlag;
    unlockCondition:       UnlockCondition[];
    stageId:               string;
    levelId:               null | string;
    zoneId:                string;
    code:                  string;
    name:                  null | string;
    description:           null | string;
    hardStagedId:          null | string;
    dangerLevel:           null | string;
    dangerPoint:           number;
    loadingPicId:          string;
    canPractice:           boolean;
    canBattleReplay:       boolean;
    apCost:                number;
    apFailReturn:          number;
    etItemId:              null | string;
    etCost:                number;
    etFailReturn:          number;
    etButtonStyle:         null | string;
    apProtectTimes:        number;
    diamondOnceDrop:       number;
    practiceTicketCost:    number;
    dailyStageDifficulty:  number;
    expGain:               number;
    goldGain:              number;
    loseExpGain:           number;
    loseGoldGain:          number;
    passFavor:             number;
    completeFavor:         number;
    slProgress:            number;
    displayMainItem:       null | string;
    hilightMark:           boolean;
    bossMark:              boolean;
    isPredefined:          boolean;
    isHardPredefined:      boolean;
    isStoryOnly:           boolean;
    appearanceStyle:       number;
    stageDropInfo:         StageDropInfo;
    startButtonOverrideId: StartButtonOverrideID | null;
    isStagePatch:          boolean;
    mainStageId:           null | string;
    extraCondition?:       ExtraCondition[];
    extraInfo?:            ExtraInfo[];
}

export enum Difficulty {
    FourStar = "FOUR_STAR",
    Normal = "NORMAL",
}

export interface ExtraCondition {
    index:       number;
    template:    string;
    unlockParam: string[];
}

export interface ExtraInfo {
    stageId:      string;
    rewards:      Reward[];
    progressInfo: ProgressInfo;
}

export interface ProgressInfo {
    progressType: string;
    descList:     { [key: string]: string } | null;
}

export interface Reward {
    id:    string;
    count: number;
    type:  Type;
}

export enum Type {
    ActivityItem = "ACTIVITY_ITEM",
    CardExp = "CARD_EXP",
    Char = "CHAR",
    Diamond = "DIAMOND",
    EtStage = "ET_STAGE",
    Furn = "FURN",
    Gold = "GOLD",
    Material = "MATERIAL",
    TktRecruit = "TKT_RECRUIT",
}

export enum PerformanceStageFlag {
    NormalStage = "NORMAL_STAGE",
    PerformanceStage = "PERFORMANCE_STAGE",
}

export interface StageDropInfo {
    firstPassRewards:     null;
    firstCompleteRewards: null;
    passRewards:          null;
    completeRewards:      null;
    displayRewards:       DisplayReward[];
    displayDetailRewards: DisplayReward[];
}

export interface DisplayReward {
    occPercent?: number;
    type:        Type;
    id:          string;
    dropType:    number;
}

export enum StageType {
    Activity = "ACTIVITY",
    Campaign = "CAMPAIGN",
    Daily = "DAILY",
    Guide = "GUIDE",
    Main = "MAIN",
    SpecialStory = "SPECIAL_STORY",
    Sub = "SUB",
}

export enum StartButtonOverrideID {
    HighDifficulty = "HIGH_DIFFICULTY",
}

export interface UnlockCondition {
    stageId:       string;
    completeState: number;
}
