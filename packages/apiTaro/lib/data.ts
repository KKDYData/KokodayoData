import { request } from './instance'
import { JsonResponse } from './response'
import { IActivityInfo, ITeamInfo } from '@kkdy/data'

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
export function UpdateRelativeChar(data: {
  targetId: string
  relativeId: string
}) {
  return request.post<JsonResponse<true>>('/data/char/relative', data)
}
export function UpdateCharSkillComment(data: { comment: string; id: string }) {
  return request.post<JsonResponse<true>>('/data/char/skillComment', data)
}
export function UpdateCharCharComment(data: { comment: string; id: string }) {
  return request.post<JsonResponse<true>>('/data/char/charComment', data)
}
