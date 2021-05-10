import { IActivityInfo, IChar, IGachaPoolInfo, ITeamInfo } from '@kkdy/data'
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

  response: IGachaPoolInfo.IInfo[]
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
    comment: string
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
