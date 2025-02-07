// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import CryptoJS from 'crypto-js'

import { DatabaseService } from '../../database/database.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PostEntity } from '../post/entities/post.entity'
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
import { PayinEntity } from './entities/payin.entity'
import { SubscriptionEntity } from './entities/subscription.entity'
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import { SubscriptionStatusEnum } from './enum/subscription.status.enum'
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
        failure: purchasePostFailureCallback,
        creation: purchasePostCreationCallback,
      }
    case PayinCallbackEnum.PURCHASE_DM:
      return {
        success: purchaseMessageSuccessfulCallback,
        failure: purchaseMessageFailureCallback,
        creation: purchaseMessageCreationCallback,
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
  payin: PayinEntity,
  input: PayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  return {}
}

async function tippedMessageCreationCallback(
  payin: PayinEntity,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  const messageId = await payService.messagesService.createMessage(
    true,
    input.userId,
    input.text,
    input.channelId,
    input.receiverId,
    payin.amount,
    true,
    input.contents,
    input.previewIndex,
  )
  input.messageId = messageId
  await payService.updateInputJSON(payin.id, input)
  return { messageId }
}

async function tippedMessageFailureCallback(
  payin: PayinEntity,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  await payService.messagesService.deletePendingMessage(
    input.messageId as string,
  )
  return { messageId: input.messageId as string }
}

async function tippedMessageSuccessCallback(
  payin: PayinEntity,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TippedMessagePayinCallbackOutput> {
  await payService.messagesService.sendPendingMessage(
    input.userId,
    input.messageId as string,
    input.channelId,
    input.receiverId,
    payin.amount,
  )
  return { messageId: input.messageId as string }
}

async function createNftPassCreationCallback(
  payin: PayinEntity,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PayinCallbackOutput> {
  await payService.passService.useSupply(input.passId)
  await payService.passService.publishBuyingPass(payin.user_id, input.passId)
  return {}
}

async function createNftPassFailureCallback(
  payin: PayinEntity,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PayinCallbackOutput> {
  await payService.passService.freeSupply(input.passId)
  await payService.passService.publishFailedBuyingPass(
    payin.user_id,
    input.passId,
  )
  return {}
}

async function createNftPassSuccessCallback(
  payin: PayinEntity,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<CreateNftPassPayinCallbackOutput> {
  const newPassHolder = await payService.passService.createPassHolder(
    input.userId,
    input.passId,
    input.walletAddress,
  )
  const payinDto = new PayinDto(payin)
  if (newPassHolder.expiresAt) {
    await payService.subscribe({
      userId: payinDto.userId,
      passHolderId: newPassHolder.id,
      amount: payinDto.amount,
      payinMethod: payinDto.payinMethod,
      target: CryptoJS.SHA256(`nft-pass-holder-${newPassHolder.id}`).toString(
        CryptoJS.enc.Hex,
      ),
      ipAddress: payin.ip_address,
      sessionId: payin.session_id,
    })
  }
  const pass = await db<PassEntity>(PassEntity.table)
    .where({ id: input.passId })
    .select('creator_id', 'title')
    .first()

  // auto follow
  try {
    if (pass?.creator_id) {
      await payService.followService.followCreator(
        input.userId,
        pass.creator_id,
      )
    }
  } catch (err) {
    if (
      !(err instanceof BadRequestException || err instanceof ConflictException)
    ) {
      payService.sentry.instance().captureException(err)
    }
  }

  // send purchase message in chat
  try {
    if (pass?.creator_id) {
      await payService.messagesService.sendAutomaticMessage(
        input.userId,
        pass.creator_id,
        `You purchased ${pass.title} membership`,
      )
    }
  } catch (err) {
    if (!(err instanceof BadRequestException)) {
      payService.sentry.instance().captureException(err)
    }
  }

  return {
    passHolderId: newPassHolder.id,
    expiresAt: newPassHolder.expiresAt,
  }
}

async function renewNftPassSuccessCallback(
  payin: PayinEntity,
  input: RenewNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<RenewNftPassPayinCallbackOutput> {
  const expiresAt = await payService.passService.renewPass(input.passHolderId)
  await db<SubscriptionEntity>(SubscriptionEntity.table)
    .update({ subscription_status: SubscriptionStatusEnum.ACTIVE })
    .where({ user_id: payin.user_id, pass_holder_id: input.passHolderId })
  return {
    passHolderId: input.passHolderId,
    expiresAt,
  }
}

async function purchasePostSuccessfulCallback(
  payin: PayinEntity,
  input: PurchasePostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchasePostCallbackOutput> {
  const creatorId = await payService.postService.purchasePost(
    input.userId,
    input.postId,
    payin.id,
    payin.amount,
  )
  try {
    await payService.followService.followCreator(input.userId, creatorId)
  } catch (err) {
    if (
      !(err instanceof BadRequestException || err instanceof ConflictException)
    ) {
      payService.sentry.instance().captureException(err)
    }
  }
  return { postId: input.postId }
}

async function purchasePostCreationCallback(
  payin: PayinEntity,
  input: PurchasePostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchasePostCallbackOutput> {
  await payService.postService.purchasingPost(
    input.userId,
    input.postId,
    payin.id,
  )
  return { postId: input.postId }
}

async function purchasePostFailureCallback(
  payin: PayinEntity,
  input: PurchasePostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchasePostCallbackOutput> {
  await payService.postService.failPostPurchase(
    input.userId,
    input.postId,
    payin.id,
  )
  return { postId: input.postId }
}

async function purchaseMessageSuccessfulCallback(
  payin: PayinEntity,
  input: PurchaseMessageCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchaseMessageCallbackOutput> {
  await payService.messagesService.purchaseMessage(
    payin.user_id,
    input.messageId,
    input.paidMessageId,
    payin.amount,
  )
  return {}
}

async function purchaseMessageCreationCallback(
  payin: PayinEntity,
  input: PurchaseMessageCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchaseMessageCallbackOutput> {
  await payService.messagesService.payingMessage(payin.user_id, input.messageId)
  return {}
}

async function purchaseMessageFailureCallback(
  payin: PayinEntity,
  input: PurchaseMessageCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<PurchaseMessageCallbackOutput> {
  await payService.messagesService.failMessagePayment(
    payin.user_id,
    input.messageId,
  )
  return {}
}

async function tipPostSuccessfulCallback(
  payin: PayinEntity,
  input: TipPostCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<TipPostCallbackOutput> {
  await payService.postService.createTip(
    input.userId,
    input.postId,
    input.amount,
  )
  const post = await db<PostEntity>(PostEntity.table)
    .where({
      id: input.postId,
    })
    .select('user_id')
    .first()

  if (!post) {
    throw new InternalServerErrorException('no post found')
  }

  await payService.messagesService.sendAutomaticMessage(
    input.userId,
    post.user_id,
    `You tipped $${input.amount.toFixed()} on a post`,
  )
  return { postId: input.postId, amount: input.amount }
}
