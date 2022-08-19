export class ForbiddenPassException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPassException.prototype)
  }
}
