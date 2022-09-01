export class PersonaResponseError extends Error {
  constructor(msg: string) {
    super('bad circle response: ' + msg)
    Object.setPrototypeOf(this, PersonaResponseError.prototype)
  }
}

export class PersonaResponseStatusError extends PersonaResponseError {
  constructor(msg: string, status: number) {
    super('status ' + status + ' - ' + msg)
    Object.setPrototypeOf(this, PersonaResponseStatusError.prototype)
  }
}
