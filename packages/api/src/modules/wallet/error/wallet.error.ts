export class UnsupportedDefaultWalletError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedDefaultWalletError.prototype)
  }
}

export class WalletNotFoundError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, WalletNotFoundError.prototype)
  }
}
