export class NoPayinMethodError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayinMethodError.prototype)
  }
}

export class InvalidPayinRequestError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidPayinRequestError.prototype)
  }
}

export class InvalidPayinStatusError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidPayinStatusError.prototype)
  }
}

export class InvalidPayinStatusForbiddenError extends InvalidPayinStatusError {
  constructor(msg: string) {
    super('Forbidden (must fix)' + msg)
    Object.setPrototypeOf(this, InvalidPayinStatusForbiddenError.prototype)
  }
}
