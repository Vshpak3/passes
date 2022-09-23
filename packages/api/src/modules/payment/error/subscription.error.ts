import { BadRequestException } from '@nestjs/common'

export class InvalidSubscriptionError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidSubscriptionError.prototype)
  }
}
