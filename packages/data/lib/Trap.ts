// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    name:                       string;
    description:                null | string;
    canUseGeneralPotentialItem: boolean;
    potentialItemId:            string;
    nationId:                   null;
    groupId:                    null;
    teamId:                     null;
    displayNumber:              null;
    tokenKey:                   null;
    appellation:                string;
    position:                   Position;
    tagList:                    null;
    itemUsage:                  null;
    itemDesc:                   null;
    itemObtainApproach:         null;
    isNotObtainable:            boolean;
    isSpChar:                   boolean;
    maxPotentialLevel:          number;
    rarity:                     number;
    profession:                 Profession;
    subProfessionId:            SubProfessionID;
    trait:                      null;
    phases:                     Phase[];
    skills:                     Skill[];
    talents:                    Talent[] | null;
    potentialRanks:             any[];
    favorKeyFrames:             null;
    allSkillLvlup:              any[];
}

export interface Phase {
    characterPrefabKey:  string;
    rangeId:             null | string;
    maxLevel:            number;
    attributesKeyFrames: AttributesKeyFrame[];
    evolveCost:          null;
}

export interface AttributesKeyFrame {
    level: number;
    data:  Data;
}

export interface Data {
    maxHp:            number;
    atk:              number;
    def:              number;
    magicResistance:  number;
    cost:             number;
    blockCnt:         number;
    moveSpeed:        number;
    attackSpeed:      number;
    baseAttackTime:   number;
    respawnTime:      number;
    hpRecoveryPerSec: number;
    spRecoveryPerSec: number;
    maxDeployCount:   number;
    maxDeckStackCnt:  number;
    tauntLevel:       number;
    massLevel:        number;
    baseForceLevel:   number;
    stunImmune:       boolean;
    silenceImmune:    boolean;
    sleepImmune:      boolean;
    frozenImmune:     boolean;
}

export enum Position {
    None = "NONE",
}

export enum Profession {
    Trap = "TRAP",
}

export interface Skill {
    skillId:           string;
    overridePrefabKey: null;
    overrideTokenKey:  null;
    levelUpCostCond:   any[];
    unlockCond:        UnlockCond;
}

export interface UnlockCond {
    phase: number;
    level: number;
}

export enum SubProfessionID {
    Notchar2 = "notchar2",
}

export interface Talent {
    candidates: Candidate[];
}

export interface Candidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    prefabKey:             string;
    name:                  null;
    description:           null | string;
    rangeId:               null | string;
    blackboard:            Blackboard[];
}

export interface Blackboard {
    key:   string;
    value: number;
}
