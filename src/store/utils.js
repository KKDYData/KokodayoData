import { getStageType } from '@/utils/string'


export const change = (list) => {
  return Object.entries(list).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        label: getStageType(key),
        children: value.map(el => {
          if (el.type && el.data) {
            return {
              label: '支线',
              children: el.data.map(el => {
                const keys = el.split(' ')
                return {
                  label: keys.slice(0, 2).join(' '),
                  path: keys[2],
                  apCost: keys[3]
                }
              }) //change(el.data)
            }
          } else {
            const keys = el.split(' ')
            return {
              label: keys.slice(0, 2).join(' '),
              path: keys[2],
              apCost: keys[3],
              etCost: keys[4]
            }
          }
        })
      }
    } else {
      return { label: getStageType(key), children: change(value) }
    }
  })
}
