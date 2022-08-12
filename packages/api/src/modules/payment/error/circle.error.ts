export class CircleResponseError extends Error {
  constructor(msg: string) {
    super('bad circle response: ' + msg)
    Object.setPrototypeOf(this, CircleResponseError.prototype)
  }
}

export class CircleResponseStatusError extends CircleResponseError {
  constructor(msg: string, status: number) {
    super('status ' + status + ' - ' + msg)
    Object.setPrototypeOf(this, CircleResponseStatusError.prototype)
  }
}

export class CircleRequestError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, CircleRequestError.prototype)
  }
}

export class CircleNotificationError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, CircleNotificationError.prototype)
  }
}
