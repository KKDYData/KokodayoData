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

export interface GetChar {
  path: '/update/char'
  method: 'get'

  params: {
    id: string
  }

  response: {
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
  }
}
