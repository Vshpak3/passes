import { BadRequestException } from '@nestjs/common'

export class NoPayinMethodError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayinMethodError.prototype)
  }
}

export class PayinNotFoundError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayinNotFoundError.prototype)
  }
}

export class InvalidPayinRequestError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidPayinRequestError.prototype)
  }
}

export class InvalidPayinStatusError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, InvalidPayinStatusError.prototype)
  }
}

export class InvalidPayinStatusForbiddenError extends InvalidPayinStatusError {
  constructor(msg: string) {
    super('Forbidden (must fix)' + msg)
    Object.setPrototypeOf(this, InvalidPayinStatusForbiddenError.prototype)
  }
}
