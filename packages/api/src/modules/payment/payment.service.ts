import { EntityRepository, wrap } from '@mikro-orm/core'
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

import { EVM_ADDRESS } from '../eth/eth.addresses'
import { SOL_ACCOUNT } from '../sol/sol.accounts'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { CircleConnector } from './circle'
import { CircleNotificationDto } from './dto/circle/circle-notification.dto'
import { CreateBankDto } from './dto/circle/create-bank.dto'
import { CreateCardDto } from './dto/circle/create-card.dto'
import { CreateCardPaymentDto } from './dto/circle/create-card-payment.dto'
import { EncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { PaymentDto } from './dto/circle/payment.dto'
import { CircleStatusDto } from './dto/circle/status.dto'
import {
  CircleCardPayinEntryInputDto,
  CircleCardPayinEntryOutputDto,
} from './dto/payin-entry/circle-card.payin-entry.dto'
import { MetamaskCircleETHEntryOutputDto } from './dto/payin-entry/metamask-circle-eth.payin-entry.dto'
import { MetamaskCircleUSDCEntryOutputDto } from './dto/payin-entry/metamask-circle-usdc.payin-entry.dto'
import {
  PayinEntryInputDto,
  PayinEntryOutputDto,
} from './dto/payin-entry/payin-entry.dto'
import {
  PhantomCircleUSDCEntryInputDto,
  PhantomCircleUSDCEntryOutputDto,
} from './dto/payin-entry/phantom-circle-usdc.payin-entry.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import {
  RegisterPaymentRequestDto,
  RegisterPaymentResponseDto,
} from './dto/register-payment.dto'
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
import { CircleRequestError, CircleResponseError } from './error/circle.error'
import {
  InvalidRequestPaymentRequest,
  NoPayinMethodError,
} from './error/payin.error'
import { handleFailedCallbacks } from './payment.payin'

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

  EVM_USDC_CHAINIDS = {
    mainnet: [1, 137, 43114],
    testnet: [5, 80001, 43113],
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
  ): Promise<CircleStatusDto> {
    const checkCard = await this.circleCardRepository.findOne({
      idempotencyKey: createCardDto.idempotencyKey,
    })
    if (checkCard !== null) {
      throw new CircleRequestError('reused idempotency key')
    }

    const card = new CircleCardEntity()
    card.user = await this.userService.findOne(userid)
    card.expMonth = createCardDto.expMonth
    card.expYear = createCardDto.expYear
    card.fourDigits = fourDigits
    card.name = createCardDto.billingDetails.name

    //automatically fill in metadata
    createCardDto.metadata.email = card.user.email
    createCardDto.metadata.ipAddress = ip

    const response = await this.circleConnector.createCard(createCardDto)

    card.circleCardId = response['id']
    card.status = CirclePaymentStatusEnum[response['status']]
    await this.circleCardRepository.persistAndFlush(card)

    return { id: card.circleCardId, status: card.status }
  }

  /**
   * get status of added card
   *
   * @param cardId
   * @returns
   */
  async checkCircleCardStatus(cardId: string): Promise<CircleStatusDto> {
    const card = await this.circleCardRepository.findOneOrFail({
      id: cardId,
    })
    if (card.status == CircleAccountStatusEnum.PENDING) {
      const response = await this.circleConnector.getCardById(cardId)
      card.status = response['status']
      await this.circleBankRepository.persistAndFlush(card)
    }
    return { id: card.circleCardId, status: card.status }
  }

  /**
   * delete existing card
   * remove card from moment system but it still exists in circle system
   *
   * @param id
   * @returns
   */
  async deleteCircleCard(userId: string, cardId: string): Promise<boolean> {
    const user: UserEntity = await this.userService.findOne(userId)
    const cardToRemove = await this.circleCardRepository.findOneOrFail({
      id: cardId,
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

  async makeCircleCardPayment(
    ip: string,
    sessionId: string,
    payment: PaymentEntity,
  ): Promise<CircleStatusDto> {
    const user = await wrap(payment.user).init()
    const card = await this.circleCardRepository.findOneOrFail({
      id: payment.payinMethodId,
    })
    const circlePayment = new CirclePaymentEntity()
    const createCardPaymentDto: CreateCardPaymentDto = {
      idempotencyKey: v4(),
      amount: {
        amount: payment.amount.toFixed(2),
        currency: 'USD',
      },
      source: {
        id: payment.payinMethodId,
        type: 'card',
      },
      metadata: {
        ipAddress: ip,
        email: user.email,
        sessionId: sessionId,
      },
      verification: 'none',
    }

    circlePayment.idempotencyKey = createCardPaymentDto.idempotencyKey
    circlePayment.amount = createCardPaymentDto.amount.amount
    circlePayment.card = card
    circlePayment.status = CirclePaymentStatusEnum.UNKOWN
    circlePayment.verification = CircleCardVerificationEnum.NONE
    circlePayment.source = CirclePaymentSourceEnum.CARD
    // save first so we have a record in db
    await this.circleCardRepository.persistAndFlush(payment)

    const response = await this.circleConnector.createPayment(
      createCardPaymentDto,
    )

    circlePayment.circlePaymentId = response['id']
    circlePayment.status = CirclePaymentStatusEnum[response['status']]
    await this.circleCardRepository.persistAndFlush(payment)

    return { id: circlePayment.circlePaymentId, status: circlePayment.status }
  }

  /**
   * check status for payment
   * @param paymentId
   * @returns
   */
  async checkCirclePaymentStatus(paymentId: string): Promise<CircleStatusDto> {
    const payment = await this.circlePaymentRepository.findOneOrFail({
      id: paymentId,
    })

    // if payment is not in an end state, try to get an update
    if (
      !(
        payment.status in
        [CirclePaymentStatusEnum.PAID, CirclePaymentStatusEnum.FAILED]
      )
    ) {
      const response = await this.circleConnector.getPaymentById(paymentId)
      payment.status = response['status']
      await this.circlePaymentRepository.persistAndFlush(payment)
    }
    return { id: payment.circlePaymentId, status: payment.status }
  }

  /**
   * get new depositable solana address from Circle
   *
   * @param userId
   * @param createAddressDto
   * @returns solana address
   */
  async getCircleAddress(currency: string, chain: string): Promise<string> {
    const response = await this.circleConnector.createAddress(
      this.configService.get('circle.master_wallet_id') as string,
      { idempotencyKey: v4(), currency, chain },
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
  ): Promise<CircleStatusDto> {
    const checkBank = await this.circleBankRepository.findOneOrFail({
      idempotencyKey: createBankDto.idempotencyKey,
    })
    if (checkBank !== null) {
      throw new CircleRequestError('reused idempotency key')
    }

    const response = await this.circleConnector.createBank(createBankDto)

    // register new bank to db after creation
    const bank = new CircleBankEntity()
    const user: UserEntity = await this.userService.findOne(userId)
    bank.user = user
    bank.status = response['status']
    bank.description = response['description']
    bank.trackingRef = response['trackingRef']
    bank.fingerprint = response['fingerprint']
    bank.circleBankId = response['id']
    await this.circleBankRepository.persistAndFlush(bank)

    return { id: bank.circleBankId, status: bank.status }
  }

  /**
   * get status of added bank for wire transfers (for creators)
   * @param bankId
   * @returns
   */
  async checkCircleWireBankStatus(bankId: string): Promise<CircleStatusDto> {
    const bank = await this.circleBankRepository.findOneOrFail({
      id: bankId,
    })

    // if last known status is pending, check for updates
    if (bank.status == CircleAccountStatusEnum.PENDING) {
      const response = await this.circleConnector.getBankById(bankId)
      bank.status = response['status']
      await this.circleBankRepository.persistAndFlush(bank)
    }

    return { id: bank.circleBankId, status: bank.status }
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

  //   await this.cardRepository.persistAndFlush(payment)
  //   const response = await createPayment(this.instance, createCardPaymentDto)

  //   assert((await response.status) == 201)
  //   payment.status = PaymentStatusEnum[response['status']]
  //   payment.circlePaymentId = response['id']

  //   await this.cardRepository.persistAndFlush(payment)
  //   const paymentDto = new PaymentDto()
  //   paymentDto.id = payment.circlePaymentId
  //   paymentDto.status = payment.status
  //   return paymentDto
  // }

  /*
  -------------------------------------------------------------------------------
  Notifications
  -------------------------------------------------------------------------------
  */
  async processCircleUpdate(update: CircleNotificationDto) {
    //log new notification in DB
    const newNotification = new CircleNotificationEntity()
    newNotification.clientId = update.clientId
    newNotification.notificationType = update.notificationType
    newNotification.fullContent = JSON.stringify(update)
    await this.circleNotificationRepository.persistAndFlush(newNotification)

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
    await this.circleCardRepository.persistAndFlush(cardEntity)
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
      await this.circlePaymentRepository.persistAndFlush(checkPayment)
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
      await this.circlePaymentRepository.persistAndFlush(paymentEntity)
    }
  }

  /*
  -------------------------------------------------------------------------------
  PAYIN ENTRYPOINTS (one for each PayinMethodEnum)
  -------------------------------------------------------------------------------
  */
  async payinEntryHandler(
    userId: string,
    entryDto: PayinEntryInputDto,
  ): Promise<PayinEntryOutputDto> {
    const payment = await this.paymentRepository.findOneOrFail({
      id: entryDto.paymentId,
      user: userId,
      paymentStatus: PaymentStatusEnum.CREATED,
    })

    try {
      payment.paymentStatus = PaymentStatusEnum.CREATED
      await this.paymentRepository.persistAndFlush(payment)

      switch (payment.payinMethod) {
        case PayinMethodEnum.CIRCLE_CARD:
          return await this.entryCircleCard(
            payment,
            entryDto as CircleCardPayinEntryInputDto,
          )
        case PayinMethodEnum.PHANTOM_CIRCLE_USDC:
          return await this.entryPhantomCircleUSDC(
            payment,
            entryDto as PhantomCircleUSDCEntryInputDto,
          )
        case PayinMethodEnum.METAMASK_CIRCLE_USDC:
          return await this.entryMetamaskCircleUSDC(payment)
        case PayinMethodEnum.METAMASK_CIRCLE_ETH:
          return await this.entryMetamaskCircleETH(payment)
        default:
          throw new NoPayinMethodError('entrypoint hit with no method')
      }
    } catch (e) {
      await this.failPayment(payment)
      throw e
    }
  }

  async entryCircleCard(
    payment: PaymentEntity,
    entryDto: CircleCardPayinEntryInputDto,
  ): Promise<CircleCardPayinEntryOutputDto> {
    const status = await this.makeCircleCardPayment(
      entryDto.ip,
      entryDto.sessionId,
      payment,
    )
    return { paymentId: payment.id, status }
  }

  async entryPhantomCircleUSDC(
    payment: PaymentEntity,
    entryDto: PhantomCircleUSDCEntryInputDto,
  ): Promise<PhantomCircleUSDCEntryOutputDto> {
    // link address to payment to identify circle external transfers to our payments
    await this.linkAddressToPayment(
      await this.getCircleAddress('USD', 'SOL'),
      payment,
    )
    return {
      paymentId: payment.id,
      message: await this.generateSolanaUSDCTransactionMessage(
        payment,
        entryDto.ownerAccount,
      ),
    }
  }

  async entryMetamaskCircleUSDC(
    payment: PaymentEntity,
  ): Promise<MetamaskCircleUSDCEntryOutputDto> {
    const chain = parseInt(payment.payinMethodId as string)
    const address = EVM_ADDRESS[chain].USDC
    // link address to payment to identify circle external transfers with our payments
    await this.linkAddressToPayment(
      await this.getCircleAddress('USD', 'ETH'),
      payment,
    )
    return { paymentId: payment.id, address, chain }
  }

  async entryMetamaskCircleETH(
    payment: PaymentEntity,
  ): Promise<MetamaskCircleETHEntryOutputDto> {
    // link address to payment to identify circle external transfers to our payments
    await this.linkAddressToPayment(
      await this.getCircleAddress('ETH', 'ETH'),
      payment,
    )
    return { paymentId: payment.id }
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

  /**
   * generate SOL transaction to send USDC to a source destination
   *
   * @param amount
   * @param destinationAddress
   */
  async generateSolanaUSDCTransactionMessage(
    payment: PaymentEntity,
    ownerAccount: string,
  ): Promise<Uint8Array> {
    const SOLANA_MAINNET_USDC_PUBKEY: string =
      SOL_ACCOUNT[this.configService.get('blockchain.networks')].USDC
    const connection = new Connection(
      this.configService.get('alchemy.sol_https_endpoint') as string,
    )

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
    if (defaultPayinMethod.method == PayinMethodEnum.CIRCLE_CARD) {
      // methodId is id of CircleCardEntity
      const card = await this.circleCardRepository.findOne({
        user: userId,
        active: true,
        id: defaultPayinMethod.methodId,
      })
      isValid = card !== null
    } else if (
      defaultPayinMethod.method == PayinMethodEnum.METAMASK_CIRCLE_USDC
    ) {
      // methodId is chainId of EVM chain
      isValid =
        defaultPayinMethod.methodId !== undefined &&
        parseInt(defaultPayinMethod.methodId) in
          this.EVM_USDC_CHAINIDS[this.configService.get('blockchain.networks')]
    }

    if (!isValid) {
      throw new NoPayinMethodError('default value is invalid')
    }

    return new PayinMethodDto(defaultPayinMethod)
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
    request: RegisterPaymentRequestDto,
  ): Promise<RegisterPaymentResponseDto> {
    // create and save a payment with REGISTERED status
    const payment = new PaymentEntity()

    // validating request
    payment.user = await this.userService.findOne(request.userId)
    if (request.amount < 0 || (request.amount * 100) % 1 !== 0) {
      throw new InvalidRequestPaymentRequest(
        'invalid amount value ' + request.amount,
      )
    }
    payment.amount = request.amount
    payment.callback = request.callback
    payment.callbackInputJSON = request.callbackInputJSON
    payment.paymentStatus = PaymentStatusEnum.REGISTERED
    payment.callbackSuccess = undefined
    await this.paymentRepository.persistAndFlush(payment)

    // use default payin method
    // throws an error if no payin method exists
    const payinMethod = await this.getDefaultPayinMethod(payment.user.id)
    payment.payinMethod = payinMethod.method
    payment.payinMethodId = payinMethod.methodId

    // save provider's id to internal payment object REQUESTED
    await this.paymentRepository.persistAndFlush(payment)
    return {
      paymentId: payment.id,
      method: payment.payinMethod,
    }
  }

  async failPayment(payment: PaymentEntity) {
    payment.paymentStatus = PaymentStatusEnum.FAILED
    await this.paymentRepository.persistAndFlush(payment)
    handleFailedCallbacks(payment, this.paymentRepository)
  }
}
