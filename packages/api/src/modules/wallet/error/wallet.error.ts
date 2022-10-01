import { BadRequestException } from '@nestjs/common'

export class UnsupportedDefaultWalletError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedDefaultWalletError.prototype)
  }
}

export class WalletNotFoundError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, WalletNotFoundError.prototype)
  }
}
