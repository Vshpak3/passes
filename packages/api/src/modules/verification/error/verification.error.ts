export class PersonaVerificationError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PersonaVerificationError.prototype)
  }
}

export class IncorrectVerificationStepError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, IncorrectVerificationStepError.prototype)
  }
}

export class VerificationError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, VerificationError.prototype)
  }
}
