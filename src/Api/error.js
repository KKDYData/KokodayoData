export class ApiError extends Error {
  constructor(message, raw) {
    super(message)
    this.name = 'HError'
    this.raw = raw
  }
}
