const heroBaseData = {
  class: ['精靈師', '射手', '盜賊', '魔導士', '騎士', '戰士'],
  element: ['寒氣', '火焰', '光明', '自然', '黑暗'],
  stats: [
    { id: "CP", name: "战斗力" },
    { id: "attack", name: "攻击" },
    { id: "health", name: "生命" },
    { id: "speed", name: "速度" },
    { id: "defense", name: "防御" },
    { id: "criticalHitChance", name: "暴击率" },
    { id: "criticalHitDamage", name: "暴击伤害" },
    { id: "effectiveness", name: "命中" },
    { id: "effectResistance", name: "抵抗" },

  ],
  missionStats: [
    { id: "command", name: "指挥" },
    { id: "charm", name: "魅力" },
    { id: "politics", name: "政治" },
  ],
  constellation: [
    "射手座",
    "牡羊座",
    "白羊座",
    "雙魚座",
    "巨蟹座",
    "處女座",
    "天秤座",
    "天蠍座",
    "摩羯座",
    "水瓶座",
    "金牛座",
    "雙子座",

  ],
  soulburn: [
    { id: 'oneSoulDamge', name: '1魂伤害' },
    { id: 'twoSoulDamge', name: '2魂伤害' },
    { id: 'twoSoulExtraTurn', name: '2魂额外回合' },
    { id: 'twoSoulIgnore', name: '2魂无视抵抗' },
    { id: 'twoSoulReduceCd', name: '2魂减CD' },
    { id: 'other', name: '其它' }
  ]
}

export default heroBaseData