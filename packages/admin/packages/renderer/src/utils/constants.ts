// 干员/召唤物切换
const tokenSwitch = [
  { value: 'CHAR', text: '干员', checked: false },
  { value: 'TOKEN', text: '召唤物', checked: false },
]

// 干员职业
const professionList = [
  { value: 'WARRIOR', text: '近卫', checked: false },
  { value: 'SNIPER', text: '狙击', checked: false },
  { value: 'TANK', text: '重装', checked: false },
  { value: 'MEDIC', text: '医疗', checked: false },
  { value: 'SUPPORT', text: '辅助', checked: false },
  { value: 'CASTER', text: '术师', checked: false },
  { value: 'SPECIAL', text: '特种', checked: false },
  { value: 'PIONEER', text: '先锋', checked: false },
]

// 干员星级
const rarityList = [
  { value: '1', text: '1', checked: false },
  { value: '2', text: '2', checked: false },
  { value: '3', text: '3', checked: false },
  { value: '4', text: '4', checked: false },
  { value: '5', text: '5', checked: false },
  { value: '6', text: '6', checked: false },
]

export { tokenSwitch, professionList, rarityList }
