import { IChar } from '@kkdy/data'
export const CharStatusKey: (keyof IChar.Data)[] = [
  'atk',
  'attackSpeed',
  'baseAttackTime',
  'blockCnt',
  'cost',
  'def',
  'magicResistance',
  'maxHp',
  'respawnTime',
]

export const TokenStatusKey: (keyof IChar.Data)[] = [
  'atk',
  'attackSpeed',
  'baseAttackTime',
  'blockCnt',
  'cost',
  'def',
  'magicResistance',
  'maxHp',
  'maxDeckStackCnt',
  'maxDeployCount',
  'respawnTime',
]

export function assertCharStatus(key: string): key is keyof IChar.Data {
  return CharStatusKey.includes(key as any)
}

export const PotentialTypeToStatus = {
  0: 'maxHp',
  1: 'atk',
  2: 'def',
  3: 'magicResistance',
  4: 'cost',
  5: 'blockCnt',
  7: 'baseAttackTime',
  21: 'respawnTime',
} as const

export function assertPotentialType(
  t: number
): t is keyof typeof PotentialTypeToStatus {
  return t in PotentialTypeToStatus
}

export enum PotentialType {
  'maxHp',
  'atk',
  'def',
  'magicResistance',
  'cost',
  'blockCnt',
  'baseAttackTime' = 7,
  'respawnTime' = 21,
}
