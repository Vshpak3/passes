// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers */
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import ms from 'ms'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { AgencyEntity } from '../agency/entities/agency.entity'
import { CreatorAgencyEntity } from '../agency/entities/creator-agency.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { PayoutFrequencyEnum } from '../creator-settings/enum/payout-frequency.enum'
import { CreatorStatsService } from '../creator-stats/creator-stats.service'
import { EarningCategoryEnum } from '../creator-stats/enum/earning.category.enum'
import { EmailService } from '../email/email.service'
import { EVM_ADDRESS } from '../eth/eth.addresses'
import { EthService } from '../eth/eth.service'
import { MessagesService } from '../messages/messages.service'
import { PassHolderDto } from '../pass/dto/pass-holder.dto'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassService } from '../pass/pass.service'
import { PostService } from '../post/post.service'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { SOL_ACCOUNT, SOL_NETWORK } from '../sol/sol.accounts'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletNotFoundError } from '../wallet/error/wallet.error'
import { CreateNftPassPayinCallbackInput } from './callback.types'
import { CircleConnector } from './circle'
import { CircleBankDto } from './dto/circle/circle-bank.dto'
import { CircleCardDto } from './dto/circle/circle-card.dto'
import { CircleChargebackDto } from './dto/circle/circle-chargeback.dto'
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
import { GetPayinRequestDto, GetPayinsRequestDto } from './dto/get-payin.dto'
import { GetPayoutsRequestDto } from './dto/get-payout.dto'
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
import { CircleChargebackEntity } from './entities/circle-chargeback.entity'
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
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import {
  PAYIN_IN_PROGRESS_STATUSES,
  PAYIN_INVISIBLE_STATUSES,
  PAYIN_TARGET_BLOCKING_STATUSES,
  PayinStatusEnum,
} from './enum/payin.status.enum'
import { PayinMethodEnum } from './enum/payin-method.enum'
import { PayoutStatusEnum } from './enum/payout.status.enum'
import { PayoutMethodEnum } from './enum/payout-method.enum'
import { SubscriptionStatusEnum } from './enum/subscription.status.enum'
import {
  CircleNotificationError,
  CircleRequestError,
} from './error/circle.error'
import {
  InvalidPayinRequestError,
  InvalidPayinStatusError,
  NoPayinMethodError,
} from './error/payin.error'
import {
  NoPayoutMethodExcption,
  PayoutAmountException,
  PayoutFrequencyException,
  PayoutMethodException,
  PayoutNotFoundException,
} from './error/payout.error'
import { InvalidSubscriptionError } from './error/subscription.error'
import {
  handleCreationCallback,
  handleFailedCallback,
  handleSuccesfulCallback,
  handleUncreateCallback,
} from './payment.payin'

const DEFAULT_FIAT_FEE_RATE = 0.2
const DEFAULT_CRYPTO_FEE_RATE = 0.1

const DEFAULT_FIAT_FEE_FLAT = 0.25
const DEFAULT_CRYPTO_FEE_FLAT = 0

const MAX_CARDS_PER_USER = 10
const MAX_BANKS_PER_USER = 5
const MIN_TIME_BETWEEN_PAYOUTS_TEXT = '1 second'
const MIN_TIME_BETWEEN_PAYOUTS_MS = ms(MIN_TIME_BETWEEN_PAYOUTS_TEXT) // TODO: change to 5 days
const MAX_PAYINS_PER_REQUEST = 20
const MAX_PAYOUTS_PER_REQUEST = 20

const EXPIRING_DURATION_MS = ms('3 days')

const ONE_WEEK_MS = ms('1 week')

const MAX_TIME_STALE_PAYMENT = ms('8 hours')

const MIN_PAYOUT_AMOUNT = 50.0
const MIN_PAYOUT_CHARGE_TIME = ms('2 weeks') - ms('1 hour')
const PAYOUT_CHARGE_AMOUNT = 0.0 // 25.0 - removed for whitegloved creators

const MAX_CHARGEBACKS = 3
const MAX_CHARGEBACK_AMOUNT = 300

const MINT_TO_PAYMENT = true
const MIN_THREE_DS_LIMIT = 500
@Injectable()
export class PaymentService {
  private circleConnector: CircleConnector
  private circleMasterWallet: string
  public passService: PassService
  public messagesService: MessagesService
  public postService: PostService

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly emailService: EmailService,
    private readonly creatorStatsService: CreatorStatsService,
    private moduleRef: ModuleRef,

    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
    private readonly ethService: EthService,
    @InjectSentry() private readonly sentry: SentryService,
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
      await this.dbReader<CircleCardEntity>(CircleCardEntity.table)
        .where({ idempotency_key: createCardDto.idempotencyKey })
        .select('id')
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbWriter<CircleCardEntity>(CircleCardEntity.table)
      .whereNull('deleted_at')
      .andWhere({ user_id: userId })
      .count()
    if (count[0]['count(*)'] >= MAX_CARDS_PER_USER) {
      throw new BadRequestException(`${MAX_CARDS_PER_USER} card limit reached`)
    }

    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select('email')
      .first()

    createCardDto.metadata.email = user ? user.email : ''
    createCardDto.metadata.ipAddress = ip
    const response = await this.circleConnector.createCard(createCardDto)

    const data = {
      id: v4(),
      user_id: userId,
      card_number: cardNumber,
      circle_id: response['id'],
      status: response['status'],
      name: createCardDto.billingDetails.name,
      idempotency_key: createCardDto.idempotencyKey,
      exp_month: createCardDto.expMonth,
      exp_year: createCardDto.expYear,
    }

    await this.dbWriter<CircleCardEntity>(CircleCardEntity.table).insert(data)

    return { id: data.id, circleId: response['id'], status: response['status'] }
  }

  async deleteCircleCard(userId: string, cardId: string): Promise<void> {
    await this.dbWriter<CircleCardEntity>(CircleCardEntity.table)
      .update({ deleted_at: this.dbWriter.fn.now() })
      .where({ user_id: userId, id: cardId })
  }

  async getCircleCards(userId: string): Promise<CircleCardDto[]> {
    return (
      await this.dbReader<CircleCardEntity>(CircleCardEntity.table)
        .select('*')
        .where({ user_id: userId, status: CircleAccountStatusEnum.COMPLETE })
        .whereNull('deleted_at')
    ).map((card) => new CircleCardDto(card))
  }

  async getCircleCard(userId: string, cardId: string): Promise<CircleCardDto> {
    return new CircleCardDto(
      await this.dbReader<CircleCardEntity>(CircleCardEntity.table)
        .where({
          user_id: userId,
          id: cardId,
        })
        .whereNull('deleted_at')
        .select('*')
        .first(),
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
    threeDS: boolean,
    successUrl?: string,
    failureUrl?: string,
  ): Promise<CircleStatusResponseDto> {
    if (!payin.payinMethod.cardId) {
      throw new NoPayinMethodError('Card not selected')
    }
    const card = await this.dbReader<CircleCardEntity>(CircleCardEntity.table)
      .where({ id: payin.payinMethod.cardId })
      .select('id', 'circle_id')
      .first()
    if (!card || !card.circle_id) {
      throw new BadRequestException('Bank not found')
    }
    // save metadata into subscription for repeat purchases
    if (payin.target) {
      if (await this.checkPayinTargetBlocked(payin.target)) {
        await this.failPayin(payin.payinId, payin.userId)
        throw new BadRequestException('Payment for item already in progress')
      }
      await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
        .where({ target: payin.target, user_id: payin.userId })
        .update({
          ip_address: ipAddress,
          session_id: sessionId,
        })
    }
    await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payin.payinId })
      .update({
        ip_address: ipAddress,
        session_id: sessionId,
      })
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: payin.userId })
      .select('email')
      .first()

    if (!user) {
      throw new BadRequestException('User not found')
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
        email: user.email,
        sessionId: sessionId,
      },
      verification: threeDS ? 'three_d_secure' : 'none',
      verificationFailureUrl: failureUrl,
      verificationSuccessUrl: successUrl,
    }

    const data = {
      id: v4(),
      card_id: card.id,
      payin_id: payin.payinId,
      idempotency_key: createCardPaymentDto.idempotencyKey,
      amount: createCardPaymentDto.amount.amount,
      verification: CircleCardVerificationEnum.NONE,
      status: CirclePaymentStatusEnum.UNKOWN,
    }
    await this.dbWriter<CirclePaymentEntity>(CirclePaymentEntity.table).insert(
      data,
    )

    const response = await this.circleConnector.createPayment(
      createCardPaymentDto,
    )

    await this.dbWriter<CirclePaymentEntity>(CirclePaymentEntity.table)
      .update({
        circle_id: response['id'],
        status: response['status'],
      })
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
      await this.dbReader<CircleBankEntity>(CircleBankEntity.table)
        .where({ idempotency_key: createBankDto.idempotencyKey })
        .select('id')
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbWriter<CircleBankEntity>(CircleBankEntity.table)
      .whereNull('deleted_at')
      .andWhere({ user_id: userId })
      .count()
    if (count[0]['count(*)'] >= MAX_BANKS_PER_USER) {
      throw new BadRequestException(`${MAX_BANKS_PER_USER} bank limit reached`)
    }

    const response = await this.circleConnector.createBank(createBankDto)
    const data = {
      id: v4(),
      user_id: userId,
      status: response['status'],
      description: response['description'],
      tracking_ref: response['trackingRef'],
      fingerprint: response['fingerprint'],
      circle_id: response['id'],
      idempotency_key: createBankDto.idempotencyKey,
      country: createBankDto.billingDetails.country,
    }
    await this.dbWriter<CircleBankEntity>(CircleBankEntity.table).insert(data)

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
    await this.dbWriter<CircleBankEntity>(CircleBankEntity.table)
      .update({ deleted_at: this.dbWriter.fn.now() })
      .where({
        user_id: userId,
        id: circleBankId,
      })
  }

  /**
   * get all of a creator's banks
   * @param userId
   * @returns
   */
  async getCircleBanks(userId: string): Promise<CircleBankDto[]> {
    return (
      await this.dbReader<CircleBankEntity>(CircleBankEntity.table)
        .select('*')
        .where({ user_id: userId })
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
    userId: string | null,
    agencyId: string | null,
    payout: PayoutDto,
  ): Promise<CircleStatusResponseDto> {
    if (!payout.payoutMethod.bankId) {
      throw new NoPayoutMethodExcption('bank not selected')
    }
    const bank = await this.dbReader<CircleBankEntity>(CircleBankEntity.table)
      .where({
        id: payout.payoutMethod.bankId,
        user_id: userId,
        agency_id: agencyId,
      })
      .select('id', 'circle_id')
      .first()
    if (!bank || !bank.circle_id) {
      throw new BadRequestException('bank not found')
    }
    let email = ''
    if (userId) {
      const user = await this.dbReader<UserEntity>(UserEntity.table)
        .where({
          id: userId,
        })
        .select('email')
        .first()
      if (!user) {
        throw new BadRequestException('user not found')
      }
      email = user.email
    }
    if (agencyId) {
      const user = await this.dbReader<AgencyEntity>(AgencyEntity.table)
        .where({
          id: agencyId,
        })
        .select('email')
        .first()
      if (!user) {
        throw new BadRequestException('user not found')
      }
      email = user.email
    }

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
        beneficiaryEmail: email,
      },
    }

    const data = {
      id: v4(),
      bank_id: bank.id,
      payout_id: payout.payoutId,
      idempotency_key: createPayoutDto.idempotencyKey,
      amount: createPayoutDto.amount.amount,
      status: CircleAccountStatusEnum.PENDING,
    }
    await this.dbWriter<CirclePayoutEntity>(CirclePayoutEntity.table).insert(
      data,
    )
    const response = await this.circleConnector.createPayout(createPayoutDto)

    await this.dbWriter<CirclePayoutEntity>(CirclePayoutEntity.table)
      .update({
        circle_id: response['id'],
        status: response['status'],
      })
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
    if (!payout.payoutMethod.walletId) {
      throw new NoPayoutMethodExcption('wallet not selected')
    }
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
      .where({ id: payout.payoutMethod.walletId })
      .andWhere({ user_id: userId })
      .select('*')
      .first()

    if (!wallet) {
      throw new WalletNotFoundError(
        'wallet not found when making blockchain transfer',
      )
    }

    const createTransferDto: CircleCreateTransferRequestDto = {
      idempotencyKey: v4(),
      source: {
        type: 'wallet',
        id: this.circleMasterWallet,
        identities: [
          {
            type: 'business',
            name: 'Corefans Inc',
            addresses: [
              {
                line1: '1 S.E. 3rd Avenue',
                city: 'Miami',
                district: 'FL',
                country: 'US',
                postalCode: '33131',
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

    const data = {
      id: v4(),
      payout_id: payout.payoutId,
      idempotency_key: createTransferDto.idempotencyKey,
      amount: createTransferDto.amount.amount,
      currency: createTransferDto.amount.currency,
      status: CircleAccountStatusEnum.PENDING,
    }
    await this.dbWriter<CircleTransferEntity>(
      CircleTransferEntity.table,
    ).insert(data)

    const response = await this.circleConnector.createTransfer(
      createTransferDto,
    )

    await this.dbWriter<CircleTransferEntity>(CircleTransferEntity.table)
      .update({
        circle_id: response['id'],
        status: response['status'],
      })
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
    await this.dbWriter<CircleNotificationEntity>(
      CircleNotificationEntity.table,
    ).insert({
      id,
      client_id: update.clientId,
      notification_type: update.notificationType,
      full_content: JSON.stringify(update),
    })

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
        case CircleNotificationTypeEnum.CHARGEBACKS:
          await this.processCircleChargebackUpdate(
            update.chargeback as CircleChargebackDto,
          )
          break
        default:
          throw new CircleNotificationError(
            "notification type unrecognized: API might've updated",
          )
      }
      await this.dbWriter<CircleNotificationEntity>(
        CircleNotificationEntity.table,
      )
        .update({
          processed: true,
        })
        .where({ id })
    } catch (err) {
      await this.dbWriter<CircleNotificationEntity>(
        CircleNotificationEntity.table,
      )
        .update({
          processed: false,
        })
        .where({ id })
      this.sentry.instance().captureException(err)
      this.logger.error(`Error processing notification ${id}`, err)
    }
  }

  async processCircleChargebackUpdate(
    chargebackDto: CircleChargebackDto,
  ): Promise<void> {
    const payment = await this.dbReader<CirclePaymentEntity>(
      CirclePaymentEntity.table,
    )
      .join(
        PayinEntity.table,
        `${CirclePaymentEntity.table}.payin_id`,
        `${PayinEntity.table}.id`,
      )
      .where({ circle_id: chargebackDto.paymentId })
      .select(`${CirclePaymentEntity.table}.id`, `${PayinEntity.table}.user_id`)
      .first()
    if (payment) {
      const exists = await this.dbReader<CircleChargebackEntity>(
        CircleChargebackEntity.table,
      )
        .where({ circle_id: chargebackDto.id })
        .select('id')
        .first()
      if (!exists) {
        await this.dbWriter<UserEntity>(UserEntity.table)
          .where({ id: payment.user_id })
          .increment('chargeback_count', 1)
        const user = await this.dbWriter<UserEntity>(UserEntity.table)
          .where({ id: payment.user_id })
          .select('chargeback_count')
          .first()
        const chargebackCount = user?.chargeback_count
        if (
          (chargebackCount && chargebackCount >= MAX_CHARGEBACKS) ||
          parseFloat(chargebackDto.history[0].chargebackAmount.amount) >
            MAX_CHARGEBACK_AMOUNT
        ) {
          await this.dbWriter<UserEntity>(UserEntity.table)
            .where({ id: payment.user_id })
            .update({ payment_blocked: true })
        }
        await this.dbWriter<CircleChargebackEntity>(
          CircleChargebackEntity.table,
        )
          .insert({
            circle_id: chargebackDto.id,
            circle_payment_id: payment.id,
          })
          .onConflict(['circle_id'])
          .ignore()
      }
    }
    await this.emailService.sendEmail(
      'operations@passes.com',
      JSON.stringify(chargebackDto),
      'chargeback update notification',
    )
  }

  async processCircleWireUpdate(
    wireDto: GenericCircleObjectWrapper,
  ): Promise<void> {
    await this.dbWriter<CircleBankEntity>(CircleBankEntity.table)
      .update({ status: wireDto.status as CircleAccountStatusEnum })
      .where({ circle_id: wireDto.id })
  }

  async processCircleCardUpdate(
    cardDto: GenericCircleObjectWrapper,
  ): Promise<void> {
    await this.dbWriter<CircleCardEntity>(CircleCardEntity.table)
      .update({ status: cardDto.status as CircleAccountStatusEnum })
      .where({ circle_id: cardDto.id })
  }

  async processCirclePaymentUpdate(
    paymentDto: CirclePaymentDto,
  ): Promise<void> {
    const payin = await this.dbWriter<PayinEntity>(PayinEntity.table)
      .join(
        CirclePaymentEntity.table,
        PayinEntity.table + '.id',
        CirclePaymentEntity.table + '.payin_id',
      )
      .select(PayinEntity.table + '.id as id', PayinEntity.table + '.user_id')
      .where({ circle_id: paymentDto.id })
      .first()

    if (!payin) {
      throw new CircleNotificationError('notification for unrecorded payin')
    }

    await this.dbWriter<CirclePaymentEntity>(CirclePaymentEntity.table)
      .where({ circle_id: paymentDto.id })
      .update({ status: paymentDto.status })

    switch (paymentDto.status) {
      case CirclePaymentStatusEnum.PENDING:
        await this.dbWriter<PayinEntity>(PayinEntity.table)
          .update({
            payin_status: PayinStatusEnum.PENDING,
          })
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
        await this.dbWriter<PayinEntity>(PayinEntity.table)
          .update({
            payin_status: PayinStatusEnum.ACTION_REQUIRED,
            redirect_url: paymentDto.requiredAction?.redirectUrl,
          })
          .where({ id: payin.id })
        break
    }
  }

  async processCirclePayoutUpdate(payoutDto: any): Promise<void> {
    const payout = await this.dbReader<PayoutEntity>(PayoutEntity.table)
      .join(
        CirclePayoutEntity.table,
        PayoutEntity.table + '.id',
        CirclePayoutEntity.table + '.payout_id',
      )
      .select(`${PayoutEntity.table}.*`)
      .where(`${CirclePayoutEntity}.circle_id`, payoutDto.id)
      .first()

    if (!payout) {
      throw new CircleNotificationError('notification for unrecorded payout')
    }

    await this.dbWriter<CirclePayoutEntity>(CirclePayoutEntity.table)
      .where({ circle_id: payoutDto.id })
      .update({ status: payoutDto.status, fee: payoutDto.fees.amount })

    switch (payoutDto.status) {
      case CircleAccountStatusEnum.PENDING:
        await this.dbWriter<PayoutEntity>(PayoutEntity.table)
          .update({
            payout_status: PayoutStatusEnum.PENDING,
          })
          .where({ id: payout.id })
        break
      case CircleAccountStatusEnum.COMPLETE:
        await this.completePayout(payout.id, payout.user_id, payout.agency_id)
        break
      case CircleAccountStatusEnum.FAILED:
        await this.failPayout(payout.id, payout.user_id, payout.agency_id)
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
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

    let query = this.dbWriter<PayinEntity>(PayinEntity.table)
      .select(
        'id',
        'user_id',
        'amount',
        'amount_eth',
        'callback',
        'callback_input_json',
      )
      .where({
        address: transferDto.destination.address,
        payin_method: method,
      })

    if (chainId !== undefined) {
      query = query.where({ chain_id: chainId })
    }
    const payin = await query.first()
    if (!payin) {
      throw new InternalServerErrorException('payin not found')
    }

    let newJson: CreateNftPassPayinCallbackInput | undefined = undefined
    if (
      MINT_TO_PAYMENT &&
      payin.callback === PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS
    ) {
      newJson = payin.callback_input_json as CreateNftPassPayinCallbackInput
      newJson.walletAddress = await this.ethService.getSenderOfTransaction(
        transferDto.transactionHash,
      )
    }

    await this.dbWriter<PayinEntity>(PayinEntity.table)
      .update({
        transaction_hash: transferDto.transactionHash,
        callback_input_json: JSON.stringify(newJson),
      })
      .where({ id: payin.id })

    let correctAmount = false
    // allow for 2 units of uncertainity for potential rounding errors
    switch (method) {
      case PayinMethodEnum.METAMASK_CIRCLE_USDC:
      case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
        if (payin.amount - 0.02 <= parseFloat(transferDto.amount.amount)) {
          correctAmount = true
        }
        break
      case PayinMethodEnum.METAMASK_CIRCLE_ETH:
        if (
          payin.amount_eth &&
          payin.amount_eth - 2 <=
            parseFloat(transferDto.amount.amount) * 10 ** 18
        ) {
          correctAmount = true
        }
        break
    }

    if (!correctAmount) {
      throw new InternalServerErrorException(
        'received payment of incorrect amount',
      )
    }

    if (correctAmount) {
      switch (transferDto.status) {
        case CircleAccountStatusEnum.PENDING:
          await this.dbWriter<PayinEntity>(PayinEntity.table)
            .update({
              payin_status: PayinStatusEnum.PENDING,
            })
            .where({ id: payin.id })
          break
        case CircleAccountStatusEnum.COMPLETE:
          await this.completePayin(payin.id, payin.user_id)
          break
        case CircleAccountStatusEnum.FAILED:
          await this.failPayin(payin.id, payin.user_id)
          break
      }
    }
  }

  /**
   * process uddates for blockchain payouts to creators
   * @param transferDto
   */
  async processCircleOutgoingTransferUpdate(
    transferDto: CircleTransferDto,
  ): Promise<void> {
    const circleTransfer = await this.dbReader<CircleTransferEntity>(
      CircleTransferEntity.table,
    )
      .where({ circle_id: transferDto.id })
      .select('payout_id')
      .first()
    if (!circleTransfer) {
      throw new PayoutNotFoundException('payout not found for transfer')
    }
    const payout = await this.dbReader<PayoutEntity>(PayoutEntity.table)
      .where({ id: circleTransfer.payout_id })
      .select('*')
      .first()
    if (!payout) {
      throw new PayoutNotFoundException(
        'payout not found while processing outgoing transfer',
      )
    }
    if (transferDto.transactionHash) {
      await this.dbWriter<PayoutEntity>(PayoutEntity.table)
        .where({ id: payout.id })
        .update({ transaction_hash: transferDto.transactionHash })
    }

    await this.dbWriter<CircleTransferEntity>(CircleTransferEntity.table)
      .where({ id: transferDto.id })
      .update({ status: transferDto.status })

    switch (transferDto.status) {
      case CircleAccountStatusEnum.PENDING:
        await this.dbWriter<PayoutEntity>(PayoutEntity.table)
          .update({
            payout_status: PayoutStatusEnum.PENDING,
          })
          .where({ id: payout.id })
        break
      case CircleAccountStatusEnum.COMPLETE:
        await this.completePayout(payout.id, payout.user_id, payout.agency_id)
        break
      case CircleAccountStatusEnum.FAILED:
        await this.failPayout(payout.id, payout.user_id, payout.agency_id)
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
    const payin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .select('*')
      .where({
        id: entryDto.payinId,
        user_id: userId,
        payin_status: PayinStatusEnum.REGISTERED,
      })
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

      await this.dbWriter<PayinEntity>(PayinEntity.table)
        .update({ payin_status: PayinStatusEnum.CREATED_READY })
        .where({ id: entryDto.payinId })
    } catch (err) {
      await this.unregisterPayin(payinDto.payinId, userId)
      throw err
    }

    await handleCreationCallback(payin, this, this.dbWriter)
    return entryResponseDto
  }

  async entryCircleCard(
    payin: PayinDto,
    entryDto: CircleCardPayinEntryRequestDto,
  ): Promise<CircleCardPayinEntryResponseDto> {
    const threeDS = payin.amount > MIN_THREE_DS_LIMIT
    // payin.callback === PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS ||
    // payin.callback === PayinCallbackEnum.CREATE_NFT_SUBSCRIPTION_PASS
    const status = await this.makeCircleCardPayment(
      entryDto.ip,
      entryDto.sessionId,
      payin,
      threeDS,
      entryDto.successUrl,
      entryDto.failureUrl,
    )
    return { payinId: payin.payinId, status, actionRequired: threeDS }
  }

  async entryPhantomCircleUSDC(
    payin: PayinDto,
  ): Promise<PhantomCircleUSDCEntryResponseDto> {
    const tokenAddress: string = SOL_ACCOUNT[this.getBlockchainSelector()].USDC
    const networkUrl: string = SOL_NETWORK[this.getBlockchainSelector()]
    const depositAddress = await this.getCircleAddress('USD', 'SOL')
    await this.linkAddressToPayin(depositAddress, payin.payinId)
    return {
      payinId: payin.payinId,
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
    await this.linkAddressToPayin(depositAddress, payin.payinId)
    return {
      payinId: payin.payinId,
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
    await this.linkAddressToPayin(depositAddress, payin.payinId)
    return { payinId: payin.payinId, depositAddress, chainId }
  }

  /*
  -------------------------------------------------------------------------------
  CRYPTO
  -------------------------------------------------------------------------------
  */

  async linkAddressToPayin(address: string, payinId: string): Promise<void> {
    await this.dbWriter<PayinEntity>(PayinEntity.table)
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
    mainnet: { 1: ChainEnum.ETH, 137: ChainEnum.MATIC, 43114: ChainEnum.AVAX },
    testnet: {
      5: ChainEnum.ETH,
      80001: ChainEnum.MATIC,
      43113: ChainEnum.AVAX,
    },
  }

  EVM_NATIVE_CHAINIDS = {
    mainnet: [1],
    testnet: [5],
  }

  VALID_PAYOUT_CHAINS = [
    ChainEnum.ETH,
    ChainEnum.SOL,
    ChainEnum.MATIC,
    ChainEnum.AVAX,
  ]

  getBlockchainSelector() {
    return this.configService.get('blockchain.networks') as string
  }

  getEvmChainId(chain: ChainEnum) {
    return this.EVM_MAP[this.getBlockchainSelector()][chain.toUpperCase()]
  }

  getEvmChainIdsUSDC(): number[] {
    return Object.keys(
      this.EVM_USDC_CHAINIDS[this.getBlockchainSelector()],
    ).map((value) => parseInt(value))
  }

  getEvmChain(chainId: number): ChainEnum {
    return this.EVM_USDC_CHAINIDS[this.getBlockchainSelector()][
      chainId
    ] as ChainEnum
  }

  getEvmChainIdsNative(): number[] {
    return this.EVM_NATIVE_CHAINIDS[this.getBlockchainSelector()]
  }

  /*
  -------------------------------------------------------------------------------
  Payment Methods Get/Set
  -------------------------------------------------------------------------------
  */

  fillChainId(payinMethodDto: PayinMethodDto) {
    if (!payinMethodDto.chainId && payinMethodDto.chain) {
      payinMethodDto.chainId = this.getEvmChainId(payinMethodDto.chain)
    }
  }

  /**
   * set default payin method
   * @param userId
   * @param method
   * @param cardId
   * @param chainId
   */
  async setDefaultPayinMethod(
    userId: string,
    payinMethodDto: PayinMethodDto,
  ): Promise<void> {
    // find mainnet or testnet chainId
    this.fillChainId(payinMethodDto)

    await this.dbWriter<DefaultPayinMethodEntity>(
      DefaultPayinMethodEntity.table,
    )
      .insert({
        user_id: userId,
        method: payinMethodDto.method,
        card_id: payinMethodDto.cardId,
        chain_id: payinMethodDto.chainId,
      })
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
      .where({ user_id: userId })
      .select('*')
      .first()

    if (!defaultPayinMethod) {
      return { method: PayinMethodEnum.NONE }
    }
    const dto = new PayinMethodDto(defaultPayinMethod)
    if (dto.chainId) {
      dto.chain = this.getEvmChain(dto.chainId)
    }
    if (!(await this.validatePayinMethod(userId, dto))) {
      return { method: PayinMethodEnum.NONE }
    }
    return dto
  }

  async validatePayinMethod(
    userId: string,
    payinMethodDto: PayinMethodDto,
  ): Promise<boolean> {
    this.fillChainId(payinMethodDto)
    switch (payinMethodDto.method) {
      case PayinMethodEnum.CIRCLE_CARD:
        // assert that card exists and is not deleted
        return (
          !!payinMethodDto.cardId &&
          !!(await this.dbReader<CircleCardEntity>(CircleCardEntity.table)
            .where({
              user_id: userId,
              id: payinMethodDto.cardId,
              status: CircleAccountStatusEnum.COMPLETE,
            })
            .whereNull('deleted_at')
            .select('id')
            .first())
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

  async validatePayinData(
    userId: string,
    payinMethodDto?: PayinMethodDto,
  ): Promise<boolean> {
    return payinMethodDto
      ? this.validatePayinMethod(userId, payinMethodDto)
      : (await this.getDefaultPayinMethod(userId)).method !==
          PayinMethodEnum.NONE
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
    await this.dbWriter<DefaultPayoutMethodEntity>(
      DefaultPayoutMethodEntity.table,
    )
      .insert({
        user_id: userId,
        method: payoutMethodDto.method,
        bank_id: payoutMethodDto.bankId,
        wallet_id: payoutMethodDto.walletId,
      })
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
      .where({ user_id: userId })
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
          !!payoutMethodDto.bankId &&
          !!(await this.dbReader<CircleBankEntity>(CircleBankEntity.table)
            .where({
              user_id: userId,
              id: payoutMethodDto.bankId,
            })
            .whereNull('deleted_at')
            .select('id')
            .first())
        )
      case PayoutMethodEnum.CIRCLE_USDC:
        return (
          !!payoutMethodDto.walletId &&
          !!(await this.dbReader<WalletEntity>(WalletEntity.table)
            .where({
              user_id: userId,
              id: payoutMethodDto.walletId,
            })
            .select('id')
            .first())
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

  async checkPayinBlocked(userId: string): Promise<boolean> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select('payment_blocked')
      .first()
    return !user || user.payment_blocked
  }

  async checkPayinTargetBlocked(target: string): Promise<boolean> {
    const checkPayin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .whereIn('payin_status', PAYIN_TARGET_BLOCKING_STATUSES)
      .andWhere({ target: target })
      .select('id')
      .first()
    return !!checkPayin
  }

  /**
   *
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

    if (await this.checkPayinBlocked(request.userId)) {
      throw new InvalidPayinRequestError(
        `User ${request.userId} is blocked from paying`,
      )
    }
    // validating request information
    if (request.amount <= 0 || (request.amount * 100) % 1 !== 0) {
      throw new InvalidPayinRequestError(
        `invalid amount value ${request.amount}`,
      )
    }

    // legacy - payinMethod is enforced for now
    const payinMethod =
      request.payinMethod !== undefined
        ? request.payinMethod
        : await this.getDefaultPayinMethod(request.userId)
    if (!(await this.validatePayinMethod(request.userId, payinMethod))) {
      throw new InvalidPayinRequestError('invalid payin method')
    }

    const data = {
      id: v4(),
      user_id: request.userId,
      payin_method: payinMethod.method,
      card_id: payinMethod.cardId,
      chain_id: payinMethod.chainId,
      payin_status: PayinStatusEnum.REGISTERED,
      callback: request.callback,
      callback_input_json: JSON.stringify(request.callbackInputJSON),
      amount: request.amount,
      amount_eth: request.amountEth,
      target: request.target,
    }

    await this.dbWriter<PayinEntity>(PayinEntity.table).insert(data)

    // create creator share of payment
    try {
      await this.createCreatorShare(
        request.creatorId,
        request.amount,
        payinMethod,
        data.id,
      )
    } catch (err) {
      await this.unregisterPayin(data.id, request.userId)
      throw err
    }

    return {
      payinId: data.id,
      payinMethod,
      amount: request.amount,
      amountEth: request.amountEth,
    }
  }

  async createCreatorShare(
    creatorId: string,
    amount: number,
    payinMethod: PayinMethodDto,
    payinId: string,
  ) {
    const creator = await this.dbReader<UserEntity>(UserEntity.table)
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

    await this.dbWriter<CreatorShareEntity>(CreatorShareEntity.table).insert({
      creator_id: creatorId,
      amount: shareAmount,
      payin_id: payinId,
    })
  }

  async getTotalEarnings(payinId: string): Promise<number> {
    const shares = await this.dbReader<CreatorShareEntity>(
      CreatorShareEntity.table,
    )
      .where({
        payin_id: payinId,
      })
      .select('amount')
    return shares.reduce((sum, share) => {
      return sum + share.amount
    }, 0)
  }

  async getCreatorFee(creatorId: string) {
    return new CreatorFeeDto(
      await this.dbReader<CreatorFeeEntity>(CreatorFeeEntity.table)
        .where({ creator_id: creatorId })
        .select('*')
        .first(),
    )
  }

  async updateInputJSON(payinId: string, json: any) {
    await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payinId })
      .update({
        callback_input_json: JSON.stringify(json),
      })
  }

  async userUncreatePayin(payinId: string, userId: string): Promise<void> {
    await this.uncreatePayin(payinId, userId)
  }

  async userCancelPayin(payinId: string, userId: string): Promise<void> {
    // attempt to unregister or fail
    // only one update will succeed since it updates based on current state
    await this.unregisterPayin(payinId, userId)
    await this.failPayin(payinId, userId)
  }

  async unregisterPayin(payinId: string, userId: string): Promise<void> {
    await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payinId })
      .andWhere({ user_id: userId })
      .andWhere('payin_status', PayinStatusEnum.REGISTERED)
      .update({
        payin_status: PayinStatusEnum.UNREGISTERED,
      })
  }

  async uncreatePayin(payinId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payinId })
      .andWhere({ user_id: userId })
      .andWhere('payin_status', PayinStatusEnum.CREATED)
      .update({
        payin_status: PayinStatusEnum.UNCREATED_READY,
      })
    // check for completed update
    if (rows === 1) {
      const payin = await this.dbReader<PayinEntity>(PayinEntity.table)
        .where({ id: payinId })
        .andWhere({ user_id: userId })
        .select('*')
        .first()
      if (payin) {
        await handleUncreateCallback(payin, this, this.dbWriter)
      }
    }
  }

  async failPayin(payinId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payinId })
      .andWhere({ user_id: userId })
      .andWhere('payin_status', 'in', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
        PayinStatusEnum.ACTION_REQUIRED,
      ])
      .update({
        payin_status: PayinStatusEnum.FAILED_READY,
      })
    // check for completed update
    if (rows === 1) {
      const payin = await this.dbReader<PayinEntity>(PayinEntity.table)
        .where({ id: payinId })
        .andWhere({ user_id: userId })
        .select('*')
        .first()
      if (payin) {
        await handleFailedCallback(payin, this, this.dbWriter)
      }
    }
  }

  async completePayin(payinId: string, userId: string): Promise<void> {
    const rows = await this.dbWriter<PayinEntity>(PayinEntity.table)
      .where({ id: payinId })
      .andWhere({ user_id: userId })
      .andWhere('payin_status', 'in', [
        PayinStatusEnum.ACTION_REQUIRED,
        PayinStatusEnum.CREATED_READY,
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .update({
        payin_status: PayinStatusEnum.SUCCESSFUL_READY,
      })
    // check for completed update
    if (rows === 1) {
      const payin = await this.dbReader<PayinEntity>(PayinEntity.table)
        .where({ id: payinId })
        .andWhere({ user_id: userId })
        .select('*')
        .first()
      if (!payin) {
        throw new InternalServerErrorException('payin not found')
      }
      await handleSuccesfulCallback(payin, this, this.dbWriter)
      const creatorShares = await this.dbReader<CreatorShareEntity>(
        CreatorShareEntity.table,
      )
        .leftJoin(
          CreatorAgencyEntity.table,
          `${CreatorAgencyEntity.table}.creator_id`,
          `${CreatorShareEntity.table}.creator_id`,
        )
        .where({ payin_id: payin.id })
        .select(
          `${CreatorShareEntity.table}.creator_id`,
          `${CreatorShareEntity.table}.amount`,
          `${CreatorAgencyEntity.table}.rate`,
        )

      await Promise.all(
        creatorShares.map(async (creatorShare) => {
          const rate = creatorShare.rate ?? 0
          await this.creatorStatsService.handlePayinSuccess(
            payin.user_id,
            creatorShare.creator_id,
            payin.callback,
            {
              [EarningCategoryEnum.NET]: creatorShare.amount * (1 - rate),
              [EarningCategoryEnum.GROSS]: payin.amount,
              [EarningCategoryEnum.AGENCY]: creatorShare.amount * rate,
            },
          )
        }),
      )
    }
  }

  async getPayin(
    userId: string,
    getPayinRequest: GetPayinRequestDto,
  ): Promise<PayinDto> {
    const payin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .where({
        user_id: userId,
        id: getPayinRequest.payinId,
      })
      .select('*')
      .first()
    return new PayinDto(payin)
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
  ): Promise<PayinDto[]> {
    const { startDate, endDate, lastId, createdAt, inProgress } =
      getPayinsRequest

    let query = this.dbReader<PayinEntity>(PayinEntity.table)
      .leftJoin(
        CircleCardEntity.table,
        `${PayinEntity.table}.card_id`,
        `${CircleCardEntity.table}.id`,
      )
      .where(`${PayinEntity.table}.user_id`, userId)
      .andWhere(
        `${PayinEntity.table}.payin_status`,
        'not in',
        PAYIN_INVISIBLE_STATUSES,
      )
      .select(`${PayinEntity.table}.*`, `${CircleCardEntity.table}.card_number`)
      .orderBy('created_at', 'desc')

    if (startDate) {
      query = query.where(`${PayinEntity.table}.created_at`, '>', startDate)
    }
    if (endDate) {
      query = query.where(`${PayinEntity.table}.created_at`, '<', endDate)
    }
    if (inProgress) {
      query = query.whereIn(
        `${PayinEntity.table}.payin_status`,
        PAYIN_IN_PROGRESS_STATUSES,
      )
    }
    query = createPaginatedQuery(
      query,
      PayinEntity.table,
      PayinEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    const payins = await query.limit(MAX_PAYINS_PER_REQUEST)
    const ret = payins.map((payin) => new PayinDto(payin))
    ret.forEach((payin) => {
      if (payin.payinMethod.chainId) {
        payin.payinMethod.chain = this.getEvmChain(payin.payinMethod.chainId)
      }
    })
    return payins.map((payin) => new PayinDto(payin))
  }

  async failStalePayins() {
    const payins = await this.dbReader<PayinEntity>(PayinEntity.table)
      .whereIn('payin_method', [
        PayinMethodEnum.METAMASK_CIRCLE_ETH,
        PayinMethodEnum.METAMASK_CIRCLE_USDC,
        PayinMethodEnum.PHANTOM_CIRCLE_USDC,
      ])
      .andWhere('payin_status', PayinStatusEnum.CREATED)
      .andWhere(
        'created_at',
        '<',
        new Date(Date.now() - MAX_TIME_STALE_PAYMENT),
      )
      .select('*')

    for (let i = 0; i < payins.length; ++i) {
      await this.failPayin(payins[i].id, payins[i].user_id)
    }
  }

  /*
  -------------------------------------------------------------------------------
  Payout
  -------------------------------------------------------------------------------
  */

  async failPayout(
    payoutId: string,
    userId: string | null,
    agencyId: string | null,
  ): Promise<void> {
    await this.dbWriter<PayoutEntity>(PayoutEntity.table)
      .where({ id: payoutId })
      .andWhere({ user_id: userId, agency_id: agencyId })
      .andWhere('payout_status', 'in', [
        PayoutStatusEnum.CREATED,
        PayoutStatusEnum.PENDING,
      ])
      .update({ payout_status: PayoutStatusEnum.FAILED })
    // check for completed update

    // TODO: consider adding back to balance on failure
    // if (rows === 1) {
    //   const payout = await this.dbReader<PayoutEntity>(PayoutEntity.table)
    //     .where({ id: payoutId })
    //     .select('amount')
    //     .first()
    //   if (!payout) {
    //     throw new InternalServerErrorException('no amount for payout found')
    //   }
    //   await this.creatorStatsService.handlePayoutFail(userId, {
    //     [EarningCategoryEnum.NET]: payout.amount,
    //     [EarningCategoryEnum.GROSS]: payout.amount,
    //     [EarningCategoryEnum.AGENCY]: 0,
    //   })
    // }
  }

  async completePayout(
    payoutId: string,
    userId: string | null,
    agencyId: string | null,
  ): Promise<void> {
    const rows = await this.dbWriter<PayoutEntity>(PayoutEntity.table)
      .where({ id: payoutId })
      .andWhere({ user_id: userId, agency_id: agencyId })
      .andWhere('payout_status', 'in', [
        PayoutStatusEnum.CREATED,
        PayoutStatusEnum.PENDING,
      ])
      .update({ payout_status: PayoutStatusEnum.SUCCESSFUL })
    if (rows === 1) {
      const payout = await this.dbReader<PayoutEntity>(PayoutEntity.table)
        .where({ id: payoutId })
        .select('amount')
        .first()
      if (!payout) {
        throw new InternalServerErrorException('no amount for payout found')
      }
      // await this.creatorStatsService.handlePayoutSuccess(userId, {
      //   [EarningCategoryEnum.NET]: payout.amount,
      //   [EarningCategoryEnum.GROSS]: payout.amount,
      //   [EarningCategoryEnum.AGENCY]: 0,
      // })
    }
  }

  async payoutAll(): Promise<void> {
    const creators = await this.dbReader<UserEntity>(UserEntity.table)
      .join(
        CreatorSettingsEntity.table,
        `${UserEntity.table}.id`,
        `${CreatorSettingsEntity.table}.user_id`,
      )
      .where({ is_creator: true })
      .andWhereNot('payout_frequency', PayoutFrequencyEnum.MANUAL)
      .select([`${UserEntity.table}.id`, 'payout_frequency'])
    await Promise.all(
      creators.map(async (creator) => {
        try {
          await this.payoutCreator(creator.id, creator.payout_frequency)
        } catch (err) {
          this.logger.error(`Error paying out ${creator.id}`, err)
        }
      }),
    )
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async payoutCreator(
    userId: string,
    // only defined when payout is automatic from batch job
    payoutFrequency?: PayoutFrequencyEnum,
  ): Promise<void> {
    const redisKey = `payoutCreator:${userId}`
    const lockResult = await this.lockService.lockOnce(
      redisKey,
      MIN_TIME_BETWEEN_PAYOUTS_MS,
    )
    if (!lockResult) {
      throw new PayoutFrequencyException(
        `Payouts can only occur once every ${MIN_TIME_BETWEEN_PAYOUTS_TEXT}`,
      )
    }

    const last = await this.dbWriter<PayoutEntity>(PayoutEntity.table)
      .where({ user_id: userId })
      .select('*')
      .orderBy('created_at', 'desc')
      .first()

    let charge = 0
    if (
      last &&
      last.created_at.valueOf() + MIN_PAYOUT_CHARGE_TIME > Date.now()
    ) {
      charge = PAYOUT_CHARGE_AMOUNT
    }

    if (payoutFrequency) {
      switch (payoutFrequency) {
        case PayoutFrequencyEnum.ONE_WEEK:
          // supporting one week payouts for starting whitegloved users

          // throw new InternalServerErrorException(
          //   'we currently dont support weekly payouts',
          // )
          break
        case PayoutFrequencyEnum.TWO_WEEKS:
          if (Date.now() % (ONE_WEEK_MS * 2) < ONE_WEEK_MS) {
            // job is run every week
            // ensure that creators opting for biweekly don't get paid too often
            return
          }
          break
        case PayoutFrequencyEnum.FOUR_WEEKS:
          if (Date.now() % (ONE_WEEK_MS * 4) < ONE_WEEK_MS) {
            // job is run every week
            // ensure that creators opting for biweekly don't get paid too often
            return
          }
          break
        case PayoutFrequencyEnum.MANUAL:
          throw new PayoutFrequencyException(
            'automatic payout with manual selected',
          )
        default:
          throw new PayoutFrequencyException(
            'automatic payout with no frequency selected',
          )
      }
    }
    const defaultPayoutMethod = await this.getDefaultPayoutMethod(userId)
    if (defaultPayoutMethod.method === PayoutMethodEnum.NONE) {
      throw new PayoutMethodException('No destination for payout')
    }

    const availableBalances =
      await this.creatorStatsService.getAvailableBalances(userId)
    const creatorBalance = availableBalances[EarningCategoryEnum.NET].amount

    if (!creatorBalance || creatorBalance <= 0) {
      throw new PayoutAmountException('No balance to payout')
    }

    if (creatorBalance < MIN_PAYOUT_AMOUNT || creatorBalance - charge <= 0) {
      throw new PayoutAmountException(
        `${creatorBalance} is not enough to payout`,
      )
    }

    try {
      await this.creatorStatsService.handlePayout(userId, {
        [EarningCategoryEnum.NET]: availableBalances.net.amount,
        [EarningCategoryEnum.GROSS]: availableBalances.gross.amount,
        [EarningCategoryEnum.AGENCY]: availableBalances.agency.amount,
      })
      const data = {
        id: v4(),
        user_id: userId,
        bank_id: defaultPayoutMethod.bankId,
        wallet_id: defaultPayoutMethod.walletId,
        payout_method: defaultPayoutMethod.method,
        payout_status: PayoutStatusEnum.CREATED,
        amount: creatorBalance - charge,
      }
      await this.dbWriter<PayoutEntity>(PayoutEntity.table).insert(data)
      await this.submitPayout(data.id)

      if (availableBalances.agency.amount) {
        const agency = await this.dbReader<AgencyEntity>(AgencyEntity.table)
          .leftJoin(
            CreatorAgencyEntity.table,
            `${AgencyEntity.table}.id`,
            `${CreatorAgencyEntity.table}.agency_id`,
          )
          .where(`${CreatorAgencyEntity.table}.creator_id`, userId)
          .select(`${AgencyEntity.table}.id`)
          .first()
        if (!agency) {
          throw new InternalServerErrorException(
            'no linked agency while agency balance exists',
          )
        }
        await this.dbWriter<AgencyEntity>(AgencyEntity.table)
          .where({ id: agency.id })
          .increment('available_balance', availableBalances.agency.amount)
      }
    } catch (err) {
      await this.lockService.unlock(redisKey)
      this.sentry.instance().captureException(err)
      throw err
      // await this.creatorStatsService.handlePayoutFail(userId, {
      //   [EarningCategoryEnum.NET]: availableBalance,
      //   [EarningCategoryEnum.GROSS]: availableBalance,
      //   [EarningCategoryEnum.AGENCY]: 0,
      // })
    }
  }

  /**
   * seperate function to submit payouts in case it fails and we need to resend
   * @param payout_id
   */
  async submitPayout(payout_id: string): Promise<void> {
    const payout = await this.dbWriter<PayoutEntity>(PayoutEntity.table)
      .whereIn('payout_status', [
        PayoutStatusEnum.FAILED,
        PayoutStatusEnum.CREATED,
      ])
      .andWhere({ id: payout_id })
      .select('*')
      .first()
    if (!payout) {
      throw new PayoutNotFoundException('payout not found')
    }
    switch (payout.payout_method) {
      case PayoutMethodEnum.CIRCLE_USDC:
        if (!payout.user_id) {
          throw new InternalServerErrorException(
            'crypto payouts to agencies not supported',
          )
        }
        await this.makeCircleBlockchainTransfer(
          payout.user_id,
          new PayoutDto(payout),
        )
        break
      case PayoutMethodEnum.CIRCLE_WIRE:
        await this.makeCircleWirePayout(
          payout.user_id,
          payout.agency_id,
          new PayoutDto(payout),
        )
        break
    }
  }

  async getPayouts(
    userId: string,
    getPayoutsRequest: GetPayoutsRequestDto,
  ): Promise<PayoutDto[]> {
    const { startDate, endDate, lastId, createdAt } = getPayoutsRequest
    let query = this.dbReader<PayoutEntity>(PayoutEntity.table)
      .leftJoin(
        CircleBankEntity.table,
        `${PayoutEntity.table}.bank_id`,
        `${CircleBankEntity.table}.id`,
      )
      .leftJoin(
        WalletEntity.table,
        `${PayoutEntity.table}.wallet_id`,
        `${WalletEntity.table}.id`,
      )
      .where(`${PayoutEntity.table}.user_id`, userId)
      .select(
        `${PayoutEntity.table}.*`,
        `${CircleBankEntity.table}.description as bank_description`,
        `${WalletEntity.table}.address`,
        `${WalletEntity.table}.chain`,
      )
      .orderBy('created_at', 'desc')
    if (startDate) {
      query = query.where(`${PayoutEntity.table}.created_at`, '>', startDate)
    }
    if (endDate) {
      query = query.where(`${PayoutEntity.table}.created_at`, '<', endDate)
    }

    query = createPaginatedQuery(
      query,
      PayoutEntity.table,
      PayoutEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )

    const payouts = await query.limit(MAX_PAYOUTS_PER_REQUEST)
    return payouts.map((payout) => {
      return new PayoutDto(payout)
    })
  }

  /*
  -------------------------------------------------------------------------------
  Subscriptions
  -------------------------------------------------------------------------------
  */

  async subscribe(request: SubscribeRequestDto): Promise<SubscribeResponseDto> {
    // validating request information
    if (request.amount <= 0) {
      throw new InvalidPayinRequestError(
        'invalid amount value ' + request.amount,
      )
    }
    const passholder = await this.dbWriter<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .where({ id: request.passHolderId })
      .select('holder_id')
      .first()
    // ensure that the subscription is for an accurate pass holder object
    if (!passholder || passholder.holder_id !== request.userId) {
      throw new InvalidSubscriptionError(
        `${request.userId} is not the holder in pass-holder ${request.passHolderId}`,
      )
    }

    // try to find subscription object if previously subscribed
    const subscription = await this.dbReader<SubscriptionEntity>(
      SubscriptionEntity.table,
    )
      .where({
        pass_holder_id: request.passHolderId,
        user_id: request.userId,
      })
      .select('*')
      .first()

    const payinMethod =
      request.payinMethod !== undefined &&
      (await this.validatePayinMethod(request.userId, request.payinMethod))
        ? request.payinMethod
        : await this.getDefaultPayinMethod(request.userId)

    if (!subscription) {
      // make new subscription object
      const data = {
        id: v4(),
        subscription_status: SubscriptionStatusEnum.ACTIVE,
        user_id: request.userId,
        payin_method: payinMethod.method,
        card_id: payinMethod.cardId,
        chain_id: payinMethod.chainId,
        amount: request.amount,
        pass_holder_id: request.passHolderId,
        target: request.target,
        session_id: request.sessionId,
        ip_address: request.ipAddress,
      } as SubscriptionEntity
      await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table).insert(
        data,
      )
      return { subscriptionId: data.id, payinMethod }
    } else if (
      subscription.subscription_status === SubscriptionStatusEnum.CANCELLED
    ) {
      await this.setSubscriptionPayinMethod(
        subscription.id,
        request.userId,
        payinMethod,
      )
      await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
        .where({
          id: subscription.id,
        })
        .update({
          amount: request.amount,
          session_id: request.sessionId,
          ip_address: request.ipAddress,
        })
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
    await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
      .where({
        id: subscriptionId,
        user_id: userId,
      })
      .update({
        payin_method: payinMethodDto.method,
        card_id: payinMethodDto.cardId,
        chain_id: payinMethodDto.chainId,
      })
  }

  async cancelSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<void> {
    await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
      .where({
        id: subscriptionId,
        user_id: userId,
      })
      .update({
        subscription_status: SubscriptionStatusEnum.CANCELLED,
      })
  }

  async updateSubscriptions(): Promise<void> {
    const now = Date.now()
    const nftPassSubscriptions = await this.dbReader<SubscriptionEntity>(
      SubscriptionEntity.table,
    )
      .join(
        PassHolderEntity.table,
        `${SubscriptionEntity.table}.pass_holder_id`,
        `${PassHolderEntity.table}.id`,
      )
      .whereNot(
        `${SubscriptionEntity.table}.subscription_status`,
        SubscriptionStatusEnum.CANCELLED,
      )
      .select(
        `${SubscriptionEntity.table}.*`,
        `${PassHolderEntity.table}.expires_at`,
        `${PassHolderEntity.table}.holder_id`,
      )

    await Promise.all(
      nftPassSubscriptions.map(async (subscription) => {
        try {
          // holder of pass changed
          if (subscription.user_id !== subscription.holder_id) {
            await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
              .where({ id: subscription.id })
              .update({ subscription_status: SubscriptionStatusEnum.CANCELLED })
            return
          }

          let status = SubscriptionStatusEnum.DISABLED
          if (subscription.expires_at.valueOf() - EXPIRING_DURATION_MS > now) {
            status = SubscriptionStatusEnum.ACTIVE
          } else if (subscription.expires_at.valueOf() > now) {
            status = SubscriptionStatusEnum.EXPIRING
          }

          await this.dbWriter<SubscriptionEntity>(SubscriptionEntity.table)
            .where({ id: subscription.id })
            .update({ subscription_status: status })

          // TODO: send email notifications
          // try to pay subscription if possible
          if (subscription.expires_at - EXPIRING_DURATION_MS <= now) {
            try {
              const method: PayinMethodDto = {
                method: subscription.payin_method,
                cardId: subscription.card_id,
                chainId: subscription.chain_id,
              }
              // can only autorenew with card
              if (subscription.payin_method === PayinMethodEnum.CIRCLE_CARD) {
                const registerResponse =
                  await this.passService.registerRenewPass(
                    subscription.user_id,
                    subscription.pass_holder_id,
                    method,
                  )
                await this.payinEntryHandler(subscription.user_id, {
                  payinId: registerResponse.payinId,
                  ip: subscription.ip_address,
                  sessionId: subscription.session_id,
                } as CircleCardPayinEntryRequestDto)
              }
            } catch (err) {
              this.logger.error(
                `Error paying subscription for ${subscription.id}`,
                err,
              )
              this.sentry.instance().captureException(err)
            }
          }
        } catch (err) {
          this.logger.error(
            `Error updating subscription for ${subscription.id}`,
            err,
          )
          this.sentry.instance().captureException(err)
        }
      }),
    )
  }

  async getSubscriptions(userId: string): Promise<SubscriptionDto[]> {
    const subscriptions = await this.dbReader<SubscriptionEntity>(
      SubscriptionEntity.table,
    )
      .leftJoin(
        PassHolderEntity.table,
        `${SubscriptionEntity.table}.pass_holder_id`,
        `${PassHolderEntity.table}.id`,
      )
      .where(`${PassHolderEntity.table}.holder_id`, userId)
      .where(`${SubscriptionEntity.table}.user_id`, userId)
      .select(
        `${SubscriptionEntity.table}.*`,
        `${PassHolderEntity.table}.pass_id`,
        `${PassHolderEntity.table}.expires_at`,
      )

    return subscriptions.map((subscription) => {
      const subscriptionDto = new SubscriptionDto(subscription)
      subscriptionDto.passHolder = new PassHolderDto(subscription)
      subscriptionDto.passHolder.passHolderId = subscription.pass_holder_id
      return new SubscriptionDto(subscription)
    })
  }

  /*
  -------------------------------------------------------------------------------
  Chargebacks
  -------------------------------------------------------------------------------
  */

  async disputedChargeback(chargebackId: string) {
    return (
      (await this.dbWriter<CircleChargebackEntity>(CircleChargebackEntity.table)
        .update({
          disputed: true,
        })
        .where({
          id: chargebackId,
          disputed: null,
        })) === 1
    )
  }

  async undisputedChargeback(chargebackId: string) {
    const updated =
      (await this.dbWriter<CircleChargebackEntity>(CircleChargebackEntity.table)
        .update({
          disputed: false,
        })
        .where({
          id: chargebackId,
          disputed: null,
        })) === 1
    if (updated) {
      const payin = await this.dbReader<CircleChargebackEntity>(
        CircleChargebackEntity.table,
      )
        .join(
          CirclePaymentEntity.table,
          `${CircleChargebackEntity.table}.circle_payment_id`,
          `${CirclePaymentEntity.table}.id`,
        )
        .join(
          PayinEntity.table,
          `${CirclePaymentEntity.table}.payin_id`,
          `${PayinEntity.table}.id`,
        )
        .join(
          CreatorShareEntity.table,
          `${PayinEntity.table}.id`,
          `${CreatorShareEntity.table}.payin_id`,
        )
        .leftJoin(
          CreatorAgencyEntity.table,
          `${CreatorAgencyEntity.table}.creator_id`,
          `${CreatorShareEntity.table}.creator_id`,
        )
        .where(`${CircleChargebackEntity.table}.id`, chargebackId)
        .select(
          `${PayinEntity.table}.*`,
          `${CreatorShareEntity.table}.amount as creator_amount`,
          `${CreatorShareEntity.table}.creator_id`,
          `${CreatorAgencyEntity.table}.rate`,
        )
        .first()
      if (!payin) {
        throw new InternalServerErrorException('cant find payin to chargeback')
      }
      const payinInput = JSON.parse(payin.callback_input_json)
      const payinOutput = JSON.parse(payin.callback_output_json)
      // TODO: revoke post access for subscriptions
      switch (payin.callback) {
        case PayinCallbackEnum.TIPPED_MESSAGE:
          await this.messagesService.revertMessage(payinInput.tippedMessageId)
          break
        case PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS:
        case PayinCallbackEnum.CREATE_NFT_SUBSCRIPTION_PASS:
        case PayinCallbackEnum.RENEW_NFT_PASS:
          await this.passService.revertPassHolder(payinOutput.passHolderId)
          break
        case PayinCallbackEnum.PURCHASE_POST:
          await this.postService.revertPostPurchase(
            payinInput.postId,
            payin.id,
            payin.amount,
          )
          break
        case PayinCallbackEnum.PURCHASE_DM:
          await this.messagesService.revertMessagePurchase(
            payinInput.messageId,
            payinInput.paidMessageId,
            payin.amount,
          )
          break
        case PayinCallbackEnum.TIP_POST:
          await this.postService.deleteTip(
            payin.user_id,
            payinInput.postId,
            payinInput.amount,
          )
          break
      }

      const rate = payin.rate ?? 0
      await this.creatorStatsService.handleChargebackSuccess(
        payin.user_id,
        payin.creator_id,
        {
          [EarningCategoryEnum.NET]: payin.creator_amount * (1 - rate),
          [EarningCategoryEnum.GROSS]: payin.amount,
          [EarningCategoryEnum.AGENCY]: payin.creator_amount * rate,
        },
      )
    }
  }
}
