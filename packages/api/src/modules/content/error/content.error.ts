export class NoContentError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoContentError.prototype)
  }
}

export class ContentDeleteError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ContentDeleteError.prototype)
  }
}
