import { getStageType } from '@/utils/string'
import { IStageInfo } from '@kkdy/data'

const StageType = IStageInfo.StageType

/**
 * @param list {{
    levelId: string;
    label: string;
    stageType: import('@kkdy/data').IStageInfo.StageType;
    hardStagedId: string;
    }[]}
 */
export const change = (list) => {
  const map = {}
  const chapterMap = {}
  const actMap = {}

  list.forEach((stage) => {
    const { stageType, label, levelId } = stage
    const [, _st, ..._code] = levelId.split('_')
    const st = stageType ?? _st

    if (!map[st]) {
      map[st] = creatBranch(st ?? '其他')
    }

    console.log('push ', st, label, _code, levelId)

    // 分章节
    if (['sub', 'main'].includes(_st)) {
      const chapter = _code[0].split('-')[0]
      console.log('ccccccccccccccccc', _code, chapter)
      if (!chapterMap[chapter]) {
        chapterMap[chapter] = creatBranch(chapter)
      }
      chapterMap[chapter].children.push(creatBranch(label, stage))
    } else if (stageType === StageType.Activity) {
      const act = _st
      if (!actMap[act]) {
        actMap[act] = creatBranch(act, stage)
      }
      actMap[act].children.push(creatBranch(label, stage))
    } else {
      map[st].children.push(creatBranch(label || _code.join('|'), stage))
    }
  })

  map[StageType.Main].children = Object.values(chapterMap)
  map[StageType.Activity].children = Object.values(actMap)
  console.log(map)
  return Object.values(map)

  return Object.entries(list).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        label: getStageType(key),
        children: value.map((el) => {
          if (el.type && el.data) {
            return {
              label: '支线',
              children: el.data.map((el) => {
                const keys = el.split(' ')
                return {
                  label: keys.slice(0, 2).join(' '),
                  path: keys[2],
                  apCost: keys[3],
                }
              }), //change(el.data)
            }
          } else {
            const keys = el.split(' ').filter((e) => e)
            return {
              label: keys.slice(0, 2).join(' '),
              path: keys[2],
              apCost: keys[3],
              etCost: keys[4],
            }
          }
        }),
      }
    } else {
      return { label: getStageType(key), children: change(value) }
    }
  })
}

function creatBranch(label, data) {
  return {
    ...data,
    label,
    children: [],
  }
}
