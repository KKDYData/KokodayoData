import { IActivityInfo, ITeamInfo } from '@kkdy/data'

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
