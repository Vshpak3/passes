export class InvalidMessageTipMinimumError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidMessageTipMinimumError.prototype)
  }
}

export class CommentsBlockedError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, CommentsBlockedError.prototype)
  }
}
