export class MessageSendError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageSendError.prototype)
  }
}
