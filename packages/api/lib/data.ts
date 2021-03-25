import { request } from './instance'
import { JsonResponse } from './response'
import { ITeamInfo } from '@kkdy/data'

export function GetCharacterList() {
  return request.get<
    JsonResponse<
      {
        updatedDate: Date
        version: number
        charId: string
        installId: string
        teamInfo: ITeamInfo.IInfo[]
        rarity: number
        profession: string
      }[]
    >
  >('/data/list')
}
