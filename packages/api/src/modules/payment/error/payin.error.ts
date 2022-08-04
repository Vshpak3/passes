export class NoPayinMethodError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayinMethodError.prototype)
  }
}

export class InvalidRequestPaymentRequest extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidRequestPaymentRequest.prototype)
  }
}
