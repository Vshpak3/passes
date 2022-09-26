import { BadRequestException } from '@nestjs/common'

export class MessageSendError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, MessageSendError.prototype)
  }
}

export class PaidMessageNotFound extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PaidMessageNotFound.prototype)
  }
}
