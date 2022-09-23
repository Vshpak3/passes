import { BadRequestException } from '@nestjs/common'

export class ChannelMissingError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ChannelMissingError.prototype)
  }
}
