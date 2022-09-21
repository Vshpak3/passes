import { BadRequestException } from '@nestjs/common'

export class ForbiddenPassException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPassException.prototype)
  }
}

export class NoPassError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPassError.prototype)
  }
}

export class UnsupportedChainPassError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedChainPassError.prototype)
  }
}
