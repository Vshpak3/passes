export class NoListError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoListError.prototype)
  }
}

export class IncorrectListTypeError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, IncorrectListTypeError.prototype)
  }
}

export class ListLimitReachedError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ListLimitReachedError.prototype)
  }
}
