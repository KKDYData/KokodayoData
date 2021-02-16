// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用quicktype 生成的类型，不要乱改！

export interface IData {
    name:                       string;
    description:                string;
    canUseGeneralPotentialItem: boolean;
    potentialItemId:            string;
    nationId:                   null | string;
    groupId:                    null | string;
    teamId:                     null | string;
    displayNumber:              string;
    tokenKey:                   null | string;
    appellation:                string;
    position:                   Position;
    tagList:                    TagList[];
    itemUsage:                  string;
    itemDesc:                   string;
    itemObtainApproach:         ItemObtainApproach;
    isNotObtainable:            boolean;
    isSpChar:                   boolean;
    maxPotentialLevel:          number;
    rarity:                     number;
    profession:                 Profession;
    trait:                      Trait | null;
    phases:                     Phase[];
    skills:                     Skill[];
    talents:                    Talent[];
    potentialRanks:             PotentialRank[];
    favorKeyFrames:             KeyFrame[];
    allSkillLvlup:              AllSkillLvlup[];
}

export interface AllSkillLvlup {
    unlockCond: UnlockCond;
    lvlUpCost:  Cost[];
}

export interface Cost {
    id:    string;
    count: number;
    type:  Type;
}

export enum Type {
    Material = "MATERIAL",
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
}

export enum ItemObtainApproach {
    主线剧情 = "主线剧情",
    信用交易所 = "信用交易所",
    凭证交易所 = "凭证交易所",
    周年奖励 = "周年奖励",
    招募寻访 = "招募寻访",
    活动获得 = "活动获得",
    限时礼包 = "限时礼包",
}

export interface Phase {
    characterPrefabKey:  string;
    rangeId:             string;
    maxLevel:            number;
    attributesKeyFrames: KeyFrame[];
    evolveCost:          Cost[] | null;
}

export enum Position {
    Melee = "MELEE",
    Ranged = "RANGED",
}

export interface PotentialRank {
    type:           number;
    description:    string;
    buff:           Buff | null;
    equivalentCost: null;
}

export interface Buff {
    attributes: Attributes;
}

export interface Attributes {
    abnormalFlags:        null;
    abnormalImmunes:      null;
    abnormalAntis:        null;
    abnormalCombos:       null;
    abnormalComboImmunes: null;
    attributeModifiers:   AttributeModifier[];
}

export interface AttributeModifier {
    attributeType:                  number;
    formulaItem:                    number;
    value:                          number;
    loadFromBlackboard:             boolean;
    fetchBaseValueFromSourceEntity: boolean;
}

export enum Profession {
    Caster = "CASTER",
    Medic = "MEDIC",
    Pioneer = "PIONEER",
    Sniper = "SNIPER",
    Special = "SPECIAL",
    Support = "SUPPORT",
    Tank = "TANK",
    Warrior = "WARRIOR",
}

export interface Skill {
    skillId:           string;
    overridePrefabKey: null | string;
    overrideTokenKey:  null | string;
    levelUpCostCond:   LevelUpCostCond[];
    unlockCond:        UnlockCond;
}

export interface LevelUpCostCond {
    unlockCond:  UnlockCond;
    lvlUpTime:   number;
    levelUpCost: Cost[];
}

export enum TagList {
    位移 = "位移",
    减速 = "减速",
    削弱 = "削弱",
    召唤 = "召唤",
    快速复活 = "快速复活",
    控场 = "控场",
    支援 = "支援",
    新手 = "新手",
    治疗 = "治疗",
    爆发 = "爆发",
    生存 = "生存",
    群攻 = "群攻",
    费用回复 = "费用回复",
    输出 = "输出",
    防护 = "防护",
}

export interface Talent {
    candidates: TalentCandidate[];
}

export interface TalentCandidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    prefabKey:             string;
    name:                  string;
    description:           string;
    rangeId:               RangeID | null;
    blackboard:            Blackboard[];
}

export interface Blackboard {
    key:   string;
    value: number;
}

export enum RangeID {
    B1 = "b-1",
    The31 = "3-1",
    X4 = "x-4",
    X5 = "x-5",
}

export interface Trait {
    candidates: TraitCandidate[];
}

export interface TraitCandidate {
    unlockCondition:       UnlockCond;
    requiredPotentialRank: number;
    blackboard:            Blackboard[];
    overrideDescripton:    null | string;
    prefabKey:             null | string;
    rangeId:               null;
}
