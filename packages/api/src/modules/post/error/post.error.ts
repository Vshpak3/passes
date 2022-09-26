import { BadRequestException } from '@nestjs/common'

export class ForbiddenPostException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPostException.prototype)
  }
}

export class PostNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PostNotFoundException.prototype)
  }
}
