import { BadRequestException } from '@nestjs/common'

export class TagError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, TagError.prototype)
  }
}
