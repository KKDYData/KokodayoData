import { customRef, ref } from 'vue'
import { Fn } from '@vueuse/core'
import { callHook } from './callHook'

export const createSafeNumber =
  (min: number, max: number, throwError = false) =>
  (n: number) => {
    if (n >= max) {
      if (throwError) throw new Error(`n: ${n} is bigger than ${max}`)
      return max
    } else if (n <= min) {
      if (throwError) throw new Error(`n: ${n} is smaller than ${min}`)
      return min
    } else return n
  }

export const useSafeNumber = (
  min: number,
  max: number,
  initial = min,
  hooks: { getHook?: Fn; setHook?: (v: number) => void } = {}
) => {
  let safeNum = createSafeNumber(min, max)
  let __num = initial
  const range = ref({ min, max })

  const value = customRef((track, trigger) => {
    return {
      get: () => {
        callHook(hooks.getHook)
        track()
        return __num
      },
      set: (v: number) => {
        __num = safeNum(v)
        callHook(hooks.setHook, __num)
        trigger()
      },
    }
  })

  const changeRange = (newMin: number, newMax: number) => {
    safeNum = createSafeNumber(newMin, newMax)
    range.value.min = newMin
    range.value.max = newMax
  }

  return {
    value,
    changeRange,
    range,
  }
}
