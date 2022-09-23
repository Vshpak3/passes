import { BadRequestException } from '@nestjs/common'

export class NoPayoutMethodError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayoutMethodError.prototype)
  }
}

export class PayoutFrequencyError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutFrequencyError.prototype)
  }
}

export class PayoutAmountError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutAmountError.prototype)
  }
}
