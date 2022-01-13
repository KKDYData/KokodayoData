import { getKey, getKeyWithNull } from '../utils/keyValue'

export const StatusType = {
  0: 'maxHp',
  1: 'atk',
  2: 'def',
  3: 'magicResistance',
  4: 'cost',
  5: 'blockCnt',
  7: 'baseAttackTime',
  21: 'respawnTime',
}

export const conertStatusType = getKey(StatusType)

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
  massLevel: '重量',
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
  baseAttackTime: '攻击间隔',
}

const statusToCh_M3 = {
  atk: '攻击',
}

// 展示的面板属性，返回空值则不显示
export const statusToCn = getKeyWithNull(statusToCh_M1)
export const statusToCnChar = getKeyWithNull(statusToCh_M2)
export const statusToCnToken = getKeyWithNull(statusToCh_M3)
