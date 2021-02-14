export interface Word {
    charWordId:      string;
    wordKey:         string;
    charId:          string;
    voiceId:         VoiceID;
    voiceText:       string;
    voiceTitle:      VoiceTitle;
    voiceIndex:      number;
    voiceType:       VoiceType;
    unlockType:      UnlockType;
    unlockParam:     UnlockParam[];
    lockDescription: null | string;
    placeType:       PlaceType;
    voiceAsset:      string;
}

export enum PlaceType {
    BattleFaceEnemy = "BATTLE_FACE_ENEMY",
    BattlePlace = "BATTLE_PLACE",
    BattleSelect = "BATTLE_SELECT",
    BattleSkill1 = "BATTLE_SKILL_1",
    BattleSkill2 = "BATTLE_SKILL_2",
    BattleSkill3 = "BATTLE_SKILL_3",
    BattleSkill4 = "BATTLE_SKILL_4",
    BattleStart = "BATTLE_START",
    BuildingFavorBubble = "BUILDING_FAVOR_BUBBLE",
    BuildingPlace = "BUILDING_PLACE",
    BuildingTouching = "BUILDING_TOUCHING",
    EvolveOne = "EVOLVE_ONE",
    EvolveTwo = "EVOLVE_TWO",
    FourStar = "FOUR_STAR",
    Gacha = "GACHA",
    Greeting = "GREETING",
    HomePlace = "HOME_PLACE",
    HomeShow = "HOME_SHOW",
    HomeWait = "HOME_WAIT",
    LevelUp = "LEVEL_UP",
    LoadingPanel = "LOADING_PANEL",
    Lose = "LOSE",
    Squad = "SQUAD",
    SquadFirst = "SQUAD_FIRST",
    ThreeStar = "THREE_STAR",
    TwoStar = "TWO_STAR",
}

export interface UnlockParam {
    valueStr: null;
    valueInt: number;
}

export enum UnlockType {
    Awake = "AWAKE",
    Direct = "DIRECT",
    Favor = "FAVOR",
}

export enum VoiceID {
    CN001 = "CN_001",
    CN002 = "CN_002",
    CN003 = "CN_003",
    CN004 = "CN_004",
    CN005 = "CN_005",
    CN006 = "CN_006",
    CN007 = "CN_007",
    CN008 = "CN_008",
    CN009 = "CN_009",
    CN010 = "CN_010",
    CN011 = "CN_011",
    CN012 = "CN_012",
    CN013 = "CN_013",
    CN014 = "CN_014",
    CN017 = "CN_017",
    CN018 = "CN_018",
    CN019 = "CN_019",
    CN020 = "CN_020",
    CN021 = "CN_021",
    CN022 = "CN_022",
    CN023 = "CN_023",
    CN024 = "CN_024",
    CN025 = "CN_025",
    CN026 = "CN_026",
    CN027 = "CN_027",
    CN028 = "CN_028",
    CN029 = "CN_029",
    CN030 = "CN_030",
    CN031 = "CN_031",
    CN032 = "CN_032",
    CN033 = "CN_033",
    CN034 = "CN_034",
    CN036 = "CN_036",
    CN037 = "CN_037",
    CN042 = "CN_042",
}

export enum VoiceTitle {
    The3星结束行动 = "3星结束行动",
    The4星结束行动 = "4星结束行动",
    交谈1 = "交谈1",
    交谈2 = "交谈2",
    交谈3 = "交谈3",
    任命助理 = "任命助理",
    任命队长 = "任命队长",
    作战中1 = "作战中1",
    作战中2 = "作战中2",
    作战中3 = "作战中3",
    作战中4 = "作战中4",
    信赖提升后交谈1 = "信赖提升后交谈1",
    信赖提升后交谈2 = "信赖提升后交谈2",
    信赖提升后交谈3 = "信赖提升后交谈3",
    信赖触摸 = "信赖触摸",
    干员报到 = "干员报到",
    戳一下 = "戳一下",
    晋升后交谈1 = "晋升后交谈1",
    晋升后交谈2 = "晋升后交谈2",
    标题 = "标题",
    精英化晋升1 = "精英化晋升1",
    精英化晋升2 = "精英化晋升2",
    编入队伍 = "编入队伍",
    行动出发 = "行动出发",
    行动失败 = "行动失败",
    行动开始 = "行动开始",
    观看作战记录 = "观看作战记录",
    进驻设施 = "进驻设施",
    选中干员1 = "选中干员1",
    选中干员2 = "选中干员2",
    部署1 = "部署1",
    部署2 = "部署2",
    问候 = "问候",
    闲置 = "闲置",
    非3星结束行动 = "非3星结束行动",
}

export enum VoiceType {
    OnlyText = "ONLY_TEXT",
}
