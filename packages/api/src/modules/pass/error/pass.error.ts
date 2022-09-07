export class ForbiddenPassException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPassException.prototype)
  }
}

export class NoPassError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPassError.prototype)
  }
}

export class UnsupportedChainPassError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedChainPassError.prototype)
  }
}
