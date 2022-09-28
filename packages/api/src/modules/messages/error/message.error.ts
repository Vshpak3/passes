import { BadRequestException } from '@nestjs/common'

export class MessageSendError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageSendError.prototype)
  }
}

export class PaidMessageNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PaidMessageNotFoundException.prototype)
  }
}

export class MessageNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageNotFoundException.prototype)
  }
}
