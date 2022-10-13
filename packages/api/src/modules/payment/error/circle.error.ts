import { BadRequestException } from '@nestjs/common'

export class CircleResponseStatusError extends BadRequestException {
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
