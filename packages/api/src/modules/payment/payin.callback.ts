// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseService } from '../../database/database.service'
import {
  CreateNftPassPayinCallbackInput,
  CreateNftPassPayinCallbackOutput,
  MessagePayinCallbackInput,
  PayinCallbackInput,
  PurchasePostCallbackInput,
  PurchasePostCallbackOutput,
  RenewNftPassPayinCallbackInput,
  RenewNftPassPayinCallbackOutput,
  TippedMessagePayinCallbackOutput,
  TipPostCallbackInput,
  TipPostCallbackOutput,
} from './callback.types'
import { PayinDto } from './dto/payin.dto'
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import { NoPayinMethodError } from './error/payin.error'
import { PaymentService } from './payment.service'

export const functionMapping = (payinCallbackEnum: PayinCallbackEnum) => {
  switch (payinCallbackEnum) {
    case PayinCallbackEnum.TIPPED_MESSAGE:
      return {
        success: tippedMessageSuccessCallback,
        failure: tippedMessageFailureCallback,
        creation: tippedMessageCreationCallback,
      }
    case PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS:
    case PayinCallbackEnum.CREATE_NFT_SUBSCRIPTION_PASS:
      return {
        success: createNftPassSuccessCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.RENEW_NFT_PASS:
      return {
        success: renewNftPassSuccessCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.EXAMPLE:
      return {
        success: empty,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.PURCHASE_FEED_POST:
    case PayinCallbackEnum.PURCHASE_DM_POST:
      return {
        success: purchasePostSuccessfulCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.TIP_POST:
      return {
        success: tipPostSuccessfulCallback,
        failure: empty,
        creation: empty,
      }
    default:
      throw new NoPayinMethodError('no method selected for callback')
  }
}

const empty = async (
  payin: any,
  input: PayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {}

async function tippedMessageSuccessCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  await payService.messagesService.sendMessage(
    input.userId,
    input.sendMessageDto,
  )
  return { userId: input.userId }
}

async function tippedMessageFailureCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  if (input.tippedMessageId) {
    await payService.messagesService.deleteTippedMessage(input.tippedMessageId)
  }
  return { userId: input.userId }
}

async function tippedMessageCreationCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  input.tippedMessageId = await payService.messagesService.createTippedMessage(
    input.userId,
    input.sendMessageDto,
  )
  await payService.updateInputJSON(payin.id, input)
  return { userId: input.userId }
}

async function createNftPassSuccessCallback(
  payin: any,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<CreateNftPassPayinCallbackOutput> {
  const newPassHolder = await payService.passService.createPass(
    input.userId,
    input.passId,
  )
  const payinDto = new PayinDto(payin)
  if (newPassHolder.expiresAt) {
    await payService.subscribe({
      userId: payinDto.userId,
      passHolderId: newPassHolder.id,
      amount: payinDto.amount,
      payinMethod: payinDto.payinMethod,
    })
  }
  return {
    passHolderId: newPassHolder.id,
    expiresAt: newPassHolder.expiresAt,
  }
}

async function renewNftPassSuccessCallback(
  payin: any,
  input: RenewNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<RenewNftPassPayinCallbackOutput> {
  const expiresAt = await payService.passService.renewPass(input.passHolderId)
  return {
    passHolderId: input.passHolderId,
    expiresAt,
  }
}

async function purchasePostSuccessfulCallback(
  payin: any,
  input: PurchasePostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchasePostCallbackOutput> {
  await payService.postService.addUserAccess(input.userId, input.postId)
  return { postId: input.postId }
}

async function tipPostSuccessfulCallback(
  payin: any,
  input: TipPostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TipPostCallbackOutput> {
  await payService.postService.createTip(
    input.userId,
    input.postId,
    input.amount,
  )
  return { postId: input.postId, amount: input.amount }
}
