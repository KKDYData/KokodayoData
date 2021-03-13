
export class BaseError extends Error {
  code: number
  msg: string

  constructor (msg: string, code: number) {
    super(msg)
    this.code = code
    this.msg = msg
    this.name = 'BaseError'
  }
}