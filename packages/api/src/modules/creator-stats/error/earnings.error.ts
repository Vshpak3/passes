export class EarningsTypeError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, EarningsTypeError.prototype)
  }
}
