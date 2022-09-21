import { BadRequestException } from '@nestjs/common'

export class PersonaVerificationError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, PersonaVerificationError.prototype)
  }
}

export class IncorrectVerificationStepError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, IncorrectVerificationStepError.prototype)
  }
}

export class VerificationError extends BadRequestException {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, VerificationError.prototype)
  }
}
