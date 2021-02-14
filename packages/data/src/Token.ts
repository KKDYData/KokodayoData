export interface Data {
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
    trait:                      null;
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
    data:  DataClass;
}

export interface DataClass {
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

export interface Talent {
    candidates: Candidate[];
}

export interface Candidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    prefabKey:             string;
    name:                  null | string;
    description:           string;
    rangeId:               RangeID | null;
    blackboard:            Blackboard[];
}

export interface Blackboard {
    key:   string;
    value: number;
}
