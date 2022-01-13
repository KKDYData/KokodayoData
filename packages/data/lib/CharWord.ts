// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IWord {
    charWords:           { [key: string]: CharWord };
    voiceLangDict:       VoiceLangDict;
    defaultLangType:     DefaultLangType;
    voiceLangTypeDict:   VoiceLangTypeDict;
    charDefaultTypeDict: { [key: string]: DefaultLangType };
    startTimeList:       StartTimeList[];
}

export enum DefaultLangType {
    En = "EN",
    Jp = "JP",
}

export interface CharWord {
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

export interface StartTimeList {
    timestamp: number;
    charSet:   string[];
}

export interface VoiceLangDict {
    char_285_medic2:     Char003_KaltsClass;
    char_286_cast3:      Char003_KaltsClass;
    char_376_therex:     Char003_KaltsClass;
    char_502_nblade:     Char002_AmiyaClass;
    char_500_noirc:      Char002_AmiyaClass;
    char_503_rang:       Char002_AmiyaClass;
    char_501_durin:      Char002_AmiyaClass;
    char_009_12fce:      Char002_AmiyaClass;
    char_123_fang:       Char002_AmiyaClass;
    char_240_wyvern:     Char003_KaltsClass;
    char_192_falco:      Char002_AmiyaClass;
    char_208_melan:      Char002_AmiyaClass;
    char_283_midn:       Char003_KaltsClass;
    char_281_popka:      Char003_KaltsClass;
    char_209_ardign:     Char003_KaltsClass;
    char_122_beagle:     Char002_AmiyaClass;
    char_284_spot:       Char003_KaltsClass;
    char_124_kroos:      Char002_AmiyaClass;
    char_211_adnach:     Char002_AmiyaClass;
    char_282_catap:      Char003_KaltsClass;
    char_121_lava:       Char002_AmiyaClass;
    char_120_hibisc:     Char002_AmiyaClass;
    char_212_ansel:      Char002_AmiyaClass;
    char_210_stward:     Char003_KaltsClass;
    char_278_orchid:     Char003_KaltsClass;
    char_141_nights:     Char003_KaltsClass;
    char_109_fmout:      Char003_KaltsClass;
    char_253_greyy:      Char003_KaltsClass;
    char_328_cammou:     Char003_KaltsClass;
    char_469_indigo:     Char003_KaltsClass;
    char_235_jesica:     Char002_AmiyaClass;
    char_126_shotst:     Char003_KaltsClass;
    char_190_clour:      Char003_KaltsClass;
    char_133_mm:         Char003_KaltsClass;
    char_118_yuki:       Char003_KaltsClass;
    char_440_pinecn:     Char003_KaltsClass;
    char_302_glaze:      Char003_KaltsClass;
    char_366_acdrop:     Char003_KaltsClass;
    char_198_blackd:     Char002_AmiyaClass;
    char_149_scave:      Char003_KaltsClass;
    char_290_vigna:      Char003_KaltsClass;
    char_151_myrtle:     Char002_AmiyaClass;
    char_452_bstalk:     Char003_KaltsClass;
    char_130_doberm:     Char002_AmiyaClass;
    char_289_gyuki:      Char003_KaltsClass;
    char_159_peacok:     Char003_KaltsClass;
    char_193_frostl:     Char003_KaltsClass;
    char_271_spikes:     Char003_KaltsClass;
    char_127_estell:     Char003_KaltsClass;
    char_185_frncat:     Char003_KaltsClass;
    char_137_brownb:     Char003_KaltsClass;
    char_347_jaksel:     Char003_KaltsClass;
    char_301_cutter:     Char003_KaltsClass;
    char_337_utage:      Char003_KaltsClass;
    char_237_gravel:     Char003_KaltsClass;
    char_272_strong:     Char003_KaltsClass;
    char_236_rope:       Char003_KaltsClass;
    char_117_myrrh:      Char003_KaltsClass;
    char_187_ccheal:     Char003_KaltsClass;
    char_298_susuro:     Char003_KaltsClass;
    char_181_flower:     Char003_KaltsClass;
    char_385_finlpp:     Char003_KaltsClass;
    char_199_yak:        Char003_KaltsClass;
    char_150_snakek:     Char002_AmiyaClass;
    char_381_bubble:     Char003_KaltsClass;
    char_196_sunbr:      Char003_KaltsClass;
    char_260_durnar:     Char003_KaltsClass;
    char_110_deepcl:     Char003_KaltsClass;
    char_183_skgoat:     Char003_KaltsClass;
    char_258_podego:     Char003_KaltsClass;
    char_484_robrta:     Char002_AmiyaClass;
    char_355_ethan:      Char003_KaltsClass;
    char_277_sqrrel:     Char002_AmiyaClass;
    char_128_plosis:     Char003_KaltsClass;
    char_275_breeze:     Char003_KaltsClass;
    char_115_headbr:     Char003_KaltsClass;
    char_102_texas:      Char002_AmiyaClass;
    char_349_chiave:     Char003_KaltsClass;
    char_220_grani:      Char003_KaltsClass;
    char_261_sddrag:     Char003_KaltsClass;
    char_401_elysm:      Char003_KaltsClass;
    char_308_swire:      Char002_AmiyaClass;
    char_265_sophia:     Char003_KaltsClass;
    char_106_franka:     Char003_KaltsClass;
    char_131_flameb:     Char003_KaltsClass;
    char_155_tiger:      Char003_KaltsClass;
    char_415_flint:      Char003_KaltsClass;
    char_140_whitew:     Char003_KaltsClass;
    char_294_ayer:       Char003_KaltsClass;
    char_252_bibeak:     Char003_KaltsClass;
    char_459_tachak:     Char45;
    char_143_ghost:      Char003_KaltsClass;
    char_356_broca:      Char003_KaltsClass;
    char_230_savage:     Char003_KaltsClass;
    char_274_astesi:     Char003_KaltsClass;
    char_333_sidero:     Char003_KaltsClass;
    char_1001_amiya2:    Char002_AmiyaClass;
    char_475_akafyu:     Char003_KaltsClass;
    char_421_crow:       Char003_KaltsClass;
    char_486_takila:     Char003_KaltsClass;
    char_129_bluep:      Char003_KaltsClass;
    char_204_platnm:     Char002_AmiyaClass;
    char_367_swllow:     Char003_KaltsClass;
    char_365_aprl:       Char003_KaltsClass;
    char_219_meteo:      Char003_KaltsClass;
    char_379_sesa:       Char003_KaltsClass;
    char_279_excu:       Char003_KaltsClass;
    char_346_aosta:      Char003_KaltsClass;
    char_002_amiya:      Char002_AmiyaClass;
    char_164_nightm:     Char003_KaltsClass;
    char_405_absin:      Char003_KaltsClass;
    char_411_tomimi:     Char003_KaltsClass;
    char_166_skfire:     Char003_KaltsClass;
    char_306_leizi:      Char003_KaltsClass;
    char_344_beewax:     Char003_KaltsClass;
    char_388_mint:       Char003_KaltsClass;
    char_338_iris:       Char003_KaltsClass;
    char_373_lionhd:     Char003_KaltsClass;
    char_1011_lava2:     Char002_AmiyaClass;
    char_242_otter:      Char003_KaltsClass;
    char_336_folivo:     Char003_KaltsClass;
    char_108_silent:     Char003_KaltsClass;
    char_171_bldsk:      Char003_KaltsClass;
    char_345_folnic:     Char003_KaltsClass;
    char_402_tuye:       Char003_KaltsClass;
    char_348_ceylon:     Char003_KaltsClass;
    char_436_whispr:     Char003_KaltsClass;
    char_473_mberry:     Char002_AmiyaClass;
    char_148_nearl:      Char002_AmiyaClass;
    char_226_hmau:       Char003_KaltsClass;
    char_144_red:        Char003_KaltsClass;
    char_243_waaifu:     Char003_KaltsClass;
    char_214_kafka:      Char003_KaltsClass;
    char_455_nothin:     Char003_KaltsClass;
    char_107_liskam:     Char002_AmiyaClass;
    char_201_moeshd:     Char003_KaltsClass;
    char_325_bison:      Char003_KaltsClass;
    char_457_blitz:      Char45;
    char_304_zebra:      Char003_KaltsClass;
    char_163_hpsts:      Char003_KaltsClass;
    char_378_asbest:     Char003_KaltsClass;
    char_431_ashlok:     Char002_AmiyaClass;
    char_145_prove:      Char003_KaltsClass;
    char_158_milu:       Char003_KaltsClass;
    char_218_cuttle:     Char003_KaltsClass;
    char_363_toddi:      Char003_KaltsClass;
    char_173_slchan:     Char002_AmiyaClass;
    char_383_snsant:     Char003_KaltsClass;
    char_174_slbell:     Char002_AmiyaClass;
    char_254_vodfox:     Char003_KaltsClass;
    char_195_glassb:     Char003_KaltsClass;
    char_326_glacus:     Char003_KaltsClass;
    char_101_sora:       Char003_KaltsClass;
    char_343_tknogi:     Char003_KaltsClass;
    char_215_mantic:     Char003_KaltsClass;
    char_478_kirara:     Char003_KaltsClass;
    char_241_panda:      Char002_AmiyaClass;
    char_451_robin:      Char003_KaltsClass;
    char_458_rfrost:     Char45;
    char_369_bena:       Char003_KaltsClass;
    char_103_angel:      Char002_AmiyaClass;
    char_332_archet:     Char003_KaltsClass;
    char_456_ash:        Char45;
    char_340_shwaz:      Char003_KaltsClass;
    char_430_fartth:     Char002_AmiyaClass;
    char_113_cqbw:       Char003_KaltsClass;
    char_197_poca:       Char003_KaltsClass;
    char_391_rosmon:     Char003_KaltsClass;
    char_1013_chen2:     Char002_AmiyaClass;
    char_112_siege:      Char003_KaltsClass;
    char_222_bpipe:      Char003_KaltsClass;
    char_479_sleach:     Char002_AmiyaClass;
    char_362_saga:       Char003_KaltsClass;
    char_134_ifrit:      Char003_KaltsClass;
    char_213_mostma:     Char003_KaltsClass;
    char_180_amgoat:     Char002_AmiyaClass;
    char_2013_cerber:    Char003_KaltsClass;
    char_2015_dusk:      Char003_KaltsClass;
    char_472_pasngr:     Char003_KaltsClass;
    char_426_billro:     Char003_KaltsClass;
    char_291_aglina:     Char003_KaltsClass;
    char_358_lisa:       Char003_KaltsClass;
    char_248_mgllan:     Char003_KaltsClass;
    char_1012_skadi2:    Char003_KaltsClass;
    char_250_phatom:     Char002_AmiyaClass;
    char_400_weedy:      Char003_KaltsClass;
    char_225_haak:       Char003_KaltsClass;
    char_474_glady:      Char003_KaltsClass;
    char_437_mizuki:     Char003_KaltsClass;
    char_147_shining:    Char003_KaltsClass;
    char_179_cgbird:     Char002_AmiyaClass;
    char_003_kalts:      Char003_KaltsClass;
    char_136_hsguma:     Char002_AmiyaClass;
    char_202_demkni:     Char003_KaltsClass;
    char_423_blemsh:     Char003_KaltsClass;
    char_2014_nian:      Char003_KaltsClass;
    char_311_mudrok:     Char003_KaltsClass;
    char_416_zumama:     Char003_KaltsClass;
    char_263_skadi:      Char003_KaltsClass;
    char_264_f12yin:     Char003_KaltsClass;
    char_172_svrash:     Char002_AmiyaClass;
    char_293_thorns:     Char003_KaltsClass;
    char_010_chen:       Char002_AmiyaClass;
    char_017_huang:      Char003_KaltsClass;
    char_350_surtr:      Char003_KaltsClass;
    char_188_helage:     Char003_KaltsClass;
    char_485_pallas:     Char003_KaltsClass;
    char_1014_nearl2:    Char002_AmiyaClass;
    char_420_flamtl:     Char002_AmiyaClass;
    char_496_wildmn:     Char002_AmiyaClass;
    char_4000_jnight:    Char002_AmiyaClass;
    char_449_glider:     Char002_AmiyaClass;
    char_4004_pudd:      Char002_AmiyaClass;
    char_489_serum:      Char002_AmiyaClass;
    char_206_gnosis:     Char002_AmiyaClass;
    char_422_aurora:     Char002_AmiyaClass;
    char_4013_kjera:     Char002_AmiyaClass;
    char_4025_aprot2:    Char002_AmiyaClass;
    "char_311_mudrok#1": Char003_KaltsClass;
}

export interface Char002_AmiyaClass {
    wordKey:      string;
    charId:       string;
    cvDictionary: Char002_AmiyaCvDictionary;
}

export interface Char002_AmiyaCvDictionary {
    CN_MANDARIN: string;
    JP:          string;
}

export interface Char003_KaltsClass {
    wordKey:      string;
    charId:       string;
    cvDictionary: Char003_KaltsCvDictionary;
}

export interface Char003_KaltsCvDictionary {
    JP: string;
}

export interface Char45 {
    wordKey:      string;
    charId:       string;
    cvDictionary: Char456_AshCvDictionary;
}

export interface Char456_AshCvDictionary {
    EN: string;
}

export interface VoiceLangTypeDict {
    CN_MANDARIN: string;
    JP:          string;
    EN:          string;
}
