import { ITeamInfo } from '@kkdy/data'

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
