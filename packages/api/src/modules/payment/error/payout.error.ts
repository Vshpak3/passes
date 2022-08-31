export class NoPayoutMethodError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayoutMethodError.prototype)
  }
}

export class PayoutFrequencyError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutFrequencyError.prototype)
  }
}

export class PayoutAmountError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutAmountError.prototype)
  }
}
