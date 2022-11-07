export class InvalidSubscriptionError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidSubscriptionError.prototype)
  }
}
