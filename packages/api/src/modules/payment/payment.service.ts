import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { get } from 'lodash'

import { GemService } from '../gem/gem.service'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import {
  createAddress,
  createBank,
  createCard,
  createPayment,
  getBankById,
  getCardById,
  getPaymentById,
  getPCIPublicKey,
  updateCard,
} from './circle'
import { CircleNotificationDto } from './dto/circle-notification.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { CreateBankDto } from './dto/create-bank.dto'
import { CreateCardDto } from './dto/create-card.dto'
import { CreateCardPaymentDto } from './dto/create-card-payment.dto'
import { EncryptionKeyDto } from './dto/encryption-key.dto'
import { PaymentDto } from './dto/payment.dto'
import { StatusDto } from './dto/status.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle-address.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { PaymentEntity } from './entities/payment.entity'
import { AccountStatusEnum } from './enum/account.status.enum'
import { CardVerificationEnum } from './enum/card.verification.enum'
import { CircleNotificationTypeEnum } from './enum/circle-notificiation.type.enum'
import { PaymentSourceEnum } from './enum/payment.source.enum'
import { PaymentStatusEnum } from './enum/payment.status.enum'
import {
  CircleResponseError,
  CircleResponseStatusError,
} from './error/circle.error'

@Injectable()
export class PaymentService {
  instance
  constructor(
    private readonly configService: ConfigService,
    private readonly gemService: GemService,
    private readonly userService: UserService,
    @InjectRepository(CardEntity)
    private readonly cardRepository: EntityRepository<CardEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: EntityRepository<PaymentEntity>,
    @InjectRepository(CircleAddressEntity)
    private readonly circleAddressRepository: EntityRepository<CircleAddressEntity>,
    @InjectRepository(BankEntity)
    private readonly bankRepository: EntityRepository<BankEntity>,
    @InjectRepository(CircleNotificationEntity)
    private readonly circleNotificationRepository: EntityRepository<CircleNotificationEntity>,
  ) {
    this.instance = axios.create({
      baseURL: configService.get('circle.api_endpoint'),
      headers: {
        Authorization: `Bearer ${configService.get('circle.api_key')}`,
      },
    })
    this.instance.interceptors.response.use(
      function (response) {
        if (get(response, 'data.data')) {
          return response.data.data
        }
        return response
      },
      function (error) {
        console.log(error)
        const status = error['response']['status']
        const message = error['response']['data']['message']
        return Promise.reject(new CircleResponseStatusError(message, status))
      },
    )
  }

  /**
   * get circle's public encryption key
   * @returns
   */
  async getEncryptionKey(): Promise<EncryptionKeyDto> {
    const response = await getPCIPublicKey(this.instance)
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
  async createCard(
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

    const response = await createCard(this.instance, createCardDto)

    const cardId = response['id']
    const cardEntity = await this.cardRepository.findOne({
      circleCardId: cardId,
      user: user,
    })

    // card could exist if accidental multiple inputs
    // only make new card if does not exist in system

    // we don't need to worry about multiple sends to circle as the idempotencyKey ensures no repeats
    if (cardEntity === null) {
      const card = new CardEntity()
      card.circleCardId = cardId
      card.status = response['status']
      card.user = user
      card.expMonth = createCardDto.expMonth
      card.expYear = createCardDto.expYear
      card.fourDigits = fourDigits
      card.name = createCardDto.billingDetails.name
      card.isDefault = true
      await this.cardRepository.persistAndFlush(card)
      const cards = await this.cardRepository.find({ user: user }) //replace user id with auth user id

      // removing all other defaults
      for (const otherCard of cards) {
        if (
          otherCard.isDefault &&
          otherCard.circleCardId != card.circleCardId
        ) {
          otherCard.isDefault = false
          this.cardRepository.persistAndFlush(otherCard)
        }
      }
      return new StatusDto(cardId, card.status)
    }
    return new StatusDto(cardId, cardEntity.status)
  }

  /**
   * get status of added card
   * @param cardId
   * @returns
   */
  async checkCardStatus(cardId: string): Promise<StatusDto> {
    const card = await this.cardRepository.findOneOrFail({
      circleCardId: cardId,
    })
    if (card.status == AccountStatusEnum.PENDING) {
      const response = await getCardById(this.instance, cardId)
      card.status = response['status']
      this.bankRepository.persistAndFlush(card)
    }
    return new StatusDto(cardId, card.status)
  }

  /**
   * get default card
   * @param userid
   * @returns
   */
  async getDefaultCard(userid: string): Promise<CardEntity | null> {
    const user: UserEntity = await this.userService.findOne(userid)

    return await this.cardRepository.findOne({
      user: user,
      isDefault: true,
      active: true,
    })
  }

  /**
   * set default card
   * @param userid
   * @param circleCardId
   * @returns
   */
  async setDefaultCard(userid: string, circleCardId: string): Promise<boolean> {
    const user: UserEntity = await this.userService.findOne(userid)

    const card = await this.cardRepository.findOne({
      circleCardId: circleCardId,
      user: user,
    })
    if (card == null) {
      return false
    }

    //remove all other default cards
    const cards = await this.cardRepository.find({ user: user })
    for (const otherCard of cards) {
      if (otherCard.isDefault && otherCard.circleCardId != card.circleCardId) {
        otherCard.isDefault = false
        this.cardRepository.persistAndFlush(otherCard)
      }
    }
    return true
  }

  /**
   * delete existing card
   * select new default if card is deafult
   * remove card from moment system but it still exists in circle system
   *
   * @param id
   * @returns
   */
  async deleteCard(userid: string, circleCardId: string): Promise<boolean> {
    const user: UserEntity = await this.userService.findOne(userid)
    const cardToRemove = await this.cardRepository.findOneOrFail({
      circleCardId: circleCardId,
      user: user,
    })
    cardToRemove.active = false
    await this.cardRepository.persistAndFlush(cardToRemove)

    // set new default if not existing
    const defaultCard = await this.cardRepository.findOne({
      user: user,
      active: true,
      isDefault: true,
    })
    if (!defaultCard) {
      const newDefaultCard = await this.cardRepository.findOne({
        user: user,
        active: true,
      })
      if (newDefaultCard) {
        newDefaultCard.isDefault = true
        this.cardRepository.persistAndFlush(newDefaultCard)
      }
    }

    return true
  }

  /**
   * get all active cards you registered with moment
   * @param userid
   * @returns
   */
  async getCards(userid: string): Promise<CardEntity[]> {
    const user: UserEntity = await this.userService.findOne(userid)

    return await this.cardRepository.find({
      user: user,
      active: true,
    })
  }

  /**
   * DEPRECATED
   * update registered card information
   * @param id
   * @param updateCardDto
   */
  async updateCard(id: string, updateCardDto: UpdateCardDto): Promise<number> {
    return await (
      await updateCard(this.instance, id, updateCardDto)
    ).status
  }

  /**
   * make fiat payment with card
   * @param userid
   * @param createCardPaymentDto
   * @returns
   */
  async makeCardPayment(
    ip: string,
    userid: string,
    createCardPaymentDto: CreateCardPaymentDto,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userService.findOne(userid)

    //automatically fill in metadata
    createCardPaymentDto.metadata.email = user.email
    createCardPaymentDto.metadata.ipAddress = ip

    createCardPaymentDto.source.type = 'card'
    createCardPaymentDto.amount.currency = 'USD'

    // ensure no repeats on double submit
    await this.paymentRepository.findOneOrFail({
      idempotencyKey: createCardPaymentDto.idempotencyKey,
    })

    const card = await this.cardRepository.findOneOrFail({
      circleCardId: createCardPaymentDto.source.id,
      active: true,
      user: user,
    })

    const payment = new PaymentEntity()
    payment.idempotencyKey = createCardPaymentDto.idempotencyKey
    payment.amount = createCardPaymentDto.amount.amount
    payment.card = card as CardEntity
    payment.status = PaymentStatusEnum.UNKOWN
    payment.verification =
      CardVerificationEnum[createCardPaymentDto.verification]()
    payment.source = PaymentSourceEnum.CARD

    this.cardRepository.persistAndFlush(payment)
    const response = await createPayment(this.instance, createCardPaymentDto)

    payment.status = PaymentStatusEnum[response['status']]
    payment.circlePaymentId = response['id']

    this.cardRepository.persistAndFlush(payment)
    return new StatusDto(payment.circlePaymentId, payment.status)
  }

  /**
   * check status for payment
   * @param paymentId
   * @returns
   */
  async checkPaymentStatus(paymentId: string): Promise<StatusDto> {
    const payment = await this.paymentRepository.findOneOrFail({
      circlePaymentId: paymentId,
    })

    // if payment is not in end state, try to get an update
    if (
      !(payment.status in [PaymentStatusEnum.PAID, PaymentStatusEnum.FAILED])
    ) {
      const response = await getPaymentById(this.instance, paymentId)
      payment.status = response['status']
      this.paymentRepository.persistAndFlush(payment)
    }
    return new StatusDto(paymentId, payment.status)
  }

  /**
   * get depositable solana address
   *
   * new address per person per time frame (currently 30 minutes - minutesTillExpire)
   * ensures that new addresses are not generated too frequently without overusing them
   *
   * @param userid
   * @param createAddressDto
   * @returns solana address
   */
  async getAddress(
    userid: string,
    createAddressDto: CreateAddressDto,
  ): Promise<string> {
    const user: UserEntity = await this.userService.findOne(userid)

    const checkAddress = await this.circleAddressRepository.findOne(
      {
        user: user,
      },
      // check if solana address has expired yet
      { filters: { expiration: { date: new Date() } } },
    )
    if (checkAddress !== null) {
      return checkAddress.address
    }

    // get new depositable address if one does not exist
    const response = await createAddress(
      this.instance,
      this.configService.get('circle.master_wallet_id') as string,
      createAddressDto,
    )
    const address = response['address']
    const newAddress = new CircleAddressEntity()
    const minutesTillExpire = 30
    newAddress.user = user
    newAddress.address = address
    newAddress.expiration = new Date(
      new Date().getTime() + minutesTillExpire * 60000,
    )
    return address
  }

  /**
   * add wire bank accounts (for creators)
   * @param userid
   * @param createBankDto
   * @returns
   */
  async createWireBankAccount(
    userid: string,
    createBankDto: CreateBankDto,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userService.findOne(userid)

    const response = await createBank(this.instance, createBankDto)

    const bankId = response['id']
    await this.bankRepository.findOneOrFail({
      circleBankId: bankId,
      user: user,
    })

    // register new bank to db after creation
    const bank = new BankEntity()
    bank.user = user
    bank.circleBankId = response['id']
    bank.status = response['status']
    bank.description = response['description']
    bank.trackingRef = response['trackingRef']
    bank.fingerprint = response['fingerprint']
    this.bankRepository.persistAndFlush(bank)

    // set bank as default bank for user
    const banks = await this.bankRepository.find({ user: user })
    for (const otherBank of banks) {
      if (otherBank.isDefault && otherBank.circleBankId != bank.circleBankId) {
        otherBank.isDefault = false
        this.cardRepository.persistAndFlush(otherBank)
      }
    }

    return new StatusDto(bank.circleBankId, bank.status)
  }

  /**
   * get status of added bank for wire transfers (for creators)
   * @param bankId
   * @returns
   */
  async checkWireBankStatus(bankId: string): Promise<StatusDto> {
    const bank = await this.bankRepository.findOneOrFail({
      circleBankId: bankId,
    })

    // if last known status is pending, check for updates
    if (bank.status == AccountStatusEnum.PENDING) {
      const response = await getBankById(this.instance, bankId)
      bank.status = response['status']
      this.bankRepository.persistAndFlush(bank)
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

  async processUpdate(update: CircleNotificationDto) {
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
          await this.processPaymentUpdate(update.payment)
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
  async processCardUpdate(card: any) {
    const id = card['id'] // property must exist
    const cardEntity = await this.cardRepository.findOneOrFail({
      circleCardId: id,
    })
    cardEntity.status = AccountStatusEnum.COMPLETE
    this.cardRepository.persistAndFlush(cardEntity)
  }
  /**
   * update payment info
   * @param payment
   */
  async processPaymentUpdate(payment: PaymentDto) {
    const checkPayment = await this.paymentRepository.findOne({
      circlePaymentId: payment.id,
    })
    if (checkPayment != null) {
      checkPayment.status = PaymentStatusEnum[payment.status]
      this.paymentRepository.persistAndFlush(checkPayment)
    } else {
      const paymentEntity = new PaymentEntity()
      paymentEntity.circlePaymentId = payment.id
      paymentEntity.amount = payment.amount.amount
      paymentEntity.status = PaymentStatusEnum[payment.status]

      paymentEntity.source = PaymentSourceEnum[payment.source.type]
      if (paymentEntity.source == PaymentSourceEnum.CARD) {
        const checkCard = await this.cardRepository.findOneOrFail({
          circleCardId: payment.source.id,
        })
        paymentEntity.card = checkCard
      } else if (paymentEntity.source == PaymentSourceEnum.BLOCKCHAIN) {
        paymentEntity.address =
          PaymentSourceEnum[payment.source.address as string]
      }
      this.paymentRepository.persistAndFlush(paymentEntity)
    }
    //DEAL WITH GEMS HERE
  }
}
