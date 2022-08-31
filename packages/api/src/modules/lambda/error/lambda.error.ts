class LambdaResponseError extends Error {
  constructor(msg: string) {
    super('bad AWS lambda response: ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LambdaResponseError.prototype)
  }
}

export class LambdaResponseStatusError extends LambdaResponseError {
  constructor(msg: string, status: number | undefined) {
    super('status ' + status + ' - ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LambdaResponseStatusError.prototype)
  }
}

export class LambdaFunctionError extends LambdaResponseError {
  constructor(msg: string) {
    super('function failed - ' + msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LambdaResponseStatusError.prototype)
  }
}
