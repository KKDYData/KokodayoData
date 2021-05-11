// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    Key:   string;
    Value: Value[];
}

export interface Value {
    level:     number;
    enemyData: EnemyData;
}

export interface EnemyData {
    name:             Description;
    description:      Description;
    prefabKey:        Description;
    attributes:       Attributes;
    lifePointReduce:  LifePointReduce;
    rangeRadius:      LifePointReduce;
    talentBlackboard: Blackboard[] | null;
    skills:           Skill[] | null;
    spData:           SPData | null;
}

export interface Attributes {
    maxHp:            LifePointReduce;
    atk:              LifePointReduce;
    def:              LifePointReduce;
    magicResistance:  LifePointReduce;
    cost:             LifePointReduce;
    blockCnt:         LifePointReduce;
    moveSpeed:        LifePointReduce;
    attackSpeed:      LifePointReduce;
    baseAttackTime:   LifePointReduce;
    respawnTime:      LifePointReduce;
    hpRecoveryPerSec: LifePointReduce;
    spRecoveryPerSec: LifePointReduce;
    maxDeployCount:   LifePointReduce;
    massLevel:        LifePointReduce;
    baseForceLevel:   LifePointReduce;
    tauntLevel:       LifePointReduce;
    stunImmune:       Immune;
    silenceImmune:    Immune;
    sleepImmune:      Immune;
}

export interface LifePointReduce {
    m_defined: boolean;
    m_value:   number;
}

export interface Immune {
    m_defined: boolean;
    m_value:   boolean;
}

export interface Description {
    m_defined: boolean;
    m_value:   null | string;
}

export interface Skill {
    prefabKey:    string;
    priority:     number;
    cooldown:     number;
    initCooldown: number;
    spCost:       number;
    blackboard:   Blackboard[] | null;
}

export interface Blackboard {
    key:      string;
    value:    number;
    valueStr: null | string;
}

export interface SPData {
    spType:    number;
    maxSp:     number;
    initSp:    number;
    increment: number;
}
