export class MessageTipError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageTipError.prototype)
  }
}

export class MessageSendError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageSendError.prototype)
  }
}
