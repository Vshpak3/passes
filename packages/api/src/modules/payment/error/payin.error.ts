export class NoPayinMethodError extends Error {
  constructor(msg: string) {
    super(msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoPayinMethodError.prototype)
  }
}
