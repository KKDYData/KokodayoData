import { IChar } from '@kkdy/data'
import {
  assertCharStatus,
  assertPotentialType,
  PotentialTypeToStatus,
} from '../constants/StatusKey'
import ow from 'ow'
import { mergeWithKey } from 'ramda'

export function hello() {
  return 'world'
}

type DataKey = keyof IChar.Data
type Status = Record<DataKey, number | boolean>

export function calcStatusWithKeyFrame(
  keyFrames: IChar.KeyFrame[],
  lv: number,
  isFavor = false
) {
  ow(keyFrames, ow.array.length(2))

  const [beginStatus, endStatus] = keyFrames

  const diffLv =
    (lv - (!isFavor ? 1 : 0)) / (endStatus.level - beginStatus.level)

  return Object.fromEntries(
    Object.keys(beginStatus.data)
      .filter(assertCharStatus)
      .map((bKey) => mergeData(beginStatus.data, endStatus.data, bKey, diffLv))
  ) as Status | Status
}

export function mergeStatusWithPotential(
  data: Status | Status,
  favorKeyFrames: IChar.PotentialRank[],
  rank: number
) {
  favorKeyFrames.slice(0, rank).forEach((e) => {
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
  r: Status,
  favorKeyFrames: IChar.KeyFrame[],
  favorLv: number
) {
  ow(favorKeyFrames, ow.array.length(2))
  ow(
    favorLv,
    ow.number.is((x) => x >= 1 && x <= 50)
  )

  calcStatusWithKeyFrame(favorKeyFrames, favorLv)
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
    return [key, Math.round((ev - bv) * diffLv + bv)]
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
  } else {
    r[k] = r[k] && v
  }
}
