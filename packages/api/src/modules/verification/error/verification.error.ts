export class VerificationError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, VerificationError.prototype)
  }
}
