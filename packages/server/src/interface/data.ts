import {
  IActivityInfo,
  IChar,
  IEnemyData,
  IEnemyInfo,
  IGachaPoolInfo,
  IStageInfo,
  ITeamInfo,
} from '@kkdy/data'
import { BaseEntityType } from './utilsType'

export interface GetCharacterList {
  path: '/data/list'
  method: 'get'

  response: {
    updatedDate: Date
    version: number
    charId: string
    installId: string
    teamInfo: ITeamInfo.IInfo[]
    rarity: number
    profession: string
  }[]
}

export interface GetActivityList {
  path: '/data/acts'
  method: 'get'

  response: IActivityInfo.IInfo[]
}

export interface GetGachaPoolList {
  path: '/data/gachaPools'
  method: 'get'

  response: { data: IGachaPoolInfo.IInfo; id: number }[]
}

export interface GetGachaPoolListByIds {
  path: '/data/gachaPools/ids'
  method: 'post'

  data: {
    ids: number[]
  }

  response: (BaseEntityType<IGachaPoolInfo.IInfo> & {
    relativeChars: BaseEntityType<any>[] | null
  })[]
}

export interface UpdateRelativeChar {
  path: '/data/char/relative'
  method: 'post'

  data: {
    targetId: string
    relativeId: string
  }

  response: true
}

export interface UpdateCharSkillComment {
  path: '/data/char/skillComment'
  method: 'post'

  data: {
    comments: string[]
    id: string
  }

  response: true
}

export interface UpdateCharCharComment {
  path: '/data/char/charComment'
  method: 'post'

  data: {
    comment: string
    id: string
  }

  response: true
}

export interface UpdateEnemyComments {
  path: '/data/enemy/comments'
  method: 'post'

  data: {
    comments: string[]
    id: string
  }

  response: true
}

export interface ListEnemies {
  path: '/data/enemy/list'
  method: 'get'

  response: (BaseEntityType<IEnemyData.IData> & {
    info: IEnemyInfo.IInfo
    enemyId: string
    comments: null | string[]
  })[]
}

export interface ListMap {
  path: '/data/map/list'

  method: 'get'

  response: {
    levelId: string
    label: string
    stageType: IStageInfo.StageType | (string & {})
    hardStagedId: string
  }[]
}
