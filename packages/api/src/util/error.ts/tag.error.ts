export class TagError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, TagError.prototype)
  }
}
