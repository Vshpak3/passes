import { MessageDto } from '../messages/dto/message.dto'

export class PayinCallbackInput {}

export class MessagePayinCallbackInput extends PayinCallbackInput {
  userId: string
  sendMessageDto: MessageDto
  pendingMessageId?: string
}

export class CreateNftPassPayinCallbackInput extends PayinCallbackInput {
  userId: string
  passId: string
}

export class RenewNftPassPayinCallbackInput extends PayinCallbackInput {
  passHolderId: string
}

export class PurchasePostCallbackInput extends PayinCallbackInput {
  userId: string
  postId: string
}

export class TipPostCallbackInput extends PayinCallbackInput {
  userId: string
  postId: string
  amount: number
}

export class ExamplePayinCallbackInput extends PayinCallbackInput {
  // TODO: figure out inputs
  example: string
}

export class PayinCallbackOutput {}

export class MessagePayinCallbackOutput extends PayinCallbackOutput {
  userId: string
}

export class CreateNftPassPayinCallbackOutput extends PayinCallbackOutput {
  passHolderId: string
  expiresAt?: number
}

export class RenewNftPassPayinCallbackOutput extends PayinCallbackOutput {
  passHolderId: string
  expiresAt?: number
}

export class PurchasePostCallbackOutput extends PayinCallbackOutput {
  postId: string
}

export class TipPostCallbackOutput extends PayinCallbackOutput {
  postId: string
  amount: number
}

export class ExamplePayinCallbackOutput extends PayinCallbackOutput {
  // TODO: figure out inputs
  example: string
}
