import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { v4 } from 'uuid'

import { sol_accounts } from '../sol/sol.accounts'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { CircleConnector } from './circle'
import { CircleNotificationDto } from './dto/circle/circle-notification.dto'
import { CreateBankDto } from './dto/circle/create-bank.dto'
import { CreateCardDto } from './dto/circle/create-card.dto'
import { CreateCardPaymentDto } from './dto/circle/create-card-payment.dto'
import { EncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { PaymentDto } from './dto/circle/payment.dto'
import { StatusDto } from './dto/circle/status.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import { RegisterPaymentResponse } from './dto/register-payment-response.dto'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { DefaultPayinMethodEntity } from './entities/default-payin-method.entity'
import { DepositAddressEntity } from './entities/deposit-address.entity'
import { PaymentEntity } from './entities/payment.entity'
import { CircleAccountStatusEnum } from './enum/circle-account.status.enum'
import { CircleCardVerificationEnum } from './enum/circle-card.verification.enum'
import { CircleNotificationTypeEnum } from './enum/circle-notificiation.type.enum'
import { CirclePaymentSourceEnum } from './enum/circle-payment.source.enum'
import { CirclePaymentStatusEnum } from './enum/circle-payment.status.enum'
import { PayinMethodEnum } from './enum/payin.enum'
import { PaymentStatusEnum } from './enum/payment.status.enum'
import { CircleResponseError } from './error/circle.error'
import { NoPayinMethodError } from './error/payin.error'

@Injectable()
export class PaymentService {
  circleConnector: CircleConnector
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRepository(CircleCardEntity)
    private readonly circleCardRepository: EntityRepository<CircleCardEntity>,
    @InjectRepository(CirclePaymentEntity)
    private readonly circlePaymentRepository: EntityRepository<CirclePaymentEntity>,
    @InjectRepository(DepositAddressEntity)
    private readonly depositAddressRepository: EntityRepository<DepositAddressEntity>,
    @InjectRepository(CircleBankEntity)
    private readonly circleBankRepository: EntityRepository<CircleBankEntity>,
    @InjectRepository(CircleNotificationEntity)
    private readonly circleNotificationRepository: EntityRepository<CircleNotificationEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: EntityRepository<PaymentEntity>,
    @InjectRepository(DefaultPayinMethodEntity)
    private readonly defaultPayinMethodRepository: EntityRepository<DefaultPayinMethodEntity>,
  ) {
    this.circleConnector = new CircleConnector(this.configService)
  }

  /*
  -------------------------------------------------------------------------------
  CIRCLE
  -------------------------------------------------------------------------------
  */

  /**
   * get circle's public encryption key
   * @returns
   */
  async getCircleEncryptionKey(): Promise<EncryptionKeyDto> {
    const response = await this.circleConnector.getPCIPublicKey()
    return new EncryptionKeyDto(response['keyId'], response['publicKey'])
  }

  /**
   * create usable credit card using circle api, return status of creation
   * makes card the default card for user
   *
   * @param userid
   * @param createCardDto
   * @param fourDigits last 4 digits of credit card to save
   * @returns
   */
  async createCircleCard(
    ip: string,
    userid: string,
    createCardDto: CreateCardDto,
    fourDigits: string,
  ): Promise<StatusDto> {
    console.log(createCardDto)
    const user: UserEntity = await this.userService.findOne(userid)

    //automatically fill in metadata
    createCardDto.metadata.email = user.email
    createCardDto.metadata.ipAddress = ip

    const response = await this.circleConnector.createCard(createCardDto)

    const cardId = response['id']
    const cardEntity = await this.circleCardRepository.findOne({
      circleCardId: cardId,
      user: user,
    })

    // card could exist if accidental multiple inputs
    // only make new card if does not exist in system

    // we don't need to worry about multiple sends to circle as the idempotencyKey ensures no repeats
    if (cardEntity === null) {
      const card = new CircleCardEntity()
      card.circleCardId = cardId
      card.status = response['status']
      card.user = user
      card.expMonth = createCardDto.expMonth
      card.expYear = createCardDto.expYear
      card.fourDigits = fourDigits
      card.name = createCardDto.billingDetails.name
      await this.circleCardRepository.persistAndFlush(card)
      return new StatusDto(cardId, card.status)
    }
    return new StatusDto(cardId, cardEntity.status)
  }

  /**
   * get status of added card
   * @param cardId
   * @returns
   */
  async checkCircleCardStatus(cardId: string): Promise<StatusDto> {
    const card = await this.circleCardRepository.findOneOrFail({
      circleCardId: cardId,
    })
    if (card.status == CircleAccountStatusEnum.PENDING) {
      const response = await this.circleConnector.getCardById(cardId)
      card.status = response['status']
      this.circleBankRepository.persistAndFlush(card)
    }
    return new StatusDto(cardId, card.status)
  }

  /**
   * delete existing card
   * select new default if card is deafult
   * remove card from moment system but it still exists in circle system
   *
   * @param id
   * @returns
   */
  async deleteCircleCard(
    userId: string,
    circleCardId: string,
  ): Promise<boolean> {
    const user: UserEntity = await this.userService.findOne(userId)
    const cardToRemove = await this.circleCardRepository.findOneOrFail({
      circleCardId: circleCardId,
      user: user,
    })
    cardToRemove.active = false
    await this.circleCardRepository.persistAndFlush(cardToRemove)

    return true
  }

  /**
   * get all active cards you registered with moment
   * @param userid
   * @returns
   */
  async getCircleCards(userId: string): Promise<CircleCardEntity[]> {
    const user: UserEntity = await this.userService.findOne(userId)

    return await this.circleCardRepository.find({
      user: user,
      active: true,
    })
  }

  /**
   * make fiat payment with card
   * @param userid
   * @param createCardPaymentDto
   * @returns
   */
  async makeCircleCardPayment(
    ip: string,
    userId: string,
    createCardPaymentDto: CreateCardPaymentDto,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userService.findOne(userId)

    //automatically fill in metadata
    createCardPaymentDto.metadata.email = user.email
    createCardPaymentDto.metadata.ipAddress = ip

    createCardPaymentDto.source.type = 'card'
    createCardPaymentDto.amount.currency = 'USD'

    // ensure no repeats on double submit
    await this.circlePaymentRepository.findOneOrFail({
      idempotencyKey: createCardPaymentDto.idempotencyKey,
    })

    const card = await this.circleCardRepository.findOneOrFail({
      circleCardId: createCardPaymentDto.source.id,
      active: true,
      user: user,
    })

    const payment = new CirclePaymentEntity()
    payment.idempotencyKey = createCardPaymentDto.idempotencyKey
    payment.amount = createCardPaymentDto.amount.amount
    payment.card = card as CircleCardEntity
    payment.status = CirclePaymentStatusEnum.UNKOWN
    payment.verification =
      CircleCardVerificationEnum[createCardPaymentDto.verification]()
    payment.source = CirclePaymentSourceEnum.CARD

    this.circleCardRepository.persistAndFlush(payment)
    const response = await this.circleConnector.createPayment(
      createCardPaymentDto,
    )

    payment.status = CirclePaymentStatusEnum[response['status']]
    payment.circlePaymentId = response['id']

    this.circleCardRepository.persistAndFlush(payment)
    return new StatusDto(payment.circlePaymentId, payment.status)
  }

  /**
   * check status for payment
   * @param paymentId
   * @returns
   */
  async checkCirclePaymentStatus(paymentId: string): Promise<StatusDto> {
    const payment = await this.circlePaymentRepository.findOneOrFail({
      circlePaymentId: paymentId,
    })

    // if payment is not in end state, try to get an update
    if (
      !(
        payment.status in
        [CirclePaymentStatusEnum.PAID, CirclePaymentStatusEnum.FAILED]
      )
    ) {
      const response = await this.circleConnector.getPaymentById(paymentId)
      payment.status = response['status']
      this.circlePaymentRepository.persistAndFlush(payment)
    }
    return new StatusDto(paymentId, payment.status)
  }

  /**
   * get depositable solana address from Circle
   *
   * @param userId
   * @param createAddressDto
   * @returns solana address
   */
  async getCircleAddress(): Promise<string> {
    const response = await this.circleConnector.createAddress(
      this.configService.get('circle.master_wallet_id') as string,
      { idempotencyKey: v4(), currency: 'USD', chain: 'SOL' },
    )
    return response['address']
  }

  /**
   * add wire bank accounts (for creators)
   * @param userid
   * @param createBankDto
   * @returns
   */
  async createCircleWireBankAccount(
    userId: string,
    createBankDto: CreateBankDto,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userService.findOne(userId)

    const response = await this.circleConnector.createBank(createBankDto)

    const bankId = response['id']
    await this.circleBankRepository.findOneOrFail({
      circleBankId: bankId,
      user: user,
    })

    // register new bank to db after creation
    const bank = new CircleBankEntity()
    bank.user = user
    bank.circleBankId = response['id']
    bank.status = response['status']
    bank.description = response['description']
    bank.trackingRef = response['trackingRef']
    bank.fingerprint = response['fingerprint']
    this.circleBankRepository.persistAndFlush(bank)

    return new StatusDto(bank.circleBankId, bank.status)
  }

  /**
   * get status of added bank for wire transfers (for creators)
   * @param bankId
   * @returns
   */
  async checkCircleWireBankStatus(bankId: string): Promise<StatusDto> {
    const bank = await this.circleBankRepository.findOneOrFail({
      circleBankId: bankId,
    })

    // if last known status is pending, check for updates
    if (bank.status == CircleAccountStatusEnum.PENDING) {
      const response = await this.circleConnector.getBankById(bankId)
      bank.status = response['status']
      this.circleBankRepository.persistAndFlush(bank)
    }

    return new StatusDto(bankId, bank.status)
  }

  // TODO: currently blocked on payout design
  //
  // /**
  //  * payout to all creators
  //  */
  // async makePayoutsToAll() {
  //   const users = await this.userRepository.find({ isCreator: true })
  //   for (const user of users) {
  //     this.makePayout(user.id)
  //   }
  // }

  // /**
  //  * makes a payout to a single creator
  //  * empties their gems at a 2:1 ratio (gem to usd)
  //  * @param userid
  //  * @returns
  //  */
  // async makePayout(userid: string): Promise<PaymentDto> {
  //   const user: UserEntity = await this.userRepository.findOneOrFail({
  //     id: userid,
  //   })

  //   createCardPaymentDto.metadata.email = user.email
  //   assert(createCardPaymentDto.source.type == 'card')
  //   const checkPayment = await this.paymentRepository.findOne({
  //     idempotencyKey: createCardPaymentDto.idempotencyKey,
  //   })
  //   assert(checkPayment == null)
  //   const card = await this.cardRepository.findOne({
  //     circleCardId: createCardPaymentDto.source.id,
  //   })
  //   assert(card !== null && card.active && card.user.id === user.id)

  //   const payment = new PaymentEntity()
  //   payment.idempotencyKey = createCardPaymentDto.idempotencyKey
  //   payment.amount = createCardPaymentDto.amount.amount
  //   payment.card = card as CardEntity
  //   payment.status = PaymentStatusEnum.UNKOWN
  //   payment.verification =
  //     CardVerificationEnum[createCardPaymentDto.verification]()
  //   payment.source = PaymentSourceEnum.CARD

  //   this.cardRepository.persistAndFlush(payment)
  //   const response = await createPayment(this.instance, createCardPaymentDto)

  //   assert((await response.status) == 201)
  //   payment.status = PaymentStatusEnum[response['status']]
  //   payment.circlePaymentId = response['id']

  //   this.cardRepository.persistAndFlush(payment)
  //   const paymentDto = new PaymentDto()
  //   paymentDto.id = payment.circlePaymentId
  //   paymentDto.status = payment.status
  //   return paymentDto
  // }

  async processCircleUpdate(update: CircleNotificationDto) {
    //log new notification in DB
    const newNotification = new CircleNotificationEntity()
    newNotification.clientId = update.clientId
    newNotification.notificationType = update.notificationType
    newNotification.fullContent = JSON.stringify(update)
    this.circleNotificationRepository.persistAndFlush(newNotification)

    //update information with notification
    switch (CircleNotificationTypeEnum[update.notificationType]) {
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
          //TODO: handle
          // eslint-disable-next-line sonarjs/no-duplicated-branches
        } else if (update.return) {
          //currently unhandled
        }
        break
      case CircleNotificationTypeEnum.CARDS:
        break
      case CircleNotificationTypeEnum.ACH:
        //currently unhandled
        break
      case CircleNotificationTypeEnum.WIRE:
        break
      case CircleNotificationTypeEnum.TRANSFERS:
        //currently unhandled
        break
      default:
        throw new CircleResponseError(
          "notification type unrecognized: API might've updated",
        )
        break
    }
  }
  /**
   * update card info
   * @param card type is 'any' since structure is unclear
   */
  async processCircleCardUpdate(card: any) {
    const id = card['id'] // property must exist
    const cardEntity = await this.circleCardRepository.findOneOrFail({
      circleCardId: id,
    })
    cardEntity.status = CircleAccountStatusEnum.COMPLETE
    this.circleCardRepository.persistAndFlush(cardEntity)
  }
  /**
   * update payment info
   * @param payment
   */
  async processCirclePaymentUpdate(payment: PaymentDto) {
    const checkPayment = await this.circlePaymentRepository.findOne({
      circlePaymentId: payment.id,
    })
    if (checkPayment != null) {
      checkPayment.status = CirclePaymentStatusEnum[payment.status]
      this.circlePaymentRepository.persistAndFlush(checkPayment)
    } else {
      const paymentEntity = new CirclePaymentEntity()
      paymentEntity.circlePaymentId = payment.id
      paymentEntity.amount = payment.amount.amount
      paymentEntity.status = CirclePaymentStatusEnum[payment.status]

      paymentEntity.source = CirclePaymentSourceEnum[payment.source.type]
      if (paymentEntity.source == CirclePaymentSourceEnum.CARD) {
        const checkCard = await this.circleCardRepository.findOneOrFail({
          circleCardId: payment.source.id,
        })
        paymentEntity.card = checkCard
      }
      this.circlePaymentRepository.persistAndFlush(paymentEntity)
    }
  }
  /*
  -------------------------------------------------------------------------------
  CRYPTO
  -------------------------------------------------------------------------------
  */

  async linkAddressToPayment(
    address: string,
    payment: PaymentEntity,
  ): Promise<void> {
    const depositAddress = new DepositAddressEntity()
    depositAddress.payment = payment
    depositAddress.address = address
    await this.depositAddressRepository.persistAndFlush(depositAddress)
  }

  /*
  -------------------------------------------------------------------------------
  GENERIC
  -------------------------------------------------------------------------------
  */

  /**
   * set default payment method
   * @param userId
   * @param method
   * @param methodId
   */
  async setDefaultPayinMethod(
    userId: string,
    method: PayinMethodEnum,
    methodId?: string,
  ): Promise<void> {
    let defaultPayinMethod = await this.defaultPayinMethodRepository.findOne({
      user: userId,
    })
    if (defaultPayinMethod == null) {
      defaultPayinMethod = new DefaultPayinMethodEntity()
      defaultPayinMethod.user = await this.userService.findOne(userId)
    }
    defaultPayinMethod.method = method
    defaultPayinMethod.methodId = methodId
    await this.defaultPayinMethodRepository.persistAndFlush(defaultPayinMethod)
  }

  /**
   * return default payin option of user if exists and valid
   * @param userId
   * @returns
   */
  async getDefaultPayinMethod(userId: string): Promise<PayinMethodDto> {
    const defaultPayinMethod = await this.defaultPayinMethodRepository.findOne({
      user: userId,
    })

    if (defaultPayinMethod == null) {
      throw new NoPayinMethodError('no default exists')
    }

    let isValid = false
    // all in browser wallets are valid
    if (defaultPayinMethod.method == PayinMethodEnum.CIRCLE_CARD) {
      const card = await this.circleCardRepository.findOne({
        user: userId,
        active: true,
        id: defaultPayinMethod.methodId,
      })
      isValid = card !== null
    }

    if (!isValid) {
      throw new NoPayinMethodError('default value is invalid')
    }

    return defaultPayinMethod.dto()
  }

  /**
   * called when pay button is pressed
   *
   * @param payment
   * fill in userId, amount, callback, and callbackInputJSON
   * @returns RegisterPaymentResponse
   * contains provider account type to respond appropriately to
   * Phantom and Metamask should ask for a transaction to sign
   */
  async registerPayment(
    payment: PaymentEntity,
  ): Promise<RegisterPaymentResponse> {
    // save payment first with status CREATED
    payment.paymentStatus = PaymentStatusEnum.CREATED
    payment.callbackSuccess = undefined
    this.paymentRepository.persistAndFlush(payment)

    // use default payin method
    // throw an error if no payin method exists
    const payinMethod = await this.getDefaultPayinMethod(payment.user.id)
    payment.payinMethod = payinMethod.method
    payment.payinMethodId = payinMethod.methodId

    switch (payment.payinMethod) {
      case PayinMethodEnum.CIRCLE_CARD:
        //TODO: create circle payment
        break
      case PayinMethodEnum.METAMASK_SOL_CIRCLE_USDC:
        this.linkAddressToPayment(await this.getCircleAddress(), payment)
        break
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
        this.linkAddressToPayment(await this.getCircleAddress(), payment)
        break
    }

    // save provider's id to internal payment object REQUESTED
    payment.paymentStatus = PaymentStatusEnum.REQUESTED
    await this.paymentRepository.persistAndFlush(payment)
    return {
      paymentId: payment.id,
      method: payment.payinMethod,
    }
  }

  /**
   * generate SOL transaction to send USDC to a source destination
   *
   * @param amount
   * @param destinationAddress
   */
  async generateSolanaUSDCTransactionMessage(
    paymentId: string,
    ownerAccount: string,
  ): Promise<Uint8Array> {
    const SOLANA_MAINNET_USDC_PUBKEY: string =
      sol_accounts[this.configService.get('sol.network')].USDC
    const connection = new Connection(
      this.configService.get('alchemy.sol_https_endpoint') as string,
    )
    const payment = await this.paymentRepository.findOneOrFail({
      id: paymentId,
    })
    const depositAddress = await this.depositAddressRepository.findOneOrFail({
      payment: payment.id,
    })

    const from = new PublicKey(ownerAccount)
    const transaction = new Transaction()
    const mint = new PublicKey(SOLANA_MAINNET_USDC_PUBKEY)
    const to = new PublicKey(depositAddress)

    const fromTokenAddress = await getAssociatedTokenAddress(mint, from)
    const toTokenAccountAddress = await getAssociatedTokenAddress(mint, to)
    try {
      await getAccount(connection, toTokenAccountAddress)
    } catch (e) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          toTokenAccountAddress,
          from,
          to,
          mint,
        ),
      )
    }

    transaction.add(
      createTransferInstruction(
        fromTokenAddress,
        toTokenAccountAddress,
        from,
        payment.amount * 10 ** 6,
        [],
        TOKEN_PROGRAM_ID,
      ),
    )

    return transaction.serializeMessage()
  }
}
