// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    enemyId:              string;
    enemyIndex:           string;
    enemyTags:            EnemyTag[] | null;
    sortId:               number;
    name:                 string;
    enemyRace:            EnemyRace | null;
    enemyLevel:           EnemyLevel;
    description:          string;
    attackType:           AttackType;
    endure:               Attack;
    attack:               Attack;
    defence:              Attack;
    resistance:           Attack;
    ability:              null | string;
    isInvalidKilled:      boolean;
    overrideKillCntInfos: OverrideKillCntInfos;
}

export enum Attack {
    A = "A",
    AttackA = "A+",
    AttackB = "B+",
    AttackD = "D+",
    AttackS = "S+",
    B = "B",
    C = "C",
    D = "D",
    Empty = "?",
    S = "S",
}

export enum AttackType {
    不攻击 = "不攻击",
    治疗 = "治疗",
    近战 = "近战",
    近战法术 = "近战 法术",
    近战远程 = "近战 远程",
    远程 = "远程",
    远程法术 = "远程 法术",
}

export enum EnemyLevel {
    Boss = "BOSS",
    Elite = "ELITE",
    Normal = "NORMAL",
}

export enum EnemyRace {
    宿主 = "宿主",
    感染生物 = "感染生物",
    无人机 = "无人机",
    萨卡兹 = "萨卡兹",
}

export enum EnemyTag {
    Drone = "drone",
    Infection = "infection",
    Mutant = "mutant",
    Sarkaz = "sarkaz",
}

export interface OverrideKillCntInfos {
}
