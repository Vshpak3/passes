import { BadRequestException } from '@nestjs/common'

export class InvalidScheduledTime extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidScheduledTime.prototype)
  }
}
