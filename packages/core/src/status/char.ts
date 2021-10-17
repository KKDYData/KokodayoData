import { IChar } from '@kkdy/data'
import {
  assertCharStatus,
  assertPotentialType,
  PotentialTypeToStatus,
} from '../constants/StatusKey'
import { mergeWithKey } from 'ramda'

export function hello() {
  return 'world'
}

type DataKey = keyof IChar.Data
export type Status = Record<DataKey, number | boolean>

/**
 *
 * @param keyFrames
 * @param lv
 * @param isFavor 如果是好感等级从0开始
 * @returns {Status} Status
 */
export function calcStatusWithKeyFrame(
  keyFrames: IChar.KeyFrame[],
  lv: number,
  isFavor = false
) {
  const [beginStatus, endStatus] = keyFrames

  const diffLv =
    (lv - (!isFavor ? 1 : 0)) / (endStatus.level - beginStatus.level)

  return Object.fromEntries(
    Object.keys(beginStatus.data)
      .filter(assertCharStatus)
      .map((bKey) => mergeData(beginStatus.data, endStatus.data, bKey, diffLv))
  ) as Status
}

/**
 *
 * @param data
 * @param rankKeyFrames
 * @param rank
 * @returns {Status} Status
 */
export function mergeStatusWithPotential(
  data: Status,
  rankKeyFrames: IChar.PotentialRank[],
  rank: number
) {
  if (rank > -1)
    rankKeyFrames.slice(0, rank + 1).forEach((e) => {
      e.buff?.attributes.attributeModifiers.forEach((m) => {
        if (
          assertPotentialType(m.attributeType) &&
          assertCharStatus(PotentialTypeToStatus[m.attributeType])
        ) {
          const key = PotentialTypeToStatus[m.attributeType]
          mergeDataToRecord(key, m.value, data)
        }
      })
    })

  return data
}

export function mergeStatusWithFavor(
  base: Status,
  favorKeyFrames: IChar.KeyFrame[],
  favorLv: number
) {
  const favarStatus = calcStatusWithKeyFrame(favorKeyFrames, favorLv, true)
  return mergeStatus(base, favarStatus)
}

export function mergeStatus(status: Status, favorStatus: Status): Status {
  return mergeWithKey<Status, Status>(
    (k, a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a + b
      } else return a && b
    },
    status,
    favorStatus
  )
}

function mergeData(
  beginStatus: IChar.Data,
  endStatus: IChar.Data,
  key: DataKey,
  diffLv: number
): [DataKey, number | boolean] {
  const bv = beginStatus[key]
  const ev = endStatus[key]

  if (typeof bv === 'number' && typeof ev === 'number') {
    return [key, +((ev - bv) * diffLv + bv).toFixed(2)]
  } else {
    return [key, ev]
  }
}

function mergeDataToRecord(
  k: DataKey,
  v: number | boolean,
  r: Status | Status
) {
  if (typeof v === 'number' && typeof r[k] === 'number') {
    //@ts-ignore
    r[k] += v
  } else if (typeof r[k] !== 'undefined') {
    r[k] = r[k] && v
  } else {
    r[k] = v
  }
}
