export class ChannelMissingMembersError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ChannelMissingMembersError.prototype)
  }
}
