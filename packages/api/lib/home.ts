import { request } from './instance'
import { JsonResponse } from './response'
import { IChar, ISkill } from '@kkdy/data'

export function Hello(params: { skillId: string }) {
  return request.get<
    JsonResponse<{
      skillId: string
      data: ISkill.ISkill
      chars: IChar.IData[]
    }>
  >('/api/hello', { params })
}
export function HelloPost(data: IChar.IData) {
  return request.post<
    JsonResponse<{
      skillId: string
      data: ISkill.ISkill
      chars: IChar.IData[]
    }>
  >('/api/hello', data)
}
