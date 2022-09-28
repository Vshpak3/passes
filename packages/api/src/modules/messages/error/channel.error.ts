import { BadRequestException } from '@nestjs/common'

export class ChannelNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ChannelNotFoundException.prototype)
  }
}

export class ForbiddenChannelError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenChannelError.prototype)
  }
}
