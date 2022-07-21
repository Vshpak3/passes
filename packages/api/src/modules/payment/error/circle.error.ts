export class CircleResponseError extends Error {
  constructor(msg: string) {
    super('bad circle response: ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CircleResponseError.prototype)
  }
}

export class CircleResponseStatusError extends CircleResponseError {
  constructor(msg: string, status: number) {
    super('status ' + status + ' - ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CircleResponseStatusError.prototype)
  }
}
