import { BadRequestException } from '@nestjs/common'

export class NoListError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoListError.prototype)
  }
}

export class IncorrectListTypeError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, IncorrectListTypeError.prototype)
  }
}

export class ListLimitReachedError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ListLimitReachedError.prototype)
  }
}
