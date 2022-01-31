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
    trait:                      Trait | null;
    phases:                     Phase[];
    skills:                     Skill[];
    talents:                    Talent[] | null;
    potentialRanks:             any[];
    favorKeyFrames:             KeyFrame[] | null;
    allSkillLvlup:              AllSkillLvlup[];
}

export interface AllSkillLvlup {
    unlockCond: UnlockCond;
    lvlUpCost:  null;
}

export interface UnlockCond {
    phase: number;
    level: number;
}

export interface KeyFrame {
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

export interface Phase {
    characterPrefabKey:  string;
    rangeId:             RangeID;
    maxLevel:            number;
    attributesKeyFrames: KeyFrame[];
    evolveCost:          null;
}

export enum RangeID {
    The01 = "0-1",
    The11 = "1-1",
    The31 = "3-1",
    The32 = "3-2",
    The36 = "3-6",
    X4 = "x-4",
    X5 = "x-5",
}

export enum Position {
    All = "ALL",
    Melee = "MELEE",
    Ranged = "RANGED",
}

export enum Profession {
    Token = "TOKEN",
}

export interface Skill {
    skillId:           null | string;
    overridePrefabKey: null;
    overrideTokenKey:  null;
    levelUpCostCond:   LevelUpCostCond[];
    unlockCond:        UnlockCond;
}

export interface LevelUpCostCond {
    unlockCond:  UnlockCond;
    lvlUpTime:   number;
    levelUpCost: null;
}

export enum SubProfessionID {
    Executor = "executor",
    Notchar1 = "notchar1",
}

export interface Talent {
    candidates: TalentCandidate[] | null;
}

export interface TalentCandidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    prefabKey:             string;
    name:                  null | string;
    description:           null | string;
    rangeId:               RangeID | null;
    blackboard:            Blackboard[];
}

export interface Blackboard {
    key:   string;
    value: number;
}

export interface Trait {
    candidates: TraitCandidate[];
}

export interface TraitCandidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    blackboard:            Blackboard[];
    overrideDescripton:    string;
    prefabKey:             null | string;
    rangeId:               null;
}
