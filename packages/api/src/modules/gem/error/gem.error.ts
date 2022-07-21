export class RepeatTransferError extends Error {
  constructor(msg: string) {
    super('CRITICAL - transfer for source was already completed: ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RepeatTransferError.prototype)
  }
}
