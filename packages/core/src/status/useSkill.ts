import { ISkill } from '@kkdy/data'
import { biSyncRef } from '@vueuse/shared'
import { computed, ref, Ref } from 'vue'
import { useSafeNumber } from '../utils/safeNumber'

export const useSkill = (
  skillLv: Ref<number>,
  data: { comments: string[]; data: ISkill.ISkill }[]
) => {
  const lv = ref(0)
  biSyncRef(skillLv, lv)

  const state = computed(() => {
    return data.map((s) => {
      const lvData = s.data.levels[lv.value]
      return {
        ...s.data,
        lvData,
      }
    })
  })

  return state
}
