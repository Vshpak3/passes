export class ForbiddenPostException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPostException.prototype)
  }
}
