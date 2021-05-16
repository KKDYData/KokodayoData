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

  map[StageType.Main] = creatBranch(getStageType(StageType.Main))
  map[StageType.Activity] = creatBranch(getStageType(StageType.Activity))
  console.log(JSON.stringify(map))

  list.forEach((stage) => {
    const { stageType, label, levelId } = stage
    const [, _st, ..._code] = levelId.split('_')
    const st = stageType ?? _st

    // 合并 SUB 和 MAIN
    if ([StageType.Main, StageType.Sub].includes(st)) {
      // 分章节
      const chapter = ['training'].includes(_st) ? _st : _code[0].split('-')[0]
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
    } else if (!['level_main_01', 'level_main_00'].includes(levelId)) {
      if (!map[st]) {
        map[st] = creatBranch(getStageType(st))
      }
      map[st].children.push(creatBranch(label || _code.join(' | '), stage))
    }
  })

  map[StageType.Main].children = Object.values(chapterMap)
  map[StageType.Activity].children = Object.values(actMap)

  return Object.values(map)
}

function creatBranch(label, data) {
  return {
    ...data,
    label,
    children: [],
  }
}
