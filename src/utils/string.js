const getKey = (keys) => key => keys[key] ? keys[key] : key
const getKeyWithNull = (keys) => key => keys[key] ? keys[key] : null


// 拆包数据
const evolveGoldCost = [
  [-1, -1],
  [-1, -1],
  [10000, -1],
  [15000, 60000],
  [20000, 120000],
  [30000, 180000]
]

const exp_cards = {
  2001: {
    exp: 200,
    itemId: '2001',
    name: '基础作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了数场战斗的录像。',
    rarity: 1,
    iconId: 'sprite_exp_card_t1',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t1',
    sortId: 15,
    usage: '记录了作战录像的存储装置，可以些微增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_02-03',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_00-10',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '1'
      }
    ]
  },
  2002: {
    exp: 400,
    itemId: '2002',
    name: '初级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了多场战斗的录像与详细数据分析资料。附送了三小时的花絮与访谈。',
    rarity: 2,
    iconId: 'sprite_exp_card_t2',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t2',
    sortId: 14,
    usage: '记录了作战录像的存储装置，可以少许增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_03-05',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_02-10',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '2'
      }
    ]
  },
  2003: {
    exp: 1000,
    itemId: '2003',
    name: '中级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了多个录像集锦，夹带了一张录像人的签名版。',
    rarity: 3,
    iconId: 'sprite_exp_card_t3',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t3',
    sortId: 13,
    usage: '记录了作战录像的存储装置，可以大幅增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_04-03',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_04-3-3',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '3'
      }
    ]
  },
  2004: {
    exp: 2000,
    itemId: '2004',
    name: '高级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n追加了总集篇。附带高清版、高清重制版、威力加强版、导演剪辑版、年度黄金版……',
    rarity: 4,
    iconId: 'sprite_exp_card_t4',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t4',
    sortId: 12,
    usage: '记录了作战录像的存储装置，可以极大增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: []
  },
}

const GOLD = {
  itemId: '4001',
  name: '龙门币',
  description: '经济危机发生后，经济的衰退与政权之间的对立让贸易参与者们举步维艰。龙门币的流通使商业复兴成为可能。',
  rarity: 3,
  iconId: 'GOLD',
  overrideBkg: null,
  stackIconId: 'GOLD_STACK',
  sortId: 4,
  usage: '由龙门发行的货币，用途广泛。',
  obtainApproach: null,
  itemType: 'GOLD',
  stageDropList: [
    {
      stageId: 'wk_melee_1',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_01-01',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'sub_02-02',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_02-07',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_03-06',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_04-01',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'sub_04-2-3',
      occPer: 'ALWAYS'
    }
  ],
  buildingProductList: []
}

// hsla(270, 47 %, 47 %, 1)
// 公招的颜色
const agentColor = [
  [0, 0, 20],
  [0, 0, 55],
  [0, 0, 55],
  [270, 47, 47],
  [40, 100, 50],
  [25, 95, 55]
]

// css属性
const starColor = [
  [0, 0, 20],
  [0, 0, 20],
  [213, 53, 20],
  [282, 35, 15],
  [40, 100, 50],
  [25, 95, 55]
]

const charBorderColor = {
  0: {
    background: `linear-gradient(16deg, hsla(${starColor[0][0]}, ${starColor[0][1]}%, ${starColor[0][2]}%, 1), hsla(0, 0%, 95%, 1))`,
  },
  1: {
    background: `linear-gradient(16deg, hsla(${starColor[1][0]}, ${starColor[1][1]}%, ${starColor[1][2]}%, 1), hsla(0, 0%, 95%, 1))`,
  },
  2: {
    background: `linear-gradient(16deg, hsla(${starColor[2][0]}, ${starColor[2][1]}%, ${starColor[2][2]}%, 1), hsla(213, 53%, 95%, 1))`,
  },
  3: {
    background: `linear-gradient(16deg, hsla(${starColor[3][0]}, ${starColor[3][1]}%, ${starColor[3][2]}%, 1), hsla(282, 35%, 95%, 1))`,
  },
  4: {
    background: `linear-gradient(16deg, hsla(${starColor[4][0]}, ${starColor[4][1]}%, ${starColor[4][2]}%, 1), hsla(40, 100%, 95%, 1))`,
  },
  5: {},
}

const charNameColor = {
  0: { background: `linear-gradient(16deg, hsla(${starColor[0][0]}, ${starColor[0][1]}%, ${starColor[0][2] + 13}%, 1), transparent)`, },
  1: { background: `linear-gradient(16deg, hsla(${starColor[1][0]}, ${starColor[1][1]}%, ${starColor[1][2] + 13}%, 1), transparent)` },
  2: { background: `linear-gradient(16deg, hsla(${starColor[2][0]}, ${starColor[2][1] - 27}%, ${starColor[2][2] + 15}%, 1), transparent)` },
  3: { background: `linear-gradient(16deg, hsla(${starColor[3][0]}, ${starColor[3][1]}%, ${starColor[3][2] + 17}%, 1),transparent)` },
  4: { background: `linear-gradient(16deg, hsla(${starColor[4][0]}, ${starColor[4][1]}%, ${starColor[4][2]}%, 1), transparent)`, },
  5: { background: `linear-gradient(16deg, hsla(${starColor[5][0]}, ${starColor[5][1]}%, ${starColor[5][2]}%, 1), transparent)`, },
}

const itemBackground = {
  0: {
    'border-color': 'rgb(160, 160, 160)',
    'background-color': 'rgb(157, 157, 157)',
    'box-shadow': `rgb(5, 1, 0) 0px 0px 0px 2px inset, 
                   rgb(164, 164, 164) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  1: {
    'border-color': 'rgb(220, 227, 61)',
    'background-color': 'rgb(157, 157, 157)',
    'box-shadow': `rgb(5, 1, 0) 0px 0px 0px 2px inset, 
                   rgb(164, 164, 164) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  2: {
    'border-color': 'rgb(9, 177, 242)',
    'background-color': 'rgb(165, 165, 165)',
    'box-shadow': `rgb(3, 0, 0) 0px 0px 0px 2px inset, 
                   rgb(165, 165, 165)' 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  3: {
    'border-color': 'rgb(215, 198, 216)',
    'background-color': 'rgb(128, 128, 128)',
    'box-shadow': `rgb(44, 29, 62) 0px 0px 0px 2px inset, 
                  rgb(110, 107, 116) 0px 0px 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  4: {
    'border-color': 'rgb(251, 201, 17)',
    'background-color': 'grey',
    'box-shadow': `rgb(51, 41, 6) 0px 0px 0px 2px inset, 
                   rgb(153, 138, 88) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  5: {
    'border-color': 'rgb(75, 41, 23)',
    'background-color': 'rgb(232, 225, 209)',
    'box-shadow': `rgb(75, 41, 23) 0px 0px 0px 2px inset, 
                  rgb(250, 215, 138) 0 0 5px 4px inset,
                  0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
}




const TagsArr = [
  { isTag: true, text: '快速复活', value: '快速复活' },
  { isTag: true, text: '费用回复', value: '费用回复' },
  { isTag: true, text: '治疗', value: '治疗' },
  { isTag: true, text: '新手', value: '新手' },
  { isTag: true, text: '支援', value: '支援' },
  { isTag: true, text: '输出', value: '输出' },
  { isTag: true, text: '生存', value: '生存' },
  { isTag: true, text: '群攻', value: '群攻' },
  { isTag: true, text: '防护', value: '防护' },
  { isTag: true, text: '减速', value: '减速' },
  { isTag: true, text: '削弱', value: '削弱' },
  { isTag: true, text: '位移', value: '位移' },
  { isTag: true, text: '召唤', value: '召唤' },
  { isTag: true, text: '爆发', value: '爆发' },
  { isTag: true, text: '控场', value: '控场' },
  { isTag: true, text: '远程位', value: 'RANGED' },
  { isTag: true, text: '近战位', value: 'MELEE' },
  { isTag: true, text: '支援机械', value: '支援机械' },
  { isTag: true, text: '资深干员', value: 4 },
  { isTag: true, text: '高级资深干员', value: 5 },
]

const StarArr = [
  { isTag: false, text: 1, value: 0, short: 1 },
  { isTag: false, text: 2, value: 1, short: 2 },
  { isTag: false, text: 3, value: 2, short: 3 },
  { isTag: false, text: 4, value: 3, short: 4 },
  { isTag: false, text: 5, value: 4, short: 5 },
  { isTag: false, text: 6, value: 5, short: 6 },
]

const potentialToStatus = {
  0: 'maxHp',
  1: 'atk',
  2: 'def',
  3: 'magicResistance',
  4: 'cost',
  5: 'blockCnt',
  7: 'baseAttackTime',
  21: 'respawnTime'
}

const mapOptionsKey = {
  characterLimit: '可部署干员数',
  maxLifePoint: 'LifePoint',
  initialCost: '初始部署费用',
  maxCost: '最大部署费用',
  costIncreaseTime: '部署费用回复/s',
  // moveMultiplier: '移速系数',
  apCost: '理智消耗',
  apFailReturn: '失败返还理智',
  completeFavor: '干员好感增加',
  // difficulty: '难度',
  expGain: '经验获得',
  goldGain: '龙门币获得',
  // isTrainingLevel: '训练？',
  // functionDisableMask: 'mask？'
}


const occPer_chinese = {
  ALWAYS: '固定掉落',
  SOMETIMES: '罕见',
  OFTEN: '小概率',
  USUAL: '概率掉率',
  ALMOST: '大概率'
}

const roomType = {
  WORKSHOP: '加工站',
  MANUFACTURE: '制造站'
}


const campToCode = {
  切尔诺伯格: '01',
  龙门外环: '02',
  龙门市区: '03'
}

const statusToCh_M1 = {
  maxHp: '生命上限',
  atk: '攻击',
  def: '防御',
  moveSpeed: '移动速度',
  magicResistance: '法术抵抗',
  baseAttackTime: '攻击间隔',
  hpRecoveryPerSec: '生命回复/秒',
  // spRecoveryPerSec: '每秒Sp回复'
  // maxDeployCount: '最大部署数',
  massLevel: '重量'
  // stunImmune: '免疫打断',
  // silenceImmune: '免疫沉默'
  // massLevel: '重量等级',
  // baseForeLevel: '力量等级'
}

const statusToCh_M2 = {
  maxHp: '生命上限',
  respawnTime: '再部署',
  atk: '攻击',
  cost: '部署费用',
  def: '防御',
  blockCnt: '阻挡数',
  magicResistance: '法术抵抗',
  baseAttackTime: '攻击间隔'
}

const statusToCh_M3 = {
  atk: '攻击',
}

const StageType = {
  main: '主线',
  tr: 'TR',
  hard: '困难',
  wk: '物资筹备',
  camp: '剿灭作战',
  guid: '教程',
  sub: '支线',
  pro: '芯片搜索',
  a001: 'Act·1·骑兵与猎人',
  a003: 'Act·3·火蓝之心',
  act4d0: 'Act·4·战地秘闻',
  act5d0: 'Act·5·喧闹法则',
  act6d5: 'Act·6·洪炉示岁',
  act7d5: 'Act·7·午间逸话',
  act9d0: 'Act·9·生于黑夜',
  act10d5: 'Act·10·乌萨斯的孩子们',
  rune: '危机合约'
}

const Directions = {
  3: '←',
  2: '↓',
  1: '→',
  0: '↑'
}

const keys = {
  damage: '伤害',
  cd_min: '最小cd',
  cd_max: '最大cd',
  attack_speed: '攻速',
  atk_scale: '攻击倍率',
  def: '防御',
  HP_RECOVERY_PER_SEC_BY_MAX_HP_RATIO: '每秒HP回复百分比'
}




// 展示的面板属性，返回空值则不显示
const statusToCh = getKeyWithNull(statusToCh_M1)
const statusToChChar = getKeyWithNull(statusToCh_M2)
const statusToChToken = getKeyWithNull(statusToCh_M3)

const getPotentialToStatus = getKey(potentialToStatus)
const getStageType = getKey(StageType)
const blockKeys = getKey(keys)

const class_chinese = {
  MEDIC: { isTag: false, text: '医疗', value: 'MEDIC' },
  CASTER: { isTag: false, text: '术师', value: 'CASTER' },
  SNIPER: { isTag: false, text: '狙击', value: 'SNIPER' },
  WARRIOR: { isTag: false, text: '近卫', value: 'WARRIOR' },
  PIONEER: { isTag: false, text: '先锋', value: 'PIONEER' },
  TANK: { isTag: false, text: '重装', value: 'TANK' },
  SPECIAL: { isTag: false, text: '特种', value: 'SPECIAL' },
  SUPPORT: { isTag: false, text: '辅助', value: 'SUPPORT' },
}

const getClass_Chinese = en => {
  if (en === 'TOKEN') return '召唤物'
  return class_chinese[en].text
}


export {
  // 筛选数据
  StarArr,
  TagsArr,
  // css
  itemBackground,
  charNameColor,
  charBorderColor,
  starColor,
  agentColor,
  // key
  mapOptionsKey,
  roomType,
  campToCode,
  statusToCh,
  statusToChChar,
  getStageType,
  getPotentialToStatus,
  statusToChToken,
  class_chinese,
  getClass_Chinese,

  // 拆包数据
  evolveGoldCost,
  exp_cards,
  occPer_chinese,
  GOLD,

  // map生成
  Directions,
  blockKeys,
}
