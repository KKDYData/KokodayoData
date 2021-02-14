export interface Data {
    enemyId:              string;
    enemyIndex:           string;
    enemyTags:            null;
    sortId:               number;
    name:                 string;
    enemyRace:            null;
    enemyLevel:           string;
    description:          string;
    attackType:           string;
    endure:               string;
    attack:               string;
    defence:              string;
    resistance:           string;
    ability:              string;
    isInvalidKilled:      boolean;
    overrideKillCntInfos: OverrideKillCntInfos;
}

export interface OverrideKillCntInfos {
    camp_r_03: number;
}
