// interfaces
export declare type AKDict<T> = { [key: string]: T }
export declare type AKObject = AKDict<any>  // shortcut!

export declare type AKCharacter = {
    charId: string;
    skillId: string;
    phase?: number;
    level?: number;
    favor?: number;
    skillLevel?: number;
    potentialRank?: number;
    options?: AKDict<boolean>;
}

export declare type AKEnemy = {
    def: number;
    magicResistance: number;
    count: number;
}

export declare type AKRaidBuff = {
    atk?: number;
    atkpct?: number;
    ats?: number;
    cdr?: number;
    base_atk?: number;
    damage_scale?: number;
}

// exports
export const GameDataRoot: string;
export const new_op: string[];
export const professionNames: { [name: string]: string };
export var Data: AKObject;
export namespace Attributes {
    function getCharAttributes(char: AKCharacter): AKDict<number>;
    function calculateDps(char: AKCharacter, enemy: AKEnemy, raidBuff: AKRaidBuff): AKObject
    function calculateDpsSeries(char: AKCharacter, enemy: AKEnemy, raidBuff: AKRaidBuff, key: string, series: number[]): AKObject
}
