import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { EVM_ADDRESS } from '../eth/eth.addresses'
import { PassService } from '../pass/pass.service'
import { SOL_ACCOUNT, SOL_NETWORK } from '../sol/sol.accounts'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { CircleConnector } from './circle'
import { CircleBankDto } from './dto/circle/circle-bank.dto'
import { CircleCardDto } from './dto/circle/circle-card.dto'
import {
  CircleNotificationDto,
  GenericCircleObjectWrapper,
} from './dto/circle/circle-notification.dto'
import { CirclePaymentDto } from './dto/circle/circle-payment.dto'
import { CircleTransferDto } from './dto/circle/circle-transfer.dto'
import { CircleCreateBankDto } from './dto/circle/create-bank.dto'
import { CircleCreateCardDto } from './dto/circle/create-card.dto'
import { CircleCreateCardPaymentDto } from './dto/circle/create-card-payment.dto'
import { CircleCreatePayoutDto } from './dto/circle/create-circle-payout.dto'
import { CircleCreateTransferDto } from './dto/circle/create-circle-transfer.dto'
import { CircleEncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { CircleStatusDto } from './dto/circle/status.dto'
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
import { PayinListRequestDto, PayinListResponseDto } from './dto/payin-list.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import { PayoutDto } from './dto/payout.dto'
import { PayoutMethodDto } from './dto/payout-method.dto'
import {
  RegisterPayinRequestDto,
  RegisterPayinResponseDto,
} from './dto/register-payin.dto'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { CirclePayoutEntity } from './entities/circle-payout.entity'
import { CircleTransferEntity } from './entities/circle-transfer.entity'
import { CreatorShareEntity } from './entities/creator-share.entity'
import { DefaultPayinMethodEntity } from './entities/default-payin-method.entity'
import { DefaultPayoutMethodEntity } from './entities/default-payout-method.entity'
import { PayinEntity } from './entities/payin.entity'
import { PayoutEntity } from './entities/payout.entity'
import { CircleAccountStatusEnum } from './enum/circle-account.status.enum'
import { CircleCardVerificationEnum } from './enum/circle-card.verification.enum'
import { CircleNotificationTypeEnum } from './enum/circle-notificiation.type.enum'
import { CirclePaymentStatusEnum } from './enum/circle-payment.status.enum'
import { CircleTransferStatusEnum } from './enum/circle-transfer.status.enum'
import { PayinMethodEnum } from './enum/payin.enum'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { PayoutMethodEnum } from './enum/payout.enum'
import { PayoutStatusEnum } from './enum/payout.status.enum'
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
import {
  handleCreationCallback,
  handleFailedCallbacks,
  handleSuccesfulCallbacks,
} from './payment.payin'

export const MAX_CARDS_PER_USER = 10
export const MAX_BANKS_PER_USER = 5
export const MAX_TIME_BETWEEN_PAYOUTS_SECONDS = 60 // TODO: change to  60 * 60 * 24 * 7

@Injectable()
export class PaymentService {
  circleConnector: CircleConnector
  circleMasterWallet: string
  passService: PassService
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private moduleRef: ModuleRef,
  ) {
    this.circleConnector = new CircleConnector(this.configService)
    this.circleMasterWallet = this.configService.get(
      'circle.master_wallet_id',
    ) as string
  }

  async onModuleInit() {
    this.passService = this.moduleRef.get(PassService, { strict: false })
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
  async getCircleEncryptionKey(): Promise<CircleEncryptionKeyDto> {
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
  ): Promise<CircleStatusDto> {
    if (
      await this.dbReader(CircleCardEntity.table)
        .where(
          CircleCardEntity.toDict<CircleCardEntity>({
            idempotencyKey: createCardDto.idempotencyKey,
          }),
        )
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbReader
      .table(CircleCardEntity.table)
      .whereNotNull('deleted_at')
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
      circleCardId: response['id'],
      status: response['status'],
      name: createCardDto.billingDetails.name,
      ...createCardDto,
    })

    await this.dbWriter(CircleCardEntity.table).insert(data)

    return { id: data.circleCardId, status: data.status }
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
  ): Promise<CircleStatusDto> {
    const card = await this.dbReader(CircleCardEntity.table)
      .where({
        id: payin.cardId,
      })
      .select('id', 'circle_card_id')
      .first()

    const createCardPaymentDto: CircleCreateCardPaymentDto = {
      idempotencyKey: v4(),
      amount: {
        amount: payin.amount.toFixed(2),
        currency: 'USD',
      },
      source: {
        id: card.circle_card_id,
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
          circlePaymentId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return { id: response['id'], status: response['status'] }
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
    createBankDto: CircleCreateBankDto,
  ): Promise<CircleStatusDto> {
    if (
      await this.dbReader(CircleBankEntity.table)
        .where(
          CircleBankEntity.toDict<CircleBankEntity>({
            idempotencyKey: createBankDto.idempotencyKey,
          }),
        )
        .first()
    ) {
      throw new CircleRequestError('reused idempotency key')
    }

    const count = await this.dbReader
      .table(CircleBankEntity.table)
      .whereNotNull('deleted_at')
      .andWhere('user_id', userId)
      .count()
    if (count[0]['count(*)'] >= MAX_BANKS_PER_USER) {
      throw new BadRequestException(`${MAX_BANKS_PER_USER} bank limit reached`)
    }

    const response = await this.circleConnector.createBank(createBankDto)
    await this.dbWriter(CircleBankEntity.table).insert(
      CircleBankEntity.toDict<CircleBankEntity>({
        id: v4(),
        user: userId,
        status: response['status'],
        description: response['description'],
        trackingRef: response['trackingRef'],
        fingerprint: response['fingerprint'],
        circleBankId: response['id'],
      }),
    )

    return { id: response['id'], status: response['status'] }
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
        CircleCardEntity.toDict<CircleCardEntity>({
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
  ): Promise<CircleStatusDto> {
    const bank = await this.dbReader(CircleBankEntity.table)
      .where({
        id: payout.bankId,
        user_id: userId,
      })
      .select('id', 'circle_bank_id')
      .first()

    const user = await this.dbReader(UserEntity.table)
      .where({
        id: userId,
      })
      .select('email')
      .first()

    const createPayoutDto: CircleCreatePayoutDto = {
      idempotencyKey: v4(),
      source: {
        type: 'wallet',
        id: this.circleMasterWallet,
      },
      destination: {
        type: 'wire',
        id: bank.circle_bank_id,
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
          circlePayoutId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return { id: response['id'], status: response['status'] }
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
  ): Promise<CircleStatusDto> {
    const wallet = await this.dbReader(WalletEntity.table)
      .where('id', payout.walletId)
      .andWhere('user_id', userId)
      .select('*')
      .first()

    const createTransferDto: CircleCreateTransferDto = {
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
        id: wallet.circle_bank_id,
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
          circleTransferId: response['id'],
          status: response['status'],
        }),
      )
      .where({ id: data.id })

    return { id: response['id'], status: response['status'] }
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
      this.logger.error(`Error processing notification ${id}: ${e}`)
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
        CircleBankEntity.toDict<CircleBankEntity>({ circleBankId: wireDto.id }),
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
        CircleCardEntity.toDict<CircleCardEntity>({ circleCardId: cardDto.id }),
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
      .where('circle_payment_id', paymentDto.id)
      .first()

    if (!payin) {
      throw new CircleNotificationError('notification for unrecorded payin')
    }

    await this.dbWriter(CirclePaymentEntity.table)
      .where('circle_payment_id', paymentDto.id)
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
      .where('circle_payout_id', payoutDto.id)
      .first()

    if (!payout) {
      throw new CircleNotificationError('notification for unrecorded payout')
    }

    await this.dbWriter(CirclePayoutEntity.table)
      .where('circle_payout_id', payoutDto.id)
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
        this.CIRCLE_EVM_MAP[this.getBlockchainSelector()][
          transferDto.source.chain
        ]
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
      .where('circle_transfer_id', transferDto.id)
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
    const res = await this.dbReader(PayinEntity.table)
      .select('*')
      .where(
        PayinEntity.toDict<PayinEntity>({
          id: entryDto.payinId,
          user: userId,
          payinStatus: PayinStatusEnum.REGISTERED,
        }),
      )
      .first()
    if (!res) {
      throw new InvalidPayinStatusError(
        'payin ' + entryDto.payinId + ' is not available for entry',
      )
    }
    const payin = new PayinDto(res)
    let ret: PayinEntryResponseDto
    try {
      switch (payin.payinMethod) {
        case PayinMethodEnum.CIRCLE_CARD:
          ret = await this.entryCircleCard(
            payin,
            entryDto as CircleCardPayinEntryRequestDto,
          )
          break
        case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
          ret = await this.entryPhantomCircleUSDC(payin)
          break
        case PayinMethodEnum.METAMASK_CIRCLE_USDC:
          ret = await this.entryMetamaskCircleUSDC(payin)
          break
        case PayinMethodEnum.METAMASK_CIRCLE_ETH:
          ret = await this.entryMetamaskCircleETH(payin)
          break
        default:
          throw new NoPayinMethodError('entrypoint hit with no method')
      }

      await this.dbWriter(PayinEntity.table)
        .update({ payin_status: PayinStatusEnum.CREATED })
        .where({ id: entryDto.payinId })
    } catch (e) {
      await this.unregisterPayin(payin.id, userId)
      throw e
    }

    await handleCreationCallback(payin, this, this.dbWriter)
    return ret
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
    const chainId = payin.chainId as number
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
    const chainId = payin.chainId as number
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

  CIRCLE_EVM_MAP = {
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

  getBlockchainSelector(): string {
    return this.configService.get('blockchain.networks') as string
  }

  getEvmChainIdsUSDC(): number[] {
    return this.EVM_USDC_CHAINIDS[this.getBlockchainSelector()]
  }

  getEvmChainIdsNative(): number[] {
    return this.EVM_NATIVE_CHAINIDS[this.getBlockchainSelector()]
  }

  /*
  -------------------------------------------------------------------------------
  GENERAL
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
    await this.dbWriter(DefaultPayinMethodEntity.table)
      .insert({
        id: v4(),
        user_id: userId,
        method: payinMethoDto.method,
        card_id: payinMethoDto.cardId,
        chain_id: payinMethoDto.chainId,
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
      .where('user_id', userId)
      .select('*')
      .first()

    if (!defaultPayinMethod) {
      throw new NoPayinMethodError('no default exists')
    }

    let isValid = false
    switch (defaultPayinMethod.method) {
      case PayinMethodEnum.CIRCLE_CARD:
        // assert that card exists and is not deleted
        isValid =
          (await this.dbReader(CircleCardEntity.table)
            .where(
              CircleCardEntity.toDict<CircleCardEntity>({
                user: userId,
                id: defaultPayinMethod.card_id,
                status: CircleAccountStatusEnum.COMPLETE,
              }),
            )
            .whereNull('deleted_at')
            .select('id')
            .first()) !== undefined
        break
      case PayinMethodEnum.METAMASK_CIRCLE_USDC:
        // metamask payin must be on an approved chainId
        isValid = this.getEvmChainIdsUSDC().includes(
          defaultPayinMethod.chain_id,
        )
        break
      case PayinMethodEnum.METAMASK_CIRCLE_ETH:
        // metamask payin must be on an approved chainId
        isValid = this.getEvmChainIdsNative().includes(
          defaultPayinMethod.chain_id,
        )
        break
      case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
        isValid = true
        break
    }

    if (!isValid) {
      throw new NoPayinMethodError('default value is invalid')
    }

    return new PayinMethodDto(defaultPayinMethod)
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
      .insert({
        id: v4(),
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
      .where('user_id', userId)
      .select('*')
      .first()

    if (!defaultPayoutMethod) {
      throw new NoPayinMethodError('no default exists')
    }

    let isValid = false
    switch (defaultPayoutMethod.method) {
      case PayoutMethodEnum.CIRCLE_WIRE:
        // assert that bank exists and is not deleted
        isValid =
          (await this.dbReader(CircleBankEntity.table)
            .where(
              CircleCardEntity.toDict<CircleCardEntity>({
                user: userId,
                id: defaultPayoutMethod.bank_id,
                status: CircleAccountStatusEnum.COMPLETE,
              }),
            )
            .whereNull('deleted_at')
            .select('id')
            .first()) !== undefined
        break
      case PayoutMethodEnum.CIRCLE_USDC:
        // blockchain payout must be on an approved chain
        isValid = this.VALID_PAYOUT_CHAINS.includes(
          (
            await this.dbReader(WalletEntity.table)
              .where({ user_id: userId, id: defaultPayoutMethod.wallet_id })
              .select('chain')
              .first()
          ).chain.toUpperCase(),
        )
        break
    }

    if (!isValid) {
      throw new NoPayinMethodError('default value is invalid')
    }

    return new PayoutMethodDto(defaultPayoutMethod)
  }

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

    const payinMethod = request.payinMethod
      ? request.payinMethod
      : await this.getDefaultPayinMethod(request.userId)

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
    }

    await this.dbWriter(PayinEntity.table).insert(data)

    try {
      // validate the parameters of the shares
      let sum = 0
      for (const creatorShareDto of request.creatorShares) {
        const creator = await this.dbReader(UserEntity.table)
          .where('id', creatorShareDto.creatorId)
          .first()

        if (!creator.is_creator) {
          throw new InvalidPayinRequestError('regular users can not earn money')
        }
        if (creatorShareDto.amount <= 0) {
          throw new InvalidPayinRequestError(
            'creator must have positive earning',
          )
        }
        sum += creatorShareDto.amount
        if (sum > request.amount) {
          throw new InvalidPayinRequestError(
            'creators can not earn more than total payment',
          )
        }
      }

      // create shares of payment profit that would go to creators
      for (const creatorShareDto of request.creatorShares) {
        await this.dbWriter(CreatorShareEntity.table).insert(
          CreatorShareEntity.toDict<CreatorShareEntity>({
            id: v4(),
            creator: creatorShareDto.creatorId,
            amount: creatorShareDto.amount,
            payin: data.id,
          }),
        )
      }
    } catch (e) {
      await this.unregisterPayin(data.id, request.userId)
      throw e
    }

    return {
      payinId: data.id,
      method: payinMethod.method,
      amount: request.amount,
    }
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
      await handleFailedCallbacks(payin, this, this.dbReader)
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
          ]),
        )
        .first()
      await handleSuccesfulCallbacks(payin, this, this.dbWriter)
    }
  }

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
    await this.dbWriter
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
  }

  /**
   * return paginated payin information for user display
   *
   * @param userId
   * @param payinListRequest
   * @returns
   */
  async getPayins(
    userId: string,
    payinListRequest: PayinListRequestDto,
  ): Promise<PayinListResponseDto> {
    const payins = await this.dbReader
      .table(PayinEntity.table)
      .where('user_id', userId)
      .andWhere('payin_status', 'not in', [
        PayinStatusEnum.REGISTERED,
        PayinStatusEnum.UNREGISTERED,
      ])
      .select('*')
      .orderBy('created_at', 'desc')
      .offset(payinListRequest.offset)
      .limit(payinListRequest.limit)
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
      map[card.id] = card
      return map
    }, {})
    const payinsDto = payins.map((payin) => {
      return new PayinDto(payin)
    })
    payinsDto.forEach((payinDto) => {
      if (payinDto.payinMethod === PayinMethodEnum.CIRCLE_CARD) {
        payinDto.card = new CircleCardDto(cardsMap[payinDto.cardId as string])
      }
    })
    return {
      count: parseInt(count[0]['count(*)']),
      payins: payinsDto,
    }
  }

  async payoutAll(): Promise<void> {
    const creators = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ isCreator: true }))
      .select('id')
    creators.forEach(async (creator) => {
      try {
        await this.payoutCreator(creator.id)
      } catch (e) {
        this.logger.error(`Error paying out ${creator.id}: ${e}`)
      }
    })
  }

  async payoutCreator(userId: string): Promise<void> {
    const time = new Date()
    const minDate = new Date(
      time.getTime() + 60 * MAX_TIME_BETWEEN_PAYOUTS_SECONDS,
    )
    const checkPayout = await this.dbReader(PayoutEntity.table).where(
      'created_at',
      '>=',
      minDate.toISOString(),
    )
    if (!checkPayout) {
      throw new BadRequestException(
        'Payout created for creator recently, try again later',
      )
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

    await Promise.all(
      creatorShares.map(async (creatorShare) => {
        await this.dbWriter.transaction(async (trx) => {
          await trx(PayoutEntity.table)
            .increment('amount', creatorShare.amount)
            .where('id', data.id)
          await trx(CreatorShareEntity.table)
            .update('payout_id', data.id)
            .where('id', creatorShare.id)
        })
      }),
    )
    await this.submitPayout(data.id)
  }

  /**
   * seperate function to submit payouts in case it fails and we need to resend
   * @param payout_id
   */
  async submitPayout(payout_id: string): Promise<void> {
    const payout = await this.dbReader(PayoutEntity.table)
      .where('id', payout_id)
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

  async aggregateAll(): Promise<void> {
    const creators = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ isCreator: true }))
      .select('id')
    creators.forEach(async (creator) => {
      try {
        await this.aggregateCreator(creator.id)
      } catch (e) {
        this.logger.error(`Error aggregating earnings for ${creator.id}: ${e}`)
      }
    })
  }

  async aggregateCreator(creatorId: string): Promise<void> {
    this.logger.info(creatorId)
    this.logger.info('aggregate')
  }
  // TESTING FOR AWS BATCH IN STAGING, WILL REMOVE
  // async printTest(): Promise<void> {
  //   console.log('print')
  //   console.log(
  //     await this.dbReader(UserEntity.table).select('is_creator').first(),
  //   )
  // }
}
