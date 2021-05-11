import { request } from './instance'
import { JsonResponse } from './response'
import { IActivityInfo, IChar, IGachaPoolInfo, ITeamInfo } from '@kkdy/data'
import { BaseEntityType } from './utilsType'

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
export function GetActivityList() {
  return request.get<JsonResponse<IActivityInfo.IInfo[]>>('/data/acts')
}
export function GetGachaPoolList() {
  return request.get<
    JsonResponse<
      {
        data: IGachaPoolInfo.IInfo
        id: number
      }[]
    >
  >('/data/gachaPools')
}
export function GetGachaPoolListByIds(data: { ids: number[] }) {
  return request.post<
    JsonResponse<
      (BaseEntityType<IGachaPoolInfo.IInfo> & {
        relativeChars: BaseEntityType<any>[] | null
      })[]
    >
  >('/data/gachaPools/ids', data)
}
export function UpdateRelativeChar(data: {
  targetId: string
  relativeId: string
}) {
  return request.post<JsonResponse<true>>('/data/char/relative', data)
}
export function UpdateCharSkillComment(data: {
  comments: string[]
  id: string
}) {
  return request.post<JsonResponse<true>>('/data/char/skillComment', data)
}
export function UpdateCharCharComment(data: { comment: string; id: string }) {
  return request.post<JsonResponse<true>>('/data/char/charComment', data)
}
export function UpdateEnemyComments(data: { comments: string[]; id: string }) {
  return request.post<JsonResponse<true>>('/data/enemy/comments', data)
}
