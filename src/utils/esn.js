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
  CHARGEATTACK: '蓄力攻击',
  TRIPLEATTACK: '三重射',
  POISONRELEASE: '毒尘释放',
  POISONRELEASE_RAGE: '毒尘释放_愤怒',
  'SMEPHI_STATE_2[RECOVER]': '转State2',
  'SMEPHI_STATE_3[RECOVER]': '转State3',
  IRONSANDSTORM: '铁砂风暴',
  ARMORPIERCING: '装甲穿刺',
  REFRESHSHIELD: '护盾刷新',
  OCCUPY: '夺取',
  TAKEOFF: '起飞',
  SUMMONTOKEN:'召唤衍生物',
  AIRSUPPORTATK:'攻击空援',
  AIRSUPPORTDEF:'防御空援',
  STAB:'刺击',
  SPEAR:'侵蚀液泡',
  FLAME:'喷火',
  DEADBOOM:'死亡自爆',
  SUMMONFIREBALL:'净浊之焰',
  BACKSTAB:'恐惧凝集',
  SWITCHTOMODE2:'进化至进化形态',
  SWITCHTOMODE3:'进化至完美形态',
  M1ATTACKWARNING:'攻击预警[初生形态]',
  M2ATTACKWARNING:'攻击预警[进化形态]',
  M3ATTACKWARNING:'攻击预警[完美形态]',
  M1REALATTACK:'真实攻击[初生形态]',
  M2REALATTACK:'真实攻击[进化形态]',
  M3REALATTACK:'真实攻击[完美形态]',
  BLACKRINGP1:'坍缩恐惧[第一形态]',
  BLACKRINGP2:'坍缩恐惧[第二形态]',
  TIDEWATER:'大潮[初始]',
  TIDEWATERG1:'大潮[1阶段]',
  TIDEWATERG2:'大潮[2阶段]',
  ROCKFALL:'崩坍[初始]',
  ROCKFALLG1:'崩坍[1阶段]',
  ROCKFALLG2:'崩坍[2阶段]',
  SUMMONTENTAC:'断裂生殖[初始]',
  SUMMONTENTACG1:'断裂生殖[1阶段]',
  SUMMONTENTACG2:'断裂生殖[2阶段]',
  DOOM:'物种爆发[终结技]',
  SUMMONFCANON:'召唤风筝',
  SUMMONBMBMOT:'召唤爆破艇',
  WATERCANNON:'水炮',
  WHIRLWIND:'旋风斩',
  BURSTSHOOT:'多段连射',
  PETRIFIEDRAY:'蔓德拉的注目',
  REBORN:'重生',
  SUMMONSTONESKIN:'召唤石之盾',
  SUMMONSTONESKIN_2:'召唤石之盾[2阶段]',
  SUMMONDUPILR:'击倒支柱',
  BLOODPOOL:'血池',
  BLOODPOOL2:'血池[第二形态]',
  SUMMONBLDBLD:'召唤血刃[复活姿态]',
  SUMMONBLDBLD2:'召唤血刃[第二形态]',
  CIRCLEATTACK:'肆虐风雪',
  CIRCLEATTACK2:'肆虐风雪[第二阶段]',
  BLINK2:'闪现[第二阶段]',
  SHIELD:'召唤护盾',
  POWERATTACK:'强力击',
  INVISIBLESHIELD:'隐匿护盾',
  BOUNCEATTACKP1:'弹射攻击[一阶段]',
  BOUNCEATTACKP2:'弹射攻击[二阶段]',
  NOONARRIVED:'皆为尘土',
}

const ENEMY_TALENT_NAME = {
  hp_ratio: '生命倍率',
  attack: '攻击',
  atk: '攻击',
  atkup: '攻击↑',
  AtkUp:'攻击↑',
  Atkup:'攻击↑',

  def: '防御',
  defup: '防御↑',
  defdown: '防御↓',
  DefDown:'防御↓',

  attack_speed: '攻速',
  atkSpeedDown: '攻速↓',

  speedup: '移速↑',
  move_speed: '移速',
  MoveSpeedUp:'移速↑',
  movespeedup:'移速↑',

  MagicResistance: '法抗',
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
  combat: '特殊攻击',
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
  frstar2_s: '霜星',

  //彩六
  deathrattle: '亡语',
  DeathRattle:'亡语',
  cnt: '数量',
  delay:'延时',
  offset_bound:'偏移范围',
  enemy_key:'召唤编号',

  //进化本质
  mode_1:'初生形态',
  mode_2:'进化形态',
  mode_3:'完美形态',
  mode_1_summoni:'初生形态分裂',
  mode_1_summon:'初生形态分裂',
  mode_2_summon:'进化形态分裂',
  mode_3_summon:'完美形态分裂',
  direction:'方向',
  summoni:'召唤',
  summon:'召唤',
  branch_id:'路径ID',
  evolve_time:'进化时间',
  invincible_after_skill_duration:'无敌持续时间',

  //遗尘
  storm:'沙尘闪避',
  prob:'几率',
  createGhost:'制造幻影',
  HalfHPCallDef:'呼叫防御空援',
  'attack@atk_scale':'伤害倍率',
  AirSupSpeedUp:'空援无人机移速↑',
  DefAndHpRecoveryUp:'防御和生命恢复↑',
  SelfDestruction:'自毁',

  //利刃追猎
  BlackFogTriggerP1:'国度触发[第一阶段]',
  BlackFogTriggerP2:'国度触发[第二阶段]',
  Reborn:'复活',
  BlackFog:'国度',
  'attack@combat_atkscale':'特殊攻击倍率',

  //深海
  epdamage:'元素损伤攻击',
  EpDamage:'元素损伤攻击',
  'attack@ep_damage_ratio':'损伤倍率',
  ep_damage_ratio:'元素损伤倍率',
  sleepwalking:'待命',
  scream:'尖啸',
  damage_trigger:'刺击',

  //昆图斯
  value:'目标生命值',
  atkup1:'攻击力提升[1阶段]',
  atkup2:'攻击力提升[2阶段]',
  growup1:'成长至1阶段',
  growup2:'成长至2阶段',

  //多索雷斯
  Swim:'潜水',
  Evade:'闪避',
  evade:'闪避',
  Drown:'水蚀',
  Crash:'泥头船创击',
  Bleed:'流血',

  //潘乔
  Encourage:'鼓舞',
  DeathEncourage:'死亡时鼓舞',
  hit_duration:'持续时长',

  //深池
  refracting:'折射',
  auraDefup:'防御战阵',
  stone:'石化',
  'duspfr_flame[cd]':'喷火',
  cooldown:'冷却',
  hit_interval:'伤害频率',
  traitAbility:'伙友立场',

  //蔓德拉
  StoneSkin:'石之盾',
  StoneSkin_2:'石之盾[2阶段]',
  ReSummonStoneSkin:'重新召唤石之盾',
  hp_ratio_offset:'当损失生命比率超过',
  mandra_p2_invinsible:'无敌时间',
  'mandra_ray[cd]':'蔓德拉射线',
  'dupilr_t[auto_collapse]':'击倒支柱延时',

  //长夜临光
  NightBuff:'无视野',
  SleepBuff:'待命',
  sleep_duration:'持续时间',

  //血骑士
  Passive:'减伤',
  Passive2:'减伤[第二形态]',
  CheckTrigger:'一阶段复活检测',
  Devour:'吞噬',
  invincible_time:'无敌时间',

  //雪境
  unbalanced_bleed:'失衡流血',
  cold:'寒冷',
  'enemy_krgbsk_t[frozen]':'对冻结目标',

  //锏
  enemy_blkswb_t_1:'降雪',
  'enemy_blkswb_t_1[reborn]':'降雪[第二阶段]',
  DefPenetrate:'穿甲',
  enemy_blkswb_t_2:'阻挡',
  'enemy_blkswb_t_2[reborn]':'阻挡[第二阶段]',
  ClearSp:'瞬息杀机',

  //猩红孤钻
  AttackSpeedUp:'攻速提升',
  stack_cnt:'需要次数',
  warning_stack_cnt:'显示攻击预警需要次数',
  'attack@freeze':'寒冷',
  damagescaletofrozen:'攻击冻结目标伤害倍率',
  summon:'召唤',
  'csdoll_summon[1]':'维持时间和召唤间隔[1阶段]',
  'csdoll_summon[2]':'维持时间和召唤间隔[2阶段]',
  'csdoll_summon[3]':'召唤间隔[3阶段]',
  aoetrigger:'触发群攻',
  TokenInvincible:'召唤物无敌',
  token:'召唤物',
  hprecovery:'生命恢复',
  hp_recovery_per_sec_by_max_hp_ratio:'每秒恢复最大生命百分比',

  //将进酒
  DeadSpawn:'本体现身',
  DeadBoom:'亡语',
  atk_scale_init:'初始伤害倍率',
  atk_scale_add:'伤害倍率增加',
  InvisibleShield:'隐匿护盾',

  //岁相
  AppearMode:'现世',
  AppearS1:'现世[一阶段]',
  hp_ratio_per_fire:'磷火回复生命倍率',
  Bristleback:'侧背',
  NormalAttackS3:'普通攻击[三阶段]',
  DevourMsfsui:'吸收磷火',
  delay_to_appear:'延时出现',
  wait_other_finish:'需求离场敌人数量',

//吾先导咯
shotbuff:'使用弹药',
'attack@headshot_sp':'持有弹药量',
'attack@headshot_atk_scale':'弹药射击攻击倍率',
'attack@headshot_ep_damage_ratio':'弹药射击元素损伤倍率',
shottrap:'射击装置',
'attack@trapdamage':'对装置伤害',
'attack@headshot_trapdamage':'弹药射击对装置伤害',
'attack@combat_atk_scale':'特殊攻击倍率',
'attack@headshot_disarmed_duration':'弹药射击缴械时长',
'attack@s2mode_boom_atk':'爆炸倍率',
'attack@s2mode_boom_atk_totrap':'爆炸对装置伤害',
'attack@s2mode_ep_fire_damage':'爆炸元素损伤值',

//安多恩
SmokeBombTriggerP1:'释放光赐予苦[一阶段]',
SmokeBombTriggerP2:'释放光赐予苦[二阶段]',
SmokeBomb:'光赐予苦闪避几率与减伤倍率',
PassiveP2:'第二形态',
recovery_time:'无敌时间',
martyr_bounce_to_wpnsts:'跳到冰淇淋机的伤害'
}

export { enemySkillNameKey, ENEMY_TALENT_NAME }
