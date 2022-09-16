export class UnsupportedDefaultWallet extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnsupportedDefaultWallet.prototype)
  }
}
