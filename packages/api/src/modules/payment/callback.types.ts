export class PayinCallbackInput {}

export class MessagePayinCallbackInput extends PayinCallbackInput {
  userId: string
  text: string
  channelId: string
  contents: string
  messageId?: string
}

export class CreateNftPassPayinCallbackInput extends PayinCallbackInput {
  userId: string
  passId: string
  walletAddress?: string
}

export class RenewNftPassPayinCallbackInput extends PayinCallbackInput {
  passHolderId: string
}

export class PurchasePostCallbackInput extends PayinCallbackInput {
  userId: string
  postId: string
}

export class PurchaseMessageCallbackInput extends PayinCallbackInput {
  messageId: string
  paidMessageId: string
}

export class TipPostCallbackInput extends PayinCallbackInput {
  userId: string
  postId: string
  amount: number
}

export class ExamplePayinCallbackInput extends PayinCallbackInput {
  example: string
}

export class PayinCallbackOutput {}

export class TippedMessagePayinCallbackOutput extends PayinCallbackOutput {
  messageId: string
}

export class CreateNftPassPayinCallbackOutput extends PayinCallbackOutput {
  passHolderId: string
  expiresAt?: Date
}

export class RenewNftPassPayinCallbackOutput extends PayinCallbackOutput {
  passHolderId: string
  expiresAt?: Date
}

export class PurchasePostCallbackOutput extends PayinCallbackOutput {
  postId: string
}

export class PurchaseMessageCallbackOutput extends PayinCallbackOutput {}

export class TipPostCallbackOutput extends PayinCallbackOutput {
  postId: string
  amount: number
}

export class ExamplePayinCallbackOutput extends PayinCallbackOutput {
  example: string
}
