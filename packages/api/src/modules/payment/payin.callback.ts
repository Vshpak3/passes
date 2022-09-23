// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseService } from '../../database/database.service'
import {
  CreateNftPassPayinCallbackInput,
  CreateNftPassPayinCallbackOutput,
  MessagePayinCallbackInput,
  PayinCallbackInput,
  PayinCallbackOutput,
  PurchaseMessageCallbackInput,
  PurchaseMessageCallbackOutput,
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
        failure: createNftPassFailureCallback,
        creation: createNftPassCreationCallback,
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
    case PayinCallbackEnum.PURCHASE_POST:
      return {
        success: purchasePostSuccessfulCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.PURCHASE_DM:
      return {
        success: purchaseMessageSuccessfulCallback,
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

async function tippedMessageCreationCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  let paidMessageId: string | undefined = undefined
  if (input.contentIds.length > 0) {
    paidMessageId = await payService.messagesService.createPaidMessage(
      input.userId,
      input.text,
      input.contentIds,
      input.price ? 0 : (input.price as number),
    )
  }

  const messageId = await payService.messagesService.createMessage(
    input.userId,
    input.text,
    input.channelId,
    payin.amount,
    true,
    input.price,
    paidMessageId,
    input.contentIds,
  )
  input.messageId = messageId
  await this.payService.updateInputJSON(payin.id, input)
  return { messageId }
}

async function tippedMessageFailureCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  await payService.messagesService.deleteMessage(input.messageId as string)
  return { messageId: input.messageId as string }
}

async function tippedMessageSuccessCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  await payService.messagesService.sendPendingMessage(
    input.userId,
    input.messageId as string,
    input.channelId,
    payin.amount,
  )
  return { messageId: input.messageId as string }
}

async function createNftPassCreationCallback(
  payin: any,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PayinCallbackOutput> {
  await this.payService.passService.useSupply(input.passId)
  return {}
}

async function createNftPassFailureCallback(
  payin: any,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PayinCallbackOutput> {
  await this.payService.passService.freeSupply(input.passId)
  return {}
}

async function createNftPassSuccessCallback(
  payin: any,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<CreateNftPassPayinCallbackOutput> {
  const newPassHolder = await payService.passService.createPassHolder(
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
  await payService.postService.purchasePost(
    input.userId,
    input.postId,
    payin.id,
    await payService.getTotalEarnings(payin.id),
  )
  return { postId: input.postId }
}

async function purchaseMessageSuccessfulCallback(
  payin: any,
  input: PurchaseMessageCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchaseMessageCallbackOutput> {
  await payService.messagesService.purchaseMessage(
    payin.user_id,
    input.messageId,
    input.paidMessageId,
    await payService.getTotalEarnings(payin.id),
  )
  return {}
}

async function tipPostSuccessfulCallback(
  payin: any,
  input: TipPostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TipPostCallbackOutput> {
  await payService.postService.createTip(
    payin.id,
    input.userId,
    input.postId,
    input.amount,
  )
  return { postId: input.postId, amount: input.amount }
}

// try {
//   await this.dbWriter.transaction(async (trx) => {
//     await trx(MessagePostEntity.table)
//       .insert(
//         MessagePostEntity.toDict<MessagePostEntity>({
//           user: channelMember.other_user_id,
//           channel: sendMessageDto.channelId,
//           post: sendMessageDto.attachments[0],
//         }),
//       )
//       .onConflict(['user_id', 'post_id']) p
//       .ignore()
//     await trx
//       .from(
//         trx.raw('?? (??, ??)', [
//           UserMessageContentEntity.table,
//           'user_id',
//           'channel_id',
//           'content_id',
//         ]),
//       )
//       .insert(function () {
//         this.from(`${PostContentEntity.table}`)
//           .where('post_id', sendMessageDto.attachments[0].length)
//           .select(
//             this.dbWriter.raw('? AS ??', [
//               channelMember.other_user_id,
//               'user_id',
//             ]),
//             this.dbWriter.raw('? AS ??', [
//               sendMessageDto.channelId,
//               'channel_id',
//             ]),
//             'content_id',
//           )
//       })
//   })
// } catch (err) {
//   this.logger.info('resent post / content')
// }
