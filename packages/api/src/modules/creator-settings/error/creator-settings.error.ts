export class InvalidMessageTipMinimumError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidMessageTipMinimumError.prototype)
  }
}
