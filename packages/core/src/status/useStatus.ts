import { IChar } from '@kkdy/data'
import { computed } from 'vue'
import { mergeStatus } from '.'
import { useSafeNumber } from '../utils/safeNumber'
import {
  calcStatusWithKeyFrame,
  mergeStatusWithFavor,
  mergeStatusWithPotential,
  Status,
} from './char'

export function useStatus(data: IChar.IData) {
  const {
    value: lv,
    changeRange: changeLvRange,
    range: lvRange,
  } = useSafeNumber(1, data.phases[0].maxLevel)
  const { value: phase, range: phaseRange } = useSafeNumber(
    0,
    data.phases.length - 1,
    0,
    {
      setHook: (v) => {
        changeLvRange(1, data.phases[v].maxLevel)
        lv.value = lv.value
      },
    }
  )

  const { value: favorLv, range: favorRange } = useSafeNumber(0, 200)
  const { value: rank, range: rankRange } = useSafeNumber(-1, 5)

  const favarStatus = computed(() =>
    calcStatusWithKeyFrame(data.favorKeyFrames, favorLv.value, true)
  )

  const potentialStatus = computed(() =>
    mergeStatusWithPotential({} as Status, data.potentialRanks, rank.value)
  )

  const extraStatus = computed(() =>
    mergeStatus(favarStatus.value, potentialStatus.value)
  )

  const status = computed(() => {
    const res = calcStatusWithKeyFrame(
      data.phases[phase.value].attributesKeyFrames,
      lv.value
    )
    return mergeStatus(res, extraStatus.value)
  })

  const { value: skillLv, range: skillRange } = useSafeNumber(0, 9)
  const skillCostList = data.skills.map((s) => {
    return data.allSkillLvlup
      .map<Omit<IChar.LevelUpCostCond, 'lvlUpTime'> & { lvUpTime?: number }>(
        (e) => ({
          ...e,
          levelUpCost: e.lvlUpCost,
        })
      )
      .concat(s.levelUpCostCond)
  })

  const skillCost = computed(() => skillCostList.map((s) => s[skillLv.value]))

  return {
    status,
    lv,
    lvRange,
    phase,
    phaseRange,
    rank,
    rankRange,
    favorLv,
    favorRange,
    extraStatus,
    skillLv,
    skillCostList,
    skillCost,
    skillRange,
  }
}
