export class NoPayoutMethodError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayoutMethodError.prototype)
  }
}
