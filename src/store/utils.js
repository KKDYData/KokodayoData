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

    console.log('sss? ', getStageType(st), st)

    if (!map[st]) {
      // map[st] = creatBranch((chapterMap[st] = creatBranch(getStageType(st))))
      map[st] = creatBranch(getStageType(st))
    }

    // 分章节
    if (['sub', 'main'].includes(_st)) {
      const chapter = _code[0].split('-')[0]
      if (!chapterMap[chapter]) {
        chapterMap[chapter] = creatBranch(chapter)
      }
      chapterMap[chapter].children.push(creatBranch(label, stage))
    } else if (stageType === StageType.Activity) {
      const act = _st
      if (!actMap[act]) {
        actMap[act] = creatBranch(getStageType(act), stage)
      }
      actMap[act].children.push(creatBranch(label, stage))
    } else {
      map[st].children.push(creatBranch(label || _code.join(' | '), stage))
    }
  })

  map[StageType.Main].children = Object.values(chapterMap)
  map[StageType.Activity].children = Object.values(actMap)
  console.log(map)
  return Object.values(map)
}

function creatBranch(label, data) {
  return {
    ...data,
    label,
    children: [],
  }
}
