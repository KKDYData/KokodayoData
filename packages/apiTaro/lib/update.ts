import { request } from './instance'
import { JsonResponse } from './response'
import {
  IBuilding,
  IChar,
  ISkill,
  ICharInfo,
  ICharWord,
  ITeamInfo,
  IPatchInfo,
} from '@kkdy/data'
import { BaseEntityType } from './utilsType'

export function GetChar(params: { id: string }) {
  return request.get<
    JsonResponse<{
      id: number
      createdDate: Date
      updatedDate: Date
      version: number
      charId: string
      name: string
      patchInfo?: IPatchInfo.IInfo | null
      installId: string
      skillComment: string
      charComment: string
      data: IChar.IData
      words: BaseEntityType<ICharWord.IWord>[] | null
      skills: BaseEntityType<ISkill.ISkill>[] | null
      buildingSkill: BaseEntityType<IBuilding.ISkill> | null
      info: BaseEntityType<ICharInfo.IInfo> | null
      teamInfo: BaseEntityType<ITeamInfo.IInfo>[] | null
      relativeChars: BaseEntityType<any>[] | null
    }>
  >('/update/char', { params })
}
export function UpdateGachaPoolByName(data: {
  name: string
  chars?: string[]
  link?: string
}) {
  return request.post<JsonResponse<true>>('/update/gachaPool/name', data)
}
export function UpdateGachaPoolByDateRange(data: {
  startDate: Date
  endDate: Date
  chars?: string[]
  link?: string
}) {
  return request.post<JsonResponse<true>>('/update/gachaPool/name', data)
}
