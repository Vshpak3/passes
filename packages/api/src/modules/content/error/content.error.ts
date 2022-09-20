export class NoContentError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoContentError.prototype)
  }
}
