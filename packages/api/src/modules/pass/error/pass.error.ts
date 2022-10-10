import { BadRequestException } from '@nestjs/common'

export class ForbiddenPassException extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenPassException.prototype)
  }
}

export class PassNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PassNotFoundException.prototype)
  }
}

export class BadPassPropertiesException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, BadPassPropertiesException.prototype)
  }
}

export class PassHolderNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PassHolderNotFoundException.prototype)
  }
}

export class UnsupportedChainPassError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedChainPassError.prototype)
  }
}
