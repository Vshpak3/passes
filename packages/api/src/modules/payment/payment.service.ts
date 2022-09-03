import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { PayoutFrequencyEnum } from '../creator-settings/enum/payout-frequency.enum'
import { CreatorStatsService } from '../creator-stats/creator-stats.service'
import { EVM_ADDRESS } from '../eth/eth.addresses'
import { MessagesService } from '../messages/messages.service'
import { PassDto } from '../pass/dto/pass.dto'
import { PassHolderDto } from '../pass/dto/pass-holder.dto'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassService } from '../pass/pass.service'
import { PostService } from '../post/post.service'
import { SOL_ACCOUNT, SOL_NETWORK } from '../sol/sol.accounts'
import { UserEntity } from '../user/entities/user.entity'
import { WalletDto } from '../wallet/dto/wallet.dto'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { CircleConnector } from './circle'
import { CircleBankDto } from './dto/circle/circle-bank.dto'
import { CircleCardDto } from './dto/circle/circle-card.dto'
import {
  CircleNotificationDto,
  GenericCircleObjectWrapper,
} from './dto/circle/circle-notification.dto'
import { CirclePaymentDto } from './dto/circle/circle-payment.dto'
import { CircleTransferDto } from './dto/circle/circle-transfer.dto'
import { CircleCreateBankRequestDto } from './dto/circle/create-bank.dto'
import { CircleCreateCardDto } from './dto/circle/create-card.dto'
import { CircleCreateCardPaymentRequestDto } from './dto/circle/create-card-payment.dto'
import { CircleCreatePayoutRequestDto } from './dto/circle/create-circle-payout.dto'
import { CircleCreateTransferRequestDto } from './dto/circle/create-circle-transfer.dto'
import { CircleEncryptionKeyResponseDto } from './dto/circle/encryption-key.dto'
import { CircleStatusResponseDto } from './dto/circle/status.dto'
import { CreatorFeeDto } from './dto/creator-fee.dto'
import { GetPayinsRequestDto, GetPayinsResponseDto } from './dto/get-payin.dto'
import {
  GetPayoutsRequestDto,
  GetPayoutsResponseDto,
} from './dto/get-payout.dto'
import { PayinDto } from './dto/payin.dto'
import {
  CircleCardPayinEntryRequestDto,
  CircleCardPayinEntryResponseDto,
} from './dto/payin-entry/circle-card.payin-entry.dto'
import { MetamaskCircleETHEntryResponseDto } from './dto/payin-entry/metamask-circle-eth.payin-entry.dto'
import { MetamaskCircleUSDCEntryResponseDto } from './dto/payin-entry/metamask-circle-usdc.payin-entry.dto'
import {
  PayinEntryRequestDto,
  PayinEntryResponseDto,
} from './dto/payin-entry/payin-entry.dto'
import { PhantomCircleUSDCEntryResponseDto } from './dto/payin-entry/phantom-circle-usdc.payin-entry.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import { PayoutDto } from './dto/payout.dto'
import { PayoutMethodDto } from './dto/payout-method.dto'
import {
  RegisterPayinRequestDto,
  RegisterPayinResponseDto,
} from './dto/register-payin.dto'
import { SubscribeRequestDto, SubscribeResponseDto } from './dto/subscribe.dto'
import { SubscriptionDto } from './dto/subscription.dto'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { CirclePayoutEntity } from './entities/circle-payout.entity'
import { CircleTransferEntity } from './entities/circle-transfer.entity'
import { CreatorFeeEntity } from './entities/creator-fee.entity'
import { CreatorShareEntity } from './entities/creator-share.entity'
import { DefaultPayinMethodEntity } from './entities/default-payin-method.entity'
import { DefaultPayoutMethodEntity } from './entities/default-payout-method.entity'
import { PayinEntity } from './entities/payin.entity'
import { PayoutEntity } from './entities/payout.entity'
import { SubscriptionEntity } from './entities/subscription.entity'
import { CircleAccountStatusEnum } from './enum/circle-account.status.enum'
import { CircleCardVerificationEnum } from './enum/circle-card.verification.enum'
import { CircleNotificationTypeEnum } from './enum/circle-notificiation.type.enum'
import { CirclePaymentStatusEnum } from './enum/circle-payment.status.enum'
import { CircleTransferStatusEnum } from './enum/circle-transfer.status.enum'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { PayinMethodEnum } from './enum/payin-method.enum'
import { PayoutStatusEnum } from './enum/payout.status.enum'
import { PayoutMethodEnum } from './enum/payout-method.enum'
import { SubscriptionStatusEnum } from './enum/subscription.status.enum'
import {
  CircleNotificationError,
  CircleRequestError,
  CircleResponseError,
} from './error/circle.error'
import {
  InvalidPayinRequestError,
  InvalidPayinStatusError,
  NoPayinMethodError,
} from './error/payin.error'
import { PayoutAmountError, PayoutFrequencyError } from './error/payout.error'
import { InvalidSubscriptionError } from './error/subscription.error'
import {
  handleCreationCallback,
  handleFailedCallback,
  handleSuccesfulCallback,
} from './payment.payin'

const DEFAULT_FIAT_FEE_RATE = 0.2
const DEFAULT_CRYPTO_FEE_RATE = 0.1

const DEFAULT_FIAT_FEE_FLAT = 0.25
const DEFAULT_CRYPTO_FEE_FLAT = 0

const MAX_CARDS_PER_USER = 10
const MAX_BANKS_PER_USER = 5
const MAX_TIME_BETWEEN_PAYOUTS_MS = 1000 // TODO: change to 3 days:  3 * 24 * 60 * 60 * 1000

const EXPIRING_DURATION_MS = 3 * 24 * 60 * 60 * 1000 // 3 days

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

const MIN_PAYOUT_AMOUNT = 25.0

@Injectable()
export class PaymentService {
  circleConnector: CircleConnector
  circleMasterWallet: string
  passService: PassService
  messagesService: MessagesService
  postService: PostService
  creatorShares: any
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private readonly creatorStatsService: CreatorStatsService,
    private moduleRef: ModuleRef,
  ) {
    this.circleConnector = new CircleConnector(this.configService)
    this.circleMasterWallet = this.configService.get(
      'circle.master_wallet_id',
    ) as string
  }

  async onModuleInit() {
    this.passService = this.moduleRef.get(PassService, { strict: false })
    this.messagesService = this.moduleRef.get(MessagesService, {
      strict: false,
    })
    this.postService = this.moduleRef.get(PostService, {
      strict: false,
    })
  }
  /*
  -------------------------------------------------------------------------------
  CIRCLE
  -------------------------------------------------------------------------------
  */

  /**
   * get circle's public encryption key
   *
   * @returns
   */
  async getCircleEncryptionKey(): Promise<CircleEncryptionKeyResponseDto> {
    const response = await this.circleConnector.getPCIPublicKey()
    return { keyId: response['keyId'], publicKey: response['publicKey'] }
  }

  /**
   * create usable credit card using circle api
   *
   * @param userid
   * @param createCardDto
   * @param fourDigits last 4 digits of credit card to save
   * @returns
   */
  async createCircleCard(
    ip: string,
    userId: string,
    createCardDto: CircleCreateCardDto,
    cardNumber: string,
  ): Promise<CircleStatusResponseDto> {
    if (
      await this.dbReader(CircleCardEntity.table)
        .where(
          CircleCardEntity.toDict<CircleCardEntity>({
            idempotencyKey: createCardDto.idempotencyKey,
          }),
        )
        .select('id')
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbReader
      .table(CircleCardEntity.table)
      .whereNull('deleted_at')
      .andWhere('user_id', userId)
      .count()
    if (count[0]['count(*)'] >= MAX_CARDS_PER_USER) {
      throw new BadRequestException(`${MAX_CARDS_PER_USER} card limit reached`)
    }

    createCardDto.metadata.email = (
      await this.dbReader(UserEntity.table)
        .where('id', userId)
        .select('email')
        .first()
    ).email
    createCardDto.metadata.ipAddress = ip
    const response = await this.circleConnector.createCard(createCardDto)

    const data = CircleCardEntity.toDict<CircleCardEntity>({
      id: v4(),
      user: userId,
      cardNumber,
      circleId: response['id'],
      status: response['status'],
      name: createCardDto.billingDetails.name,
      ...createCardDto,
    })

    await this.dbWriter(CircleCardEntity.table).insert(data)

    return { id: data.id, circleId: response['id'], status: response['status'] }
  }

  /**
   * delete existing card
   *
   * @param id
   * @returns
   */
  async deleteCircleCard(userId: string, cardId: string): Promise<void> {
    await this.dbWriter(CircleCardEntity.table)
      .update('deleted_at', this.dbWriter.fn.now())
      .where(
        CircleCardEntity.toDict<CircleCardEntity>({ user: userId, id: cardId }),
      )
  }

  /**
   * get all undeleted cards
   *
   * @param userid
   * @returns
   */
  async getCircleCards(userId: string): Promise<Array<CircleCardDto>> {
    return (
      await this.dbReader(CircleCardEntity.table)
        .select('*')
        .where(
          CircleCardEntity.toDict<CircleCardEntity>({
            user: userId,
          }),
        )
        .whereNull('deleted_at')
    ).map((card) => new CircleCardDto(card))
  }

  /**
   * get all undeleted cards
   *
   * @param userid
   * @returns
   */
  async getCircleCard(userId: string, cardId: string): Promise<CircleCardDto> {
    return new CircleCardDto(
      await this.dbReader(CircleCardEntity.table)
        .select('*')
        .where(
          CircleCardEntity.toDict<CircleCardEntity>({
            user: userId,
            id: cardId,
          }),
        )
        .whereNull('deleted_at'),
    )
  }

  /**
   * create a card payment with a saved card
   *
   * @param ipAddress
   * @param sessionId
   * @param payin
   * @returns
   */
  async makeCircleCardPayment(
    ipAddress: string,
    sessionId: string,
    payin: PayinDto,
  ): Promise<CircleStatusResponseDto> {
    const card = await this.dbReader(CircleCardEntity.table)
      .where('id', payin.payinMethod.cardId)
      .select('id', 'circle_id')
      .first()

    // save metadata into subscription for repeat purchases
    if (card.target) {
      await this.dbWriter(SubscriptionEntity.table)
        .where('target', card.target)
        .update(
          SubscriptionEntity.toDict<SubscriptionEntity>({
            ipAddress,
            sessionId,
          }),
        )
    }

    const createCardPaymentDto: CircleCreateCardPaymentRequestDto = {
      idempotencyKey: v4(),
      amount: {
        amount: payin.amount.toFixed(2),
        currency: 'USD',
      },
      source: {
        id: card.circle_id,
        type: 'card',
      },
      metadata: {
        ipAddress,
        email: (
          await this.dbReader(UserEntity.table)
            .where('id', payin.userId)
            .select('email')
            .first()
        ).email,
        sessionId: sessionId,
      },
      verification: 'none',
    }

    const data = CirclePaymentEntity.toDict<CirclePaymentEntity>({
      id: v4(),
      card: card.id,
      payin: payin.id,
      idempotencyKey: createCardPaymentDto.idempotencyKey,
      amount: createCardPaymentDto.amount.amount,
      verification: CircleCardVerificationEnum.NONE,
      status: CirclePaymentStatusEnum.UNKOWN,
    })
    await this.dbWriter(CirclePaymentEntity.table).insert(data)

    const response = await this.circleConnector.createPayment(
      createCardPaymentDto,
    )

    await this.dbWriter(CirclePaymentEntity.table)
      .update(
        CirclePaymentEntity.toDict<CirclePaymentEntity>({
          circleId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return {
      id: data.id,
      circleId: response['id'],
      status: response['status'],
    }
  }

  /**
   * get new depositable blockchain address from circle
   * addresses are unique per (chain, currency) pair
   *
   * @param currency
   * @param chain
   * @returns
   */
  async getCircleAddress(currency: string, chain: string): Promise<string> {
    const idempotencyKey = v4()
    const response = await this.circleConnector.createAddress(
      this.circleMasterWallet,
      { idempotencyKey, currency, chain },
    )
    return response['address']
  }

  /**
   * add wire bank accounts (for creators)
   * @param userid
   * @param createBankDto
   * @returns
   */
  async createCircleBank(
    userId: string,
    createBankDto: CircleCreateBankRequestDto,
  ): Promise<CircleStatusResponseDto> {
    if (
      await this.dbReader(CircleBankEntity.table)
        .where(
          CircleBankEntity.toDict<CircleBankEntity>({
            idempotencyKey: createBankDto.idempotencyKey,
          }),
        )
        .select('id')
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbReader
      .table(CircleBankEntity.table)
      .whereNull('deleted_at')
      .andWhere('user_id', userId)
      .count()
    if (count[0]['count(*)'] >= MAX_BANKS_PER_USER) {
      throw new BadRequestException(`${MAX_BANKS_PER_USER} bank limit reached`)
    }

    const response = await this.circleConnector.createBank(createBankDto)
    const data = CircleBankEntity.toDict<CircleBankEntity>({
      id: v4(),
      user: userId,
      status: response['status'],
      description: response['description'],
      trackingRef: response['trackingRef'],
      fingerprint: response['fingerprint'],
      circleId: response['id'],
      idempotencyKey: createBankDto.idempotencyKey,
      country: createBankDto.billingDetails.country,
    })
    await this.dbWriter(CircleBankEntity.table).insert(data)

    return {
      id: data.id,
      circleId: response['id'],
      status: response['status'],
    }
  }

  /**
   * delete a creator's bank
   *
   * @param userId
   * @param circleBankId
   */
  async deleteCircleBank(userId: string, circleBankId: string): Promise<void> {
    await this.dbWriter(CircleBankEntity.table)
      .update('deleted_at', this.dbWriter.fn.now())
      .where(
        CircleBankEntity.toDict<CircleBankEntity>({
          user: userId,
          id: circleBankId,
        }),
      )
  }

  /**
   * get all of a creator's banks
   * @param userId
   * @returns
   */
  async getCircleBanks(userId: string): Promise<Array<CircleBankDto>> {
    return (
      await this.dbReader(CircleBankEntity.table)
        .select('*')
        .where(
          CircleBankEntity.toDict<CircleBankEntity>({
            user: userId,
          }),
        )
        .whereNull('deleted_at')
    ).map((bank) => new CircleBankDto(bank))
  }

  /**
   * create bank payout to creator
   *
   * @param userId
   * @param payout
   * @returns
   */
  async makeCircleWirePayout(
    userId: string,
    payout: PayoutDto,
  ): Promise<CircleStatusResponseDto> {
    const bank = await this.dbReader(CircleBankEntity.table)
      .where({
        id: payout.payoutMethod.bankId,
        user_id: userId,
      })
      .select('id', 'circle_id')
      .first()

    const user = await this.dbReader(UserEntity.table)
      .where({
        id: userId,
      })
      .select('email')
      .first()

    const createPayoutDto: CircleCreatePayoutRequestDto = {
      idempotencyKey: v4(),
      source: {
        type: 'wallet',
        id: this.circleMasterWallet,
      },
      destination: {
        type: 'wire',
        id: bank.circle_id,
      },
      amount: {
        amount: payout.amount.toFixed(2),
        currency: 'USD',
      },
      metadata: {
        beneficiaryEmail: user.email,
      },
    }

    const data = CirclePayoutEntity.toDict<CirclePayoutEntity>({
      id: v4(),
      bank: bank.id,
      payout: payout.id,
      idempotencyKey: createPayoutDto.idempotencyKey,
      amount: createPayoutDto.amount.amount,
      status: CircleAccountStatusEnum.PENDING,
    })
    await this.dbWriter(CirclePayoutEntity.table).insert(data)
    const response = await this.circleConnector.createPayout(createPayoutDto)

    await this.dbWriter(CirclePayoutEntity.table)
      .update(
        CirclePayoutEntity.toDict<CirclePayoutEntity>({
          circleId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return {
      id: data.id,
      circleId: response['id'],
      status: response['status'],
    }
  }

  /**
   * make blockchain payout to creator
   *
   * @param userId
   * @param payout
   * @returns
   */
  async makeCircleBlockchainTransfer(
    userId: string,
    payout: PayoutDto,
  ): Promise<CircleStatusResponseDto> {
    const wallet = await this.dbReader(WalletEntity.table)
      .where('id', payout.payoutMethod.walletId)
      .andWhere('user_id', userId)
      .select('*')
      .first()

    const createTransferDto: CircleCreateTransferRequestDto = {
      idempotencyKey: v4(),
      source: {
        type: 'wallet',
        id: this.circleMasterWallet,
        identities: [
          {
            type: 'business',
            name: 'Passes Inc',
            addresses: [
              {
                line1: '100 Money Street', // TODO: USE OUR REAL NEW MIAMI ADDRESS
                city: 'Boston',
                district: 'MA',
                country: 'US',
                postalCode: '01234',
              },
            ],
          },
        ],
      },
      destination: {
        type: 'blockchain',
        address: wallet.address,
        chain: wallet.chain.toUpperCase(),
      },
      amount: {
        amount: payout.amount.toFixed(2),
        currency: 'USD',
      },
    }

    const data = CircleTransferEntity.toDict<CircleTransferEntity>({
      id: v4(),
      payout: payout.id,
      idempotencyKey: createTransferDto.idempotencyKey,
      amount: createTransferDto.amount.amount,
      currency: createTransferDto.amount.currency,
      status: CircleAccountStatusEnum.PENDING,
    })
    await this.dbWriter(CircleTransferEntity.table).insert(data)

    const response = await this.circleConnector.createTransfer(
      createTransferDto,
    )

    await this.dbWriter(CircleTransferEntity.table)
      .update(
        CircleTransferEntity.toDict<CircleTransferEntity>({
          circleId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return {
      id: data.id,
      circleId: response['id'],
      status: response['status'],
    }
  }

  /*
  -------------------------------------------------------------------------------
  Notifications
  -------------------------------------------------------------------------------
  */

  async processCircleUpdate(update: CircleNotificationDto): Promise<void> {
    //log new notification in DB
    const id = v4()
    await this.dbWriter(CircleNotificationEntity.table).insert(
      CircleNotificationEntity.toDict<CircleNotificationEntity>({
        id,
        clientId: update.clientId,
        notificationType: update.notificationType,
        fullContent: JSON.stringify(update),
      }),
    )

    //update information with notification
    try {
      switch (update.notificationType as CircleNotificationTypeEnum) {
        case CircleNotificationTypeEnum.PAYMENTS:
          if (update.payment) {
            await this.processCirclePaymentUpdate(update.payment)
          } else if (update.reversal) {
            //currently unhandled
          } else if (update.chargeback) {
            //currently unhandled
          }
          break
        case CircleNotificationTypeEnum.SETTLEMENTS:
          //currently unhandled
          break
        case CircleNotificationTypeEnum.PAYOUTS:
          if (update.payout) {
            await this.processCirclePayoutUpdate(update.payout)
          } else if (update.return) {
            //currently unhandled
          }
          break
        case CircleNotificationTypeEnum.CARDS:
          await this.processCircleCardUpdate(
            update.card as GenericCircleObjectWrapper,
          )
          break
        case CircleNotificationTypeEnum.ACH:
          //currently unhandled
          break
        case CircleNotificationTypeEnum.WIRE:
          await this.processCircleWireUpdate(
            update.wire as GenericCircleObjectWrapper,
          )
          break
        case CircleNotificationTypeEnum.TRANSFERS:
          await this.processCircleTransferUpdate(
            update.transfer as CircleTransferDto,
          )
          break
        default:
          throw new CircleResponseError(
            "notification type unrecognized: API might've updated",
          )
      }
      await this.dbWriter(CircleNotificationEntity.table)
        .update(
          CircleNotificationEntity.toDict<CircleNotificationEntity>({
            processed: true,
          }),
        )
        .where({ id })
    } catch (e) {
      await this.dbWriter(CircleNotificationEntity.table)
        .update(
          CircleNotificationEntity.toDict<CircleNotificationEntity>({
            processed: false,
          }),
        )
        .where({ id })
      this.logger.error(`Error processing notification ${id}`, e)
    }
  }

  /**
   * process updates for wire bank status
   * @param wire
   */
  async processCircleWireUpdate(
    wireDto: GenericCircleObjectWrapper,
  ): Promise<void> {
    await this.dbWriter(CircleBankEntity.table)
      .update(
        CircleBankEntity.toDict<CircleBankEntity>({
          status: wireDto.status as CircleAccountStatusEnum,
        }),
      )
      .where(
        CircleBankEntity.toDict<CircleBankEntity>({ circleId: wireDto.id }),
      )
  }

  /**
   * process updates for card status
   * @param card
   */
  async processCircleCardUpdate(
    cardDto: GenericCircleObjectWrapper,
  ): Promise<void> {
    await this.dbWriter(CircleCardEntity.table)
      .update(
        CircleCardEntity.toDict<CircleCardEntity>({
          status: cardDto.status as CircleAccountStatusEnum,
        }),
      )
      .where(
        CircleCardEntity.toDict<CircleCardEntity>({ circleId: cardDto.id }),
      )
  }

  /**
   * process updates for fiat payins
   * @param paymentDto
   */
  async processCirclePaymentUpdate(
    paymentDto: CirclePaymentDto,
  ): Promise<void> {
    const payin = await this.dbWriter(PayinEntity.table)
      .join(
        CirclePaymentEntity.table,
        PayinEntity.table + '.id',
        CirclePaymentEntity.table + '.payin_id',
      )
      .select(PayinEntity.table + '.id as id', PayinEntity.table + '.user_id')
      .where('circle_id', paymentDto.id)
      .first()

    if (!payin) {
      throw new CircleNotificationError('notification for unrecorded payin')
    }

    await this.dbWriter(CirclePaymentEntity.table)
      .where('circle_id', paymentDto.id)
      .update({ status: paymentDto.status })

    switch (paymentDto.status) {
      case CirclePaymentStatusEnum.PENDING:
        await this.dbWriter
          .table(PayinEntity.table)
          .update(
            PayinEntity.toDict<PayinEntity>({
              payinStatus: PayinStatusEnum.PENDING,
            }),
          )
          .where({ id: payin.id })
        break
      case CirclePaymentStatusEnum.CONFIRMED:
      case CirclePaymentStatusEnum.PAID:
        await this.completePayin(payin.id, payin.user_id)
        break
      case CirclePaymentStatusEnum.FAILED:
        await this.failPayin(payin.id, payin.user_id)
        break
      case CirclePaymentStatusEnum.ACTION_REQUIRED:
        await this.dbWriter
          .table(PayinEntity.table)
          .update(
            PayinEntity.toDict<PayinEntity>({
              payinStatus: PayinStatusEnum.ACTION_REQUIRED,
            }),
          )
          .where({ id: payin.id })
        break
    }
  }

  /**
   * process updates for fiat payouts
   * @param payoutDto
   */
  async processCirclePayoutUpdate(payoutDto: any): Promise<void> {
    const payout = await this.dbReader(PayoutEntity.table)
      .join(
        CirclePayoutEntity.table,
        PayoutEntity.table + '.id',
        CirclePayoutEntity.table + '.payout_id',
      )
      .select(PayoutEntity.table + '.id as id', PayoutEntity.table + '.user_id')
      .where('circle_id', payoutDto.id)
      .first()

    if (!payout) {
      throw new CircleNotificationError('notification for unrecorded payout')
    }

    await this.dbWriter(CirclePayoutEntity.table)
      .where('circle_id', payoutDto.id)
      .update({ status: payoutDto.status, fee: payoutDto.fees.amount })

    switch (payoutDto.status) {
      case CircleAccountStatusEnum.PENDING:
        await this.dbWriter
          .table(PayoutEntity.table)
          .update(
            PayoutEntity.toDict<PayoutEntity>({
              payoutStatus: PayoutStatusEnum.PENDING,
            }),
          )
          .where({ id: payout.id })
        break
      case CircleAccountStatusEnum.COMPLETE:
        await this.completePayout(payout.id, payout.user_id)
        break
      case CircleAccountStatusEnum.FAILED:
        await this.failPayout(payout.id, payout.user_id)
        break
    }
  }

  /**
   * process updates for all blockchain transfers
   * @param transferDto
   */
  async processCircleTransferUpdate(
    transferDto: CircleTransferDto,
  ): Promise<void> {
    if (
      transferDto.source.type === 'blockchain' &&
      transferDto.destination.type === 'wallet'
    ) {
      await this.processCircleIncomingTransferUpdate(transferDto)
    } else if (
      transferDto.source.type === 'wallet' &&
      transferDto.destination.type === 'blockchain'
    ) {
      await this.processCircleOutgoingTransferUpdate(transferDto)
    } else if (
      transferDto.source.type === 'wallet' &&
      transferDto.destination.type === 'wallet'
    ) {
      throw new CircleNotificationError(
        'unsupported wallet to wallet transactions ',
      )
    } else {
      throw new CircleNotificationError('unkown transfer event')
    }
  }

  /**
   * process updates for blockchain payin from users
   * @param transferDto
   */
  async processCircleIncomingTransferUpdate(
    transferDto: CircleTransferDto,
  ): Promise<void> {
    let method
    let chainId
    if (transferDto.source.chain === 'SOL') {
      method = PayinMethodEnum.PHANTOM_CIRCLE_USDC
    } else {
      chainId =
        this.EVM_MAP[this.getBlockchainSelector()][transferDto.source.chain]
      if (
        transferDto.source.chain === 'ETH' &&
        transferDto.amount.currency === 'ETH'
      ) {
        method = PayinMethodEnum.METAMASK_CIRCLE_ETH
      } else {
        method = PayinMethodEnum.METAMASK_CIRCLE_USDC
      }
    }
    let query = this.dbWriter(PayinEntity.table).select('id', 'user_id').where({
      address: transferDto.destination.address,
      payin_method: method,
    })
    if (chainId !== undefined) {
      query = query.where('chain_id', chainId)
    }
    const payin = await query.first()
    await this.dbWriter(PayinEntity.table)
      .update({ transaction_hash: transferDto.transactionHash })
      .where('id', payin.id)
    switch (transferDto.status) {
      case CircleTransferStatusEnum.PENDING:
        await this.dbWriter
          .table(PayinEntity.table)
          .update(
            PayinEntity.toDict<PayinEntity>({
              payinStatus: PayinStatusEnum.PENDING,
            }),
          )
          .where({ id: payin.id })
        break
      case CircleTransferStatusEnum.COMPLETE:
        await this.completePayin(payin.id, payin.user_id)
        break
      case CircleTransferStatusEnum.FAILED:
        await this.failPayin(payin.id, payin.user_id)
        break
    }
  }

  /**
   * process uddates for blockchain payouts to creators
   * @param transferDto
   */
  async processCircleOutgoingTransferUpdate(
    transferDto: CircleTransferDto,
  ): Promise<void> {
    const circleTransfer = await this.dbReader(CircleTransferEntity.table)
      .where('circle_id', transferDto.id)
      .select('payout_id')
      .first()
    const payout = await this.dbReader(PayoutEntity.table)
      .where('id', circleTransfer.payout_id)
      .select('*')
      .first()

    if (transferDto.transactionHash) {
      await this.dbWriter(PayoutEntity.table)
        .where('id', payout.id)
        .update({ transaction_hash: transferDto.transactionHash })
    }

    await this.dbWriter(CircleTransferEntity.table)
      .where('id', transferDto.id)
      .update('status', transferDto.status)

    switch (transferDto.status) {
      case CircleTransferStatusEnum.PENDING:
        await this.dbWriter
          .table(PayoutEntity.table)
          .update(
            PayoutEntity.toDict<PayoutEntity>({
              payoutStatus: PayoutStatusEnum.PENDING,
            }),
          )
          .where({ id: payout.id })
        break
      case CircleTransferStatusEnum.COMPLETE:
        await this.completePayout(payout.id, payout.user_id)
        break
      case CircleTransferStatusEnum.FAILED:
        await this.failPayout(payout.id, payout.user_id)
        break
    }
  }
  /*
  -------------------------------------------------------------------------------
  PAYIN ENTRYPOINTS (one for each PayinMethodEnum)
  -------------------------------------------------------------------------------
  */

  /**
   * Step 2 of payin process
   * Called externally from FE pay-button
   *
   * @param userId
   * @param entryDto
   * @returns
   */
  async payinEntryHandler(
    userId: string,
    entryDto: PayinEntryRequestDto,
  ): Promise<PayinEntryResponseDto> {
    const payin = await this.dbReader(PayinEntity.table)
      .select('*')
      .where(
        PayinEntity.toDict<PayinEntity>({
          id: entryDto.payinId,
          user: userId,
          payinStatus: PayinStatusEnum.REGISTERED,
        }),
      )
      .first()
    if (!payin) {
      throw new InvalidPayinStatusError(
        'payin ' + entryDto.payinId + ' is not available for entry',
      )
    }
    const payinDto = new PayinDto(payin)
    let entryResponseDto: PayinEntryResponseDto
    try {
      switch (payinDto.payinMethod.method) {
        case PayinMethodEnum.CIRCLE_CARD:
          entryResponseDto = await this.entryCircleCard(
            payinDto,
            entryDto as CircleCardPayinEntryRequestDto,
          )
          break
        case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
          entryResponseDto = await this.entryPhantomCircleUSDC(payinDto)
          break
        case PayinMethodEnum.METAMASK_CIRCLE_USDC:
          entryResponseDto = await this.entryMetamaskCircleUSDC(payinDto)
          break
        case PayinMethodEnum.METAMASK_CIRCLE_ETH:
          entryResponseDto = await this.entryMetamaskCircleETH(payinDto)
          break
        default:
          throw new NoPayinMethodError('entrypoint hit with no method')
      }

      await this.dbWriter(PayinEntity.table)
        .update({ payin_status: PayinStatusEnum.CREATED })
        .where({ id: entryDto.payinId })
    } catch (e) {
      await this.unregisterPayin(payinDto.id, userId)
      throw e
    }

    await handleCreationCallback(payin, this, this.dbWriter)
    return entryResponseDto
  }

  async entryCircleCard(
    payin: PayinDto,
    entryDto: CircleCardPayinEntryRequestDto,
  ): Promise<CircleCardPayinEntryResponseDto> {
    const status = await this.makeCircleCardPayment(
      entryDto.ip,
      entryDto.sessionId,
      payin,
    )
    return { payinId: payin.id, status }
  }

  async entryPhantomCircleUSDC(
    payin: PayinDto,
  ): Promise<PhantomCircleUSDCEntryResponseDto> {
    const tokenAddress: string = SOL_ACCOUNT[this.getBlockchainSelector()].USDC
    const networkUrl: string = SOL_NETWORK[this.getBlockchainSelector()]
    const depositAddress = await this.getCircleAddress('USD', 'SOL')
    await this.linkAddressToPayin(depositAddress, payin.id)
    return {
      payinId: payin.id,
      tokenAddress,
      depositAddress,
      networkUrl,
    }
  }

  async entryMetamaskCircleUSDC(
    payin: PayinDto,
  ): Promise<MetamaskCircleUSDCEntryResponseDto> {
    const chainId = payin.payinMethod.chainId as number
    const tokenAddress = EVM_ADDRESS[chainId].USDC
    const depositAddress = await this.getCircleAddress('USD', 'ETH')
    await this.linkAddressToPayin(depositAddress, payin.id)
    return {
      payinId: payin.id,
      chainId,
      tokenAddress,
      depositAddress,
    }
  }

  async entryMetamaskCircleETH(
    payin: PayinDto,
  ): Promise<MetamaskCircleETHEntryResponseDto> {
    const chainId = payin.payinMethod.chainId as number
    const depositAddress = await this.getCircleAddress('ETH', 'ETH')
    await this.linkAddressToPayin(depositAddress, payin.id)
    return { payinId: payin.id, depositAddress, chainId }
  }

  /*
  -------------------------------------------------------------------------------
  CRYPTO
  -------------------------------------------------------------------------------
  */

  async linkAddressToPayin(address: string, payinId: string): Promise<void> {
    await this.dbWriter(PayinEntity.table)
      .update({ address })
      .where({ id: payinId })
  }

  EVM_MAP = {
    mainnet: {
      ETH: 1,
      MATIC: 137,
      AVAX: 43114,
    },
    testnet: {
      ETH: 5,
      MATIC: 80001,
      AVAX: 43113,
    },
  }

  EVM_USDC_CHAINIDS = {
    mainnet: [1, 137, 43114],
    testnet: [5, 80001, 43113],
  }

  EVM_NATIVE_CHAINIDS = {
    mainnet: [1],
    testnet: [5],
  }

  VALID_PAYOUT_CHAINS = ['ETH', 'SOL', 'MATIC', 'AVAX']

  getBlockchainSelector() {
    return this.configService.get('blockchain.networks') as string
  }

  getEvmChainId(chain: ChainEnum) {
    return this.EVM_MAP[this.getBlockchainSelector()][chain.toUpperCase()]
  }

  getEvmChainIdsUSDC(): number[] {
    return this.EVM_USDC_CHAINIDS[this.getBlockchainSelector()]
  }

  getEvmChainIdsNative(): number[] {
    return this.EVM_NATIVE_CHAINIDS[this.getBlockchainSelector()]
  }

  /*
  -------------------------------------------------------------------------------
  Payment Methods Get/Set
  -------------------------------------------------------------------------------
  */

  /**
   * set default payin method
   * @param userId
   * @param method
   * @param cardId
   * @param chainId
   */
  async setDefaultPayinMethod(
    userId: string,
    payinMethoDto: PayinMethodDto,
  ): Promise<void> {
    // find mainnet or testnet chainId
    if (!payinMethoDto.chainId && payinMethoDto.chain) {
      payinMethoDto.chainId = this.getEvmChainId(payinMethoDto.chain)
    }

    await this.dbWriter(DefaultPayinMethodEntity.table)
      .insert(
        DefaultPayinMethodEntity.toDict<DefaultPayinMethodEntity>({
          user: userId,
          method: payinMethoDto.method,
          card: payinMethoDto.cardId,
          chainId: payinMethoDto.chainId,
        }),
      )
      .onConflict('user_id')
      .merge(['method', 'card_id', 'chain_id'])
  }

  /**
   * return default payin option of user if exists and valid
   * @param userId
   * @returns
   */
  async getDefaultPayinMethod(userId: string): Promise<PayinMethodDto> {
    const defaultPayinMethod = await this.dbReader(
      DefaultPayinMethodEntity.table,
    )
      .where('user_id', userId)
      .select('*')
      .first()

    if (!defaultPayinMethod) {
      return { method: PayinMethodEnum.NONE }
    }
    const dto = new PayinMethodDto(defaultPayinMethod)
    if (!(await this.validatePayinMethod(userId, dto))) {
      return { method: PayinMethodEnum.NONE }
    }
    return dto
  }

  async validatePayinMethod(
    userId: string,
    payinMethodDto: PayinMethodDto,
  ): Promise<boolean> {
    switch (payinMethodDto.method) {
      case PayinMethodEnum.CIRCLE_CARD:
        // assert that card exists and is not deleted
        return (
          (await this.dbReader(CircleCardEntity.table)
            .where(
              CircleCardEntity.toDict<CircleCardEntity>({
                user: userId,
                id: payinMethodDto.cardId,
                status: CircleAccountStatusEnum.COMPLETE,
              }),
            )
            .whereNull('deleted_at')
            .select('id')
            .first()) !== undefined
        )
      case PayinMethodEnum.METAMASK_CIRCLE_USDC:
        // metamask payin must be on an approved chainId
        return this.getEvmChainIdsUSDC().includes(
          payinMethodDto.chainId as number,
        )
      case PayinMethodEnum.METAMASK_CIRCLE_ETH:
        // metamask payin must be on an approved chainId
        return this.getEvmChainIdsNative().includes(
          payinMethodDto.chainId as number,
        )
      case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
        return true
      default:
        return false
    }
  }

  /**
   * set default payin method
   * @param userId
   * @param method
   * @param cardId
   * @param chainId
   */
  async setDefaultPayoutMethod(
    userId: string,
    payoutMethodDto: PayoutMethodDto,
  ): Promise<void> {
    await this.dbWriter(DefaultPayoutMethodEntity.table)
      .insert(
        DefaultPayoutMethodEntity.toDict<DefaultPayoutMethodEntity>({
          user: userId,
          method: payoutMethodDto.method,
          bank: payoutMethodDto.bankId,
          wallet: payoutMethodDto.walletId,
        }),
      )
      .onConflict('user_id')
      .merge(['method', 'bank_id', 'wallet_id'])
  }

  /**
   * return default payin option of user if exists and valid
   * @param userId
   * @returns
   */
  async getDefaultPayoutMethod(userId: string): Promise<PayoutMethodDto> {
    const defaultPayoutMethod = await this.dbReader(
      DefaultPayoutMethodEntity.table,
    )
      .where('user_id', userId)
      .select('*')
      .first()

    if (!defaultPayoutMethod) {
      return { method: PayoutMethodEnum.NONE }
    }

    const dto = new PayoutMethodDto(defaultPayoutMethod)
    if (!this.validatePayoutMethod(userId, dto)) {
      return { method: PayoutMethodEnum.NONE }
    }

    return dto
  }

  async validatePayoutMethod(
    userId: string,
    payoutMethodDto: PayoutMethodDto,
  ): Promise<boolean> {
    switch (payoutMethodDto.method) {
      case PayoutMethodEnum.CIRCLE_WIRE:
        // assert that bank exists and is not deleted
        return (
          (await this.dbReader(CircleBankEntity.table)
            .where(
              CircleBankEntity.toDict<CircleBankEntity>({
                user: userId,
                id: payoutMethodDto.bankId,
              }),
            )
            .whereNull('deleted_at')
            .select('id')
            .first()) !== undefined
        )
      case PayoutMethodEnum.CIRCLE_USDC:
        return (
          (await this.dbReader(WalletEntity.table)
            .where(
              WalletEntity.toDict<WalletEntity>({
                user: userId,
                id: payoutMethodDto.walletId,
              }),
            )
            .select('id')
            .first()) !== undefined
        )
      default:
        return false
    }
  }

  /*
  -------------------------------------------------------------------------------
  Payin
  -------------------------------------------------------------------------------
  */

  /**
   * Step 1 of payin process
   * Called INTERNALLY from other services
   *
   * @param request
   * @returns
   */
  async registerPayin(
    request: RegisterPayinRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    // create and save a payin with REGISTERED status

    // validating request information
    if (request.amount <= 0 || (request.amount * 100) % 1 !== 0) {
      throw new InvalidPayinRequestError(
        'invalid amount value ' + request.amount,
      )
    }

    const payinMethod =
      request.payinMethod !== undefined
        ? request.payinMethod
        : await this.getDefaultPayinMethod(request.userId)
    if (!(await this.validatePayinMethod(request.userId, payinMethod))) {
      throw new InvalidPayinRequestError('invalid payin method')
    }

    const data = PayinEntity.toDict<PayinEntity>({
      id: v4(),
      user: request.userId,
      payinMethod: payinMethod.method,
      card: payinMethod.cardId,
      chainId: payinMethod.chainId,
      payinStatus: PayinStatusEnum.REGISTERED,
      callback: request.callback,
      callbackInputJSON: JSON.stringify(request.callbackInputJSON),
      amount: request.amount,
      target: request.target,
    })

    await this.dbWriter(PayinEntity.table).insert(data)

    // create creator share of payment
    try {
      await this.createCreatorShare(
        request.creatorId,
        request.amount,
        payinMethod,
        data.id,
      )
    } catch (e) {
      await this.unregisterPayin(data.id, request.userId)
      throw e
    }

    return {
      payinId: data.id,
      payinMethod,
      amount: request.amount,
    }
  }

  async createCreatorShare(
    creatorId: string,
    amount: number,
    payinMethod: PayinMethodDto,
    payinId: string,
  ) {
    const creator = await this.dbReader(UserEntity.table)
      .leftJoin(
        CreatorFeeEntity.table,
        `${UserEntity.table}.id`,
        `${CreatorFeeEntity.table}.creator_id`,
      )
      .where(`${UserEntity.table}.id`, creatorId)
      .select([
        `${UserEntity.table}.id`,
        'is_creator',
        'fiat_rate',
        'fiat_flat',
        'crypto_rate',
        'crypto_flat',
      ])
      .first()

    if (!creator.is_creator) {
      throw new InvalidPayinRequestError('regular users can not earn money')
    }
    let shareAmount = amount

    // calculate creator share of payin
    if (payinMethod.method === PayinMethodEnum.CIRCLE_CARD) {
      if (creator.fiat_rate && creator.fiat_flat) {
        shareAmount = shareAmount * (1 - creator.fiat_rate) - creator.flat
      } else {
        shareAmount =
          shareAmount * (1 - DEFAULT_FIAT_FEE_RATE) - DEFAULT_FIAT_FEE_FLAT
      }
    } else {
      if (creator.crypto_rate && creator.crypto_flat) {
        shareAmount =
          shareAmount * (1 - creator.crypto_rate) - creator.crypto_flat
      } else {
        shareAmount =
          shareAmount * (1 - DEFAULT_CRYPTO_FEE_RATE) - DEFAULT_CRYPTO_FEE_FLAT
      }
    }

    // can't get a negative amount of money
    shareAmount = Math.max(shareAmount, 0)
    // round to cents
    shareAmount = Math.round(shareAmount * 100) / 100

    await this.dbWriter(CreatorShareEntity.table).insert(
      CreatorShareEntity.toDict<CreatorShareEntity>({
        creator: creatorId,
        amount: shareAmount,
        payin: payinId,
      }),
    )
  }

  async setCreatorFee(creatorFeeDto: CreatorFeeDto) {
    await this.dbWriter(CreatorFeeEntity.table)
      .insert(
        CreatorFeeEntity.toDict<CreatorFeeEntity>({
          creator: creatorFeeDto.creatorId,
          fiatRate: creatorFeeDto.fiatFlat,
          fiatFlat: creatorFeeDto.fiatFlat,
          cryptoRate: creatorFeeDto.cryptoRate,
          cryptoFlat: creatorFeeDto.cryptoFlat,
        }),
      )
      .onConflict('creator_id')
      .merge(['fiat_rate', 'fiat_flat', 'crypto_rate', 'crypto_flat'])
  }

  async getCreatorFee(creatorId: string) {
    return new CreatorFeeDto(
      await this.dbReader(CreatorFeeEntity.table)
        .where('creator_id', creatorId)
        .select('*')
        .first(),
    )
  }

  async updateInputJSON(payinId: string, json: any) {
    await this.dbWriter(PayinEntity.table)
      .where('id', payinId)
      .update(
        PayinEntity.toDict<PayinEntity>({
          callbackInputJSON: JSON.stringify(json),
        }),
      )
  }

  async userCancelPayin(payinId: string, userId: string): Promise<void> {
    // attempt to unregister or fail
    // only one update will succeed since it updates based on current state
    await this.unregisterPayin(payinId, userId)
    await this.failPayin(payinId, userId)
  }

  async unregisterPayin(payinId: string, userId: string): Promise<void> {
    await this.dbWriter
      .table(PayinEntity.table)
      .where('id', payinId)
      .andWhere('user_id', userId)
      .andWhere('payin_status', PayinStatusEnum.REGISTERED)
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.UNREGISTERED,
        }),
      )
  }

  async failPayin(payinId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter
      .table(PayinEntity.table)
      .where('id', payinId)
      .andWhere('user_id', userId)
      .andWhere('payin_status', 'in', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.FAILED,
        }),
      )
    // check for completed update
    if (rows == 1) {
      const payin = await this.dbReader(PayinEntity.table)
        .where('id', payinId)
        .andWhere('user_id', userId)
        .select(
          ...PayinEntity.populate<PayinEntity>([
            'id',
            'callback',
            'callbackInputJSON',
          ]),
        )
        .first()
      await handleFailedCallback(payin, this, this.dbReader)
    }
  }

  async completePayin(payinId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter
      .table(PayinEntity.table)
      .where('id', payinId)
      .andWhere('user_id', userId)
      .andWhere('payin_status', 'in', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.SUCCESSFUL,
        }),
      )
    // check for completed update
    if (rows == 1) {
      const payin = await this.dbReader(PayinEntity.table)
        .where('id', payinId)
        .andWhere('user_id', userId)
        .select(
          ...PayinEntity.populate<PayinEntity>([
            'id',
            'callback',
            'callbackInputJSON',
            'amount',
            'payinMethod',
          ]),
        )
        .first()
      await handleSuccesfulCallback(payin, this, this.dbWriter)
      const creatorShares = await this.dbReader
        .table(CreatorShareEntity.table)
        .where('payin_id', payin.id)
        .select('*')

      await Promise.all(
        creatorShares.map(
          async (creatorShare) =>
            await this.creatorStatsService.handlePayin(
              creatorShare.creator_id,
              payin.callback,
              creatorShare.amount,
            ),
        ),
      )
    }
  }

  /**
   * return paginated payin information for user display
   *
   * @param userId
   * @param getPayinsRequest
   * @returns
   */
  async getPayins(
    userId: string,
    getPayinsRequest: GetPayinsRequestDto,
  ): Promise<GetPayinsResponseDto> {
    const payins = await this.dbReader
      .table(PayinEntity.table)
      .where('user_id', userId)
      .andWhere('payin_status', 'not in', [
        PayinStatusEnum.REGISTERED,
        PayinStatusEnum.UNREGISTERED,
      ])
      .select('*')
      .orderBy('created_at', 'desc')
      .offset(getPayinsRequest.offset)
      .limit(getPayinsRequest.limit)
    const count = await this.dbReader
      .table(PayinEntity.table)
      .where('user_id', userId)
      .andWhere('payin_status', 'not in', [
        PayinStatusEnum.REGISTERED,
        PayinStatusEnum.UNREGISTERED,
      ])
      .count()

    const cards = await this.dbReader
      .table(CircleCardEntity.table)
      .where(
        'id',
        'in',
        payins.map((payin) => payin.card_id),
      )
      .select('*')
    const cardsMap = cards.reduce((map, card) => {
      map[card.id] = new CircleCardDto(card)
      return map
    }, {})

    const payinsDto = payins.map((payin) => {
      return new PayinDto(payin)
    })
    payinsDto.forEach((payinDto) => {
      if (payinDto.payinMethod.method === PayinMethodEnum.CIRCLE_CARD) {
        payinDto.card = cardsMap[payinDto.payinMethod.cardId as string]
      }
    })
    return {
      count: parseInt(count[0]['count(*)']),
      payins: payinsDto,
    }
  }

  /*
  -------------------------------------------------------------------------------
  Payout
  -------------------------------------------------------------------------------
  */

  async failPayout(payoutId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter
      .table(PayoutEntity.table)
      .where('id', payoutId)
      .andWhere('user_id', userId)
      .andWhere('payout_status', 'in', [
        PayoutStatusEnum.CREATED,
        PayoutStatusEnum.PENDING,
      ])
      .update(
        PayoutEntity.toDict<PayoutEntity>({
          payoutStatus: PayoutStatusEnum.FAILED,
        }),
      )
    // check for completed update
    if (rows == 1) {
      await this.dbWriter
        .table(CreatorShareEntity.table)
        .where('payout_id', payoutId)
        .update(
          CreatorShareEntity.toDict<CreatorShareEntity>({ payout: undefined }),
        )
    }
  }

  async completePayout(payoutId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter
      .table(PayoutEntity.table)
      .where('id', payoutId)
      .andWhere('user_id', userId)
      .andWhere('payout_status', 'in', [
        PayoutStatusEnum.CREATED,
        PayoutStatusEnum.PENDING,
      ])
      .update(
        PayoutEntity.toDict<PayoutEntity>({
          payoutStatus: PayoutStatusEnum.SUCCESSFUL,
        }),
      )
    if (rows == 1) {
      const payout = await this.dbReader(PayoutEntity.table)
        .where('id', payoutId)
        .andWhere('user_id', userId)
        .select(...PayoutEntity.populate<PayoutEntity>(['id', 'amount']))
        .first()
      await this.creatorStatsService.handlePayout(userId, payout.amount)
    }
  }

  async payoutAll(): Promise<void> {
    const creators = await this.dbReader(UserEntity.table)
      .join(
        CreatorSettingsEntity.table,
        `${UserEntity.table}.id`,
        `${CreatorSettingsEntity.table}.user_id`,
      )
      .where(UserEntity.toDict<UserEntity>({ isCreator: true }))
      .select([`${UserEntity.table}.id`, 'payout_frequency'])
    await Promise.all(
      creators.map(async (creator) => {
        try {
          await this.payoutCreator(creator.id, creator.payout_frequency)
        } catch (e) {
          this.logger.error(`Error paying out ${creator.id}`, e)
        }
      }),
    )
  }

  async payoutCreator(
    userId: string,
    // only defined when payout is automatic from batch job
    payoutFrequency?: PayoutFrequencyEnum,
  ): Promise<void> {
    const now = Date.now()
    const checkPayout = await this.dbReader(PayoutEntity.table)
      .select('created_at')
      .orderBy('created_at', 'desc')
      .limit(1)
      .first()
    if (
      checkPayout &&
      checkPayout.created_at > now - MAX_TIME_BETWEEN_PAYOUTS_MS
    ) {
      throw new PayoutFrequencyError(
        'Payout created for creator recently, try again later',
      )
    }

    if (payoutFrequency && checkPayout) {
      switch (payoutFrequency) {
        case PayoutFrequencyEnum.ONE_WEEK:
          break
        case PayoutFrequencyEnum.TWO_WEEKS:
          if (now % (ONE_WEEK_MS * 2) > ONE_WEEK_MS) {
            // job is run every week
            // ensure that creators opting for biweekly don't get paid too often
            return
          }
          break
        case PayoutFrequencyEnum.MANUAL:
          throw new PayoutFrequencyError(
            'automatic payout with manual selected',
          )
        default:
          throw new PayoutFrequencyError(
            'automatic payout with no frequency selected',
          )
      }
    }
    const defaultPayoutMethod = await this.getDefaultPayoutMethod(userId)

    const data = {
      id: v4(),
      user_id: userId,
      bank_id: defaultPayoutMethod.bankId,
      wallet_id: defaultPayoutMethod.walletId,
      payout_method: defaultPayoutMethod.method,
      payout_status: PayoutStatusEnum.CREATED,
      amount: 0,
    }
    await this.dbWriter(PayoutEntity.table).insert(data)

    const creatorShares = await this.dbReader(CreatorShareEntity.table)
      .join(
        PayinEntity.table,
        CreatorShareEntity.table + '.payin_id',
        PayinEntity.table + '.id',
      )
      .whereNull('payout_id')
      .andWhere('payin_status', PayinStatusEnum.SUCCESSFUL)
      .andWhere('creator_id', userId)
      .select(
        CreatorShareEntity.table + '.id',
        'creator_id',
        CreatorShareEntity.table + '.amount',
      )

    // check total payout amount
    const totalSum = this.creatorShares.reduce((accumulator, creatorShare) => {
      return accumulator + creatorShare.amount
    }, 0)
    if (totalSum < MIN_PAYOUT_AMOUNT) {
      throw new PayoutAmountError(`${totalSum} is not enough to payout`)
    }

    await this.dbWriter.transaction(async (trx) => {
      await Promise.all(
        creatorShares.map(async (creatorShare) => {
          await trx(PayoutEntity.table)
            .increment('amount', creatorShare.amount)
            .where('id', data.id)
          await trx(CreatorShareEntity.table)
            .update('payout_id', data.id)
            .where('id', creatorShare.id)
        }),
      )
    })
    await this.submitPayout(data.id)
  }

  /**
   * seperate function to submit payouts in case it fails and we need to resend
   * @param payout_id
   */
  async submitPayout(payout_id: string): Promise<void> {
    const payout = await this.dbReader(PayoutEntity.table)
      .whereIn('payout_status', [
        PayoutStatusEnum.FAILED,
        PayoutStatusEnum.CREATED,
      ])
      .andWhere('id', payout_id)
      .select('*')
      .first()

    switch (payout.payout_method) {
      case PayoutMethodEnum.CIRCLE_USDC:
        await this.makeCircleBlockchainTransfer(
          payout.user_id,
          new PayoutDto(payout),
        )
        break
      case PayoutMethodEnum.CIRCLE_WIRE:
        await this.makeCircleWirePayout(payout.user_id, new PayoutDto(payout))
        break
    }
  }

  async getPayouts(
    userId: string,
    getPayoutsRequest: GetPayoutsRequestDto,
  ): Promise<GetPayoutsResponseDto> {
    const payouts = await this.dbReader(PayoutEntity.table)
      .where('user_id', userId)
      .select('*')
      .orderBy('created_at', 'desc')
      .offset(getPayoutsRequest.offset)
      .limit(getPayoutsRequest.limit)
    const count = await this.dbReader
      .table(PayinEntity.table)
      .where('user_id', userId)
      .count()

    const banks = await this.dbReader
      .table(CircleCardEntity.table)
      .where(
        'id',
        'in',
        payouts.map((payout) => payout.bank_id),
      )
      .select('*')
    const banksMap = banks.reduce((map, bank) => {
      map[bank.id] = new CircleBankDto(bank)
      return map
    }, {})
    const wallets = await this.dbReader
      .table(WalletEntity.table)
      .where(
        'id',
        'in',
        payouts.map((payout) => payout.wallet_id),
      )
      .select('*')
    const walletsMap = wallets.reduce((map, wallet) => {
      map[wallet.id] = new WalletDto(wallet)
      return map
    }, {})

    const payoutsDto = payouts.map((payout) => {
      return new PayoutDto(payout)
    })
    payoutsDto.forEach((payoutDto) => {
      if (payoutDto.payoutMethod.method === PayoutMethodEnum.CIRCLE_WIRE) {
        payoutDto.bank = banksMap[payoutDto.payoutMethod.bankId as string]
      } else if (
        payoutDto.payoutMethod.method === PayoutMethodEnum.CIRCLE_USDC
      ) {
        payoutDto.wallet = walletsMap[payoutDto.payoutMethod.walletId as string]
      }
    })
    return {
      count: parseInt(count[0]['count(*)']),
      payouts: payoutsDto,
    }
  }

  /*
  -------------------------------------------------------------------------------
  Subscriptions
  -------------------------------------------------------------------------------
  */

  async subscribe(request: SubscribeRequestDto): Promise<SubscribeResponseDto> {
    // validating request information
    if (request.amount <= 0 || (request.amount * 100) % 1 !== 0) {
      throw new InvalidPayinRequestError(
        'invalid amount value ' + request.amount,
      )
    }

    // ensure that the subscription is for an accurate pass holder object
    if (
      (
        await this.dbReader(PassHolderEntity.table)
          .where('id', request.passHolderId)
          .select('holder_id')
          .first()
      ).holder_id !== request.userId
    ) {
      throw new InvalidSubscriptionError(
        `${request.userId} is not the holder in pass-holder ${request.passHolderId}`,
      )
    }

    // try to find subscription object if previously subscribed
    const subscription = await this.dbReader(SubscriptionEntity.table)
      .where(
        SubscriptionEntity.toDict<SubscriptionEntity>({
          passHolder: request.passHolderId,
          user: request.userId,
        }),
      )
      .select('*')
      .first()

    const payinMethod =
      request.payinMethod !== undefined &&
      (await this.validatePayinMethod(request.userId, request.payinMethod))
        ? request.payinMethod
        : await this.getDefaultPayinMethod(request.userId)

    if (!subscription) {
      // make new subscription object
      const data = SubscriptionEntity.toDict<SubscriptionEntity>({
        id: v4(),
        subscriptionStatus: SubscriptionStatusEnum.ACTIVE,
        user: request.userId,
        payinMethod: payinMethod.method,
        card: payinMethod.cardId,
        chainId: payinMethod.chainId,
        amount: request.amount,
        passHolder: request.passHolderId,
      })
      await this.dbWriter(SubscriptionEntity.table).insert(data)
      return { subscriptionId: data.id, payinMethod }
    } else if (
      subscription.subscription_status === SubscriptionStatusEnum.CANCELLED
    ) {
      await this.setSubscriptionPayinMethod(
        subscription.id,
        request.userId,
        payinMethod,
      )
      await this.dbWriter(SubscriptionEntity.table)
        .where('id', subscription.id)
        .update('amount', request.amount)
      return { subscriptionId: subscription.id as string, payinMethod }
    } else {
      throw new InvalidSubscriptionError('subscription already exists')
    }
  }

  async setSubscriptionPayinMethod(
    subscriptionId: string,
    userId: string,
    payinMethodDto: PayinMethodDto,
  ): Promise<void> {
    if (!(await this.validatePayinMethod(userId, payinMethodDto))) {
      throw new InvalidSubscriptionError(
        'invalid payin method for subscription',
      )
    }
    await this.dbWriter(SubscriptionEntity.table)
      .where(
        SubscriptionEntity.toDict<SubscriptionEntity>({
          id: subscriptionId,
          user: userId,
        }),
      )
      .update(
        SubscriptionEntity.toDict<SubscriptionEntity>({
          payinMethod: payinMethodDto.method,
          card: payinMethodDto.cardId,
          chainId: payinMethodDto.chainId,
        }),
      )
  }

  async cancelSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<void> {
    await this.dbWriter(SubscriptionEntity.table)
      .where(
        SubscriptionEntity.toDict<SubscriptionEntity>({
          id: subscriptionId,
          user: userId,
        }),
      )
      .update(
        SubscriptionEntity.toDict<SubscriptionEntity>({
          subscriptionStatus: SubscriptionStatusEnum.CANCELLED,
        }),
      )
  }

  async updateSubscriptions(): Promise<void> {
    const now = Date.now()
    const nftPassSubscriptions = await this.dbReader(SubscriptionEntity.table)
      .join(
        PassHolderEntity.table,
        `${SubscriptionEntity.table}.pass_holder_id`,
        `${PassHolderEntity.table}.id`,
      )
      .whereNot(
        `${SubscriptionEntity.table}.subscription_status`,
        SubscriptionStatusEnum.CANCELLED,
      )
      .select([
        `${SubscriptionEntity.table}'.id`,
        `${SubscriptionEntity.table}'.user_id`,
        ...SubscriptionEntity.populate<SubscriptionEntity>([
          'payinMethod',
          'chainId',
          'card',
        ]),
        `${PassHolderEntity.table}'.expires_at`,
        `${PassHolderEntity.table}'.holder_id`,
      ])

    await Promise.all(
      nftPassSubscriptions.map(async (subscription) => {
        try {
          // holder of pass changed
          if (subscription.user_id !== subscription.holder_id) {
            await this.dbWriter
              .where('id', subscription.id)
              .update('subscription_status', SubscriptionStatusEnum.CANCELLED)
            return
          }

          let status = SubscriptionStatusEnum.DISABLED
          if (subscription.expires_at - EXPIRING_DURATION_MS > now) {
            status = SubscriptionStatusEnum.ACTIVE
          } else if (subscription.expires_at > now) {
            status = SubscriptionStatusEnum.EXPIRING
          }

          await this.dbWriter
            .where('id', subscription.id)
            .update('subscription_status', status)
          // TODO: send email notifications

          // try to pay subscription if possible
          if (subscription.expires_at - EXPIRING_DURATION_MS <= now) {
            try {
              // can only autorenew with card
              if (subscription.payin_method === PayinMethodEnum.CIRCLE_CARD) {
                const registerResponse =
                  await this.passService.registerRenewPass(
                    subscription.user_id,
                    subscription.id,
                    new PayinMethodDto(subscription),
                  )
                await this.payinEntryHandler(subscription.user_id, {
                  payinId: registerResponse.payinId,
                  ip: subscription.ip_address,
                  sessionId: subscription.session_id,
                } as CircleCardPayinEntryRequestDto)
              }
            } catch (e) {
              this.logger.error(
                `Error paying subscription for ${subscription.id}`,
                e,
              )
            }
          }
        } catch (e) {
          this.logger.error(
            `Error updating subscription for ${subscription.id}`,
            e,
          )
        }
      }),
    )
  }

  async getSubscriptions(userId: string): Promise<Array<SubscriptionDto>> {
    const subscriptions = await this.dbReader
      .table(SubscriptionEntity.table)
      .where('user_id', userId)
      .andWhereNot('subscription_status', SubscriptionStatusEnum.CANCELLED)
      .select('*')

    const passHoldings = await this.dbReader
      .table(PassHolderEntity.table)
      .where(
        'id',
        'in',
        subscriptions.map((subscription) => subscription.pass_holder_id),
      )
      .select('*')
    const passHoldingsMap = passHoldings.reduce((map, passHolding) => {
      map[passHolding.id] = new PassHolderDto(passHolding)
      return map
    }, {})

    const passes = await this.dbReader
      .table(PassEntity.table)
      .where(
        'id',
        'in',
        passHoldings.map((passHolding) => passHolding.pass_id),
      )
      .select('*')
    const passesMap = passes.reduce((map, pass) => {
      map[pass.id] = new PassDto(pass)
      return map
    }, {})

    const subscriptionsDto = subscriptions.map((subscription) => {
      return new SubscriptionDto(subscription)
    })
    subscriptionsDto.forEach((subscriptionDto) => {
      subscriptionDto.passHolder =
        passHoldingsMap[subscriptionDto.passHolderId as string]
      subscriptionDto.pass =
        passesMap[subscriptionDto.passHolder?.passId as string]
    })
    return subscriptionsDto
  }
}
