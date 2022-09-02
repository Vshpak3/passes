export class MessageTipError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageTipError.prototype)
  }
}
