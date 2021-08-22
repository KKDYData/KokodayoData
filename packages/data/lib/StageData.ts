// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IData {
    options:               Options;
    levelId:               null;
    mapId:                 null;
    bgmEvent:              null | string;
    mapData:               MapData;
    tilesDisallowToLocate: any[];
    runes:                 Rune[] | null;
    globalBuffs:           GlobalBuff[] | null;
    routes:                Array<Route | null>;
    enemies:               any[];
    enemyDbRefs:           EnemyDBRef[];
    waves:                 Wave[];
    branches?:             { [key: string]: Branch } | null;
    predefines:            Predefines | null;
    excludeCharIdList:     null;
    randomSeed:            number;
    environmentSe?:        EnvironmentSE | null;
    hardPredefines?:       Predefines | null;
    operaConfig?:          null | string;
    extraRoutes?:          Array<Route | null>;
}

export interface Branch {
    phases: Phase[];
}

export interface Phase {
    preDelay: number;
    actions:  Action[];
}

export interface Action {
    actionType:                        number;
    managedByScheduler:                boolean;
    key:                               string;
    count:                             number;
    preDelay:                          number;
    interval:                          number;
    routeIndex:                        number;
    blockFragment:                     boolean;
    autoPreviewRoute:                  boolean;
    isUnharmfulAndAlwaysCountAsKilled: boolean;
    hiddenGroup?:                      null | string;
    randomSpawnGroupKey?:              RandomSpawnGroupKey | null;
    weight?:                           number;
    dontBlockWave?:                    boolean;
    weightValue?:                      number;
}

export enum RandomSpawnGroupKey {
    G1 = "g1",
    G2 = "g2",
    G3 = "g3",
    G4 = "g4",
    G5 = "g5",
    G6 = "g6",
}

export interface EnemyDBRef {
    useDb:           boolean;
    id:              string;
    level:           number;
    overwrittenData: OverwrittenData | null;
}

export interface OverwrittenData {
    name:             Description;
    description:      Description;
    prefabKey:        Description;
    attributes:       Attributes;
    lifePointReduce:  LifePointReduce;
    rangeRadius:      LifePointReduce;
    talentBlackboard: Blackboard[] | null;
    skills:           Skill[] | null;
    spData?:          SPData | null;
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
    stunImmune:       Immune;
    silenceImmune:    Immune;
    sleepImmune?:     Immune;
    tauntLevel?:      LifePointReduce;
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

export enum EnvironmentSE {
    Beach = "beach",
    Magma = "magma",
}

export interface Route {
    motionMode:            number;
    startPosition:         Position;
    endPosition:           Position;
    spawnRandomRange:      SpawnOffset;
    spawnOffset:           SpawnOffset;
    checkpoints:           Checkpoint[];
    allowDiagonalMove:     boolean;
    visitEveryTileCenter:  boolean;
    visitEveryNodeCenter:  boolean;
    visitEveryCheckPoint?: boolean;
}

export interface Checkpoint {
    type:                 number;
    time:                 number;
    position:             Position;
    reachOffset:          SpawnOffset;
    randomizeReachOffset: boolean;
    reachDistance:        number;
}

export interface Position {
    row: number;
    col: number;
}

export interface SpawnOffset {
    x: number;
    y: number;
}

export interface GlobalBuff {
    prefabKey:            string;
    blackboard:           Blackboard[];
    overrideCameraEffect: null;
}

export interface Predefines {
    characterInsts: CharacterCard[];
    tokenInsts:     CharacterCard[];
    characterCards: CharacterCard[];
    tokenCards:     CharacterCard[];
}

export interface CharacterCard {
    hidden:                   boolean;
    alias:                    null | string;
    inst:                     Inst;
    skillIndex:               number;
    mainSkillLvl:             number;
    skinId:                   null;
    tmplId?:                  null;
    overrideSkillBlackboard?: Blackboard[] | null;
    position?:                Position;
    direction?:               number;
    initialCnt?:              number;
}

export interface Inst {
    characterKey:  string;
    level:         number;
    phase:         number;
    favorPoint:    number;
    potentialRank: number;
}

export interface MapData {
    map:         Array<number[]>;
    tiles:       Tile[];
    blockEdges:  null;
    effects:     null;
    width:       number;
    height:      number;
    tags?:       Tag[] | null;
    layerRects?: string[] | null;
}

export enum Tag {
    Water = "water",
}

export interface Tile {
    tileKey:         TileKey;
    heightType:      number;
    buildableType:   number;
    passableMask:    number;
    blackboard:      Blackboard[] | null;
    effects:         Effect[] | null;
    playerSideMask?: number;
}

export interface Effect {
    key:       string;
    offset:    Offset;
    direction: number;
}

export interface Offset {
    x: number;
    y: number;
    z: number;
}

export enum TileKey {
    TileBigforce = "tile_bigforce",
    TileCorrosion = "tile_corrosion",
    TileDeepsea = "tile_deepsea",
    TileDeepwater = "tile_deepwater",
    TileDefbreak = "tile_defbreak",
    TileDefup = "tile_defup",
    TileEmpty = "tile_empty",
    TileEnd = "tile_end",
    TileFence = "tile_fence",
    TileFloor = "tile_floor",
    TileFlystart = "tile_flystart",
    TileForbidden = "tile_forbidden",
    TileGazebo = "tile_gazebo",
    TileGrass = "tile_grass",
    TileHealing = "tile_healing",
    TileHole = "tile_hole",
    TileInfection = "tile_infection",
    TilePoison = "tile_poison",
    TileRcmCrate = "tile_rcm_crate",
    TileRcmOperator = "tile_rcm_operator",
    TileRoad = "tile_road",
    TileStart = "tile_start",
    TileTelin = "tile_telin",
    TileTelout = "tile_telout",
    TileVolcano = "tile_volcano",
    TileVolcanoEmp = "tile_volcano_emp",
    TileVolspread = "tile_volspread",
    TileWall = "tile_wall",
    TileWoodenWall = "tile_wooden_wall",
    TileYinyangRoad = "tile_yinyang_road",
    TileYinyangSwitch = "tile_yinyang_switch",
    TileYinyangWall = "tile_yinyang_wall",
}

export interface Options {
    characterLimit:       number;
    maxLifePoint:         number;
    initialCost:          number;
    maxCost:              number;
    costIncreaseTime:     number;
    moveMultiplier:       number;
    steeringEnabled:      boolean;
    isTrainingLevel:      boolean;
    functionDisableMask:  number;
    isHardTrainingLevel?: boolean;
}

export interface Rune {
    key:            string;
    difficultyMask: number;
    professionMask: number;
    buildableMask:  number;
    blackboard:     Blackboard[];
}

export interface Wave {
    preDelay:                  number;
    postDelay:                 number;
    maxTimeWaitingForNextWave: number;
    fragments:                 Fragment[];
    name:                      null | string;
}

export interface Fragment {
    preDelay: number;
    actions:  Action[];
    name:     null | string;
}
