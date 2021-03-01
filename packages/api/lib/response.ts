export type JsonResponse<T> = {
  ok: true
  result: T
} | {
  ok: false
  code: number
  message?: string
  msg?: string
}