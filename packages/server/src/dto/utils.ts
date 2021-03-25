export type ParamsType<T> = T extends { params: infer P } ? P : never
export type BodyType<T> = T extends { data: infer P } ? P : never

export type GetResType<T> = T extends { response: infer P } ? P : never
