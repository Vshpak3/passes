export class PayinCallbackInput {}

export class MessagePayinCallbackInput extends PayinCallbackInput {
  // TODO: figure out inputs
}

export class CreateNftPassPayinCallbackInput extends PayinCallbackInput {
  userId: string
  passId: string
}

export class RenewNftPassPayinCallbackInput extends PayinCallbackInput {
  passOwnershipId: string
}

export class ExamplePayinCallbackInput extends PayinCallbackInput {
  // TODO: figure out inputs
  example: string
}

export class PayinCallbackOutput {}

export class MessagePayinCallbackOutput extends PayinCallbackInput {
  // TODO: figure out inputs
}

export class CreateNftPassPayinCallbackOutput extends PayinCallbackInput {
  passOwnershipId: string
  expiresAt?: number
}

export class RenewNftPassPayinCallbackOutput extends PayinCallbackInput {
  passOwnershipId: string
  expiresAt?: number
}

export class ExamplePayinCallbackOutput extends PayinCallbackInput {
  // TODO: figure out inputs
  example: string
}
