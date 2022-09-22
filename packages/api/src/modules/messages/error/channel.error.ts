export class ChannelMissingError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ChannelMissingError.prototype)
  }
}
