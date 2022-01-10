export interface TAds {
  date: string
  pics: string[]
  pics_m: string[]
  text: string
  link: string
}

export interface GetAds {
  path: '/ark'
  method: 'get'

  response: TAds[]
}
