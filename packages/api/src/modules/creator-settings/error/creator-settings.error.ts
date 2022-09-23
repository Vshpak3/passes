import { BadRequestException } from '@nestjs/common'

export class InvalidMessageTipMinimumError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidMessageTipMinimumError.prototype)
  }
}

export class CommentsBlockedError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, CommentsBlockedError.prototype)
  }
}
