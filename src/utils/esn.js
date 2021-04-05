const enemySkillNameKey = {
  //这是注释，原英文名：中文名，标点符号都是英文的。
  SUMMONBALLIS: '召唤弩炮台',
  COLDATTACK: '冰霜攻击',
  ICESHIELD: '寒冰封印',
  'ICESHIELD[REBORN]': '寒冰封印[重生]',
  SUMMONFROSTS: '冰晶召唤',
  ICEBURST: '冰环',
  'ICEBURST[REBORN]': '冰环[重生]',
  BOOMB: '爆破弹头',
  BOMB: '冰爆弹头',
  DRIFTSAND: '唱沙',
  SANDSTORM: '沙狱',
  MARK: '标记',
  CRITICALHIT: '夺命箭',
  ARCTICBLAST: '冰环',
  C4: 'C4炸药',
  BLINK: '闪现',
  STUNATTACK: '眩晕射击',
  STUNCOMBAT: '粉碎锤击',
  LASSO: '枷锁',
  'IMMO[RAGE]': '献祭-食人[毁灭]--范围真伤',
  'THROWSPEAR[RAGE]': '标枪投掷[毁灭]',
  'IMMO_TRIGGER[REBORNING]': '献祭[复活中]',
  IGNITE: '点燃',
  DRAGONFIREEXPLODE: '引爆',
  SCREENATTACK: '全屏攻击',
  CHARGE: '充能',
  BRINGDOWN: '削弱',
  SUMMONFLAME: '召唤能量聚合体',
  ATKDESWEAKEN: '攻击削弱',
  CUTTREE: '砍树',
  CROSSATTACK: '纬地经天',
  SHIELDBURST: '破桎而出',
  SHIELDBURSTREBORN: '破桎而出[重生]',
  CROSSATTACKMARK: '纬地经天标记',
  CROSSATTACKMARKREBORN: '纬地经天标记[重生]',
  CHARGEATTACK: '充能攻击',
  TRIPLEATTACK: '三重射',
  POISONRELEASE: '毒尘释放',
  POISONRELEASE_RAGE: '毒尘释放_愤怒',
  'SMEPHI_STATE_2[RECOVER]': '转State2',
  'SMEPHI_STATE_3[RECOVER]': '转State3',
  IRONSANDSTORM: '铁砂风暴',
  ARMORPIERCING: '装甲穿刺',
  REFRESHSHIELD: '护盾刷新',
  OCCUPY: '夺取',
  TAKEOFF: '起飞'
}

const ENEMY_TALENT_NAME = {
  hp_ratio: '触发血线',

  attack: '攻击力',
  atk: '攻击力',
  atkup: '攻击力↑',

  def: '防御',
  defup: '防御力↑',
  defdown: '防御力↓',

  attack_speed: '攻速',
  atkSpeedDown: '攻速↓',

  speedup: '移速提升',
  move_speed: '移动速度',

  MagicResistance: '法抗↑',
  magic_resistance: '法抗',

  base_attack_time: '攻击间隔',

  reborn: '复活',
  freeze: '冻结时间',

  enrage: '暴怒',

  shield: '护盾',
  dynamic: 'HP',

  invincible: '隐身',

  ReduceBlockCnt: '减少阻挡数',
  block_cnt: '阻挡数量',

  healaura: '治愈光环',

  damage: '伤害',
  'attack@damage': '伤害',
  rangedamage: '范围伤害',
  range_radius: '范围',
  duration: '持续时间',
  interval: '间隔',

  damage_scale: '倍率',
  atk_scale: '倍率',
  hp_recovery_per_sec: '每秒回血',

  reborn_invincible: '复活隐身',
  attackfreeze: '攻击冻结',
  periodic_damage: '周期伤害',
  strength: '战术命令',
  'immo_trigger[rage]': '毁灭姿态',
  'patrt_t_state_2[reborn_invincible]': '爱国者状态3[复活隐身]',
  taunt: '嘲讽',
  taunt_level: '嘲讽等级',

  rush: '冲刺·',
  'dlancer_t[trigger]': '参数·',
  trig_cnt: '最大计数',
  firstattack: '冲刺',

  fire: '灼息',
  dragon_fire: '龙息',
  'attack@dragon_fire': '烈焚灼息',
  baseDamage: '初始伤害',
  addOnDamage: '最大递增附加值',
  addOnDuration: '递增持续时间',
  damage_resistance: '伤害降低',
  'bsnake_t[protect]': '黑蛇保护',

  yinyang: '阴阳',
  'buff_yinyang[same]': '同属性',
  'buff_yinyang[diff]': '异属性',
  atk_scale_2: '倍率2',
  boomtodiff: 'BOOM异属性',
  boomtosame: 'BOOM同属性',

  // 萨卡
  vampire: '吸血',
  heal_scale: '治疗倍率',
  'attack@max_target': '同时攻击数量',
  max_target: '最大数量',
  awake: '警报',
  warn: '警报',
  revive: '苏醒',
  unmove_duration: '待命时间',

  // 爆破
  'attack@bsthmr_range': '爆破溅射',

  // 森蚺
  duel: '决斗',
  cchmpn_t_buff_blocker: '阻挡者',
  cchmpn_t_buff_self: '自身',
  combat: '格斗',
  'attack@ccwitch_rage_attack': '巫术狂暴攻击',
  max_cnt: '最大数量',
  Def: '防御力↑',
  '·ATTACK@MCMSTR_RAGE_ATTACK': '狂暴攻击',
  bird_run: '鸟跑',

  //塔露拉
  halfhp: '半血',

  // 囚犯
  liberty: '解放',
  confinement: '禁锢',
  def_penetrate: '穿甲',
  atkspeedup: '攻速提升',

  max_stack_cnt: '最大提升次数',
  enhance: '提升',
  triggerrage: '触发狂暴',
  'attack@dekght[aoe]': '溅射',
  'dekght[aoe]': 'AOE',
  'dekght_2[aoe]': 'AOE',

  // 梅菲斯特
  rage_aura: '活性状态',
  rage_aura_state_3: '活性状态|State3',
  poison_trigger_giver: '毒性粉尘',
  smephi_poison_trigger: '毒',
  'smephi_t_state_2[reborn_invincible]': 'State2[隐身]',
  smephi_suicide_after_buff: '休眠状态',
  min_hp_ratio: '最小生命百分比',
  'smephi_t_state_3[reborn]': 'State3[复活]',
  'smephi_t[poison]': '毒性粉尘',
  'smephi_heal[sheild]': '治疗[护盾]',

  //
  stun: '晕眩',
  times: '次数',
  charge: '充能',
  'attack@enemy_mdrock_s_1[charge]': '攻击↑',
  'balloon_s[fly]': '飞行',
  frstar2_s: '霜星'
}

export { enemySkillNameKey, ENEMY_TALENT_NAME }
