export class PayinCallbackInput {}

export class MessagePayinCallbackInput extends PayinCallbackInput {
  // TODO: figure out inputs
}

export class NftPassPayinCallbackInput extends PayinCallbackInput {
  userId: string
  passId: string
  temporary?: boolean
}

export class ExamplePayinCallbackInput extends PayinCallbackInput {
  // TODO: figure out inputs
  example: string
}
