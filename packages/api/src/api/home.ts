import { IChar, ISkill } from '@kkdy/data'

export interface Hello {
  path: '/api/hello'
  method: 'get'

  params: {
    skillId: string
  }


  response: {
    skillId: string
    data: ISkill.ISkill
    chars: IChar.IData[]
  }
}


export interface HelloPost {
  path: '/api/hello'
  method: 'post'

  data: IChar.IData


  response: {
    skillId: string
    data: ISkill.ISkill
    chars: IChar.IData[]
  }
}
