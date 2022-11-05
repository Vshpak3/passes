import { BadRequestException } from '@nestjs/common'

export class NoPayoutMethodExcption extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, NoPayoutMethodExcption.prototype)
  }
}

export class PayoutNotFoundException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutNotFoundException.prototype)
  }
}

export class PayoutFrequencyException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutFrequencyException.prototype)
  }
}

export class PayoutAmountException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutAmountException.prototype)
  }
}

export class PayoutMethodException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PayoutMethodException.prototype)
  }
}
