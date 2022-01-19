// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    phases: Phase[];
}

export interface Phase {
    equipLevel:               number;
    parts:                    Part[];
    attributeBlackboard:      AttributeBlackboard[];
    tokenAttributeBlackboard: TokenAttributeBlackboard;
}

export interface AttributeBlackboard {
    key:   string;
    value: number;
}

export interface Part {
    resKey:                        null | string;
    target:                        Target;
    addOrOverrideTalentDataBundle: AddOrOverrideTalentDataBundle;
    overrideTraitDataBundle:       OverrideTraitDataBundle;
}

export interface AddOrOverrideTalentDataBundle {
    candidates: AddOrOverrideTalentDataBundleCandidate[] | null;
}

export interface AddOrOverrideTalentDataBundleCandidate {
    displayRangeId:        boolean;
    unlockCondition:       UnlockCondition;
    requiredPotentialRank: number;
    prefabKey:             string;
    name:                  null;
    description:           null;
    rangeId:               null | string;
    blackboard:            AttributeBlackboard[];
}

export interface UnlockCondition {
    phase: number;
    level: number;
}

export interface OverrideTraitDataBundle {
    candidates: OverrideTraitDataBundleCandidate[] | null;
}

export interface OverrideTraitDataBundleCandidate {
    additionalDescription: null | string;
    unlockCondition:       UnlockCondition;
    requiredPotentialRank: number;
    blackboard:            AttributeBlackboard[];
    overrideDescripton:    null | string;
    prefabKey:             null | string;
    rangeId:               null;
}

export enum Target {
    Display = "DISPLAY",
    Talent = "TALENT",
    Trait = "TRAIT",
    TraitDataOnly = "TRAIT_DATA_ONLY",
}

export interface TokenAttributeBlackboard {
    token_10001_deepcl_tentac?: AttributeBlackboard[];
}
