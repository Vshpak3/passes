import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { get } from 'lodash'

import { GemService } from '../gem/gem.service'
import { UserEntity } from '../user/entities/user.entity'
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
import { CreateAddressDto } from './dto/create-address.dto'
import { CreateBankDto } from './dto/create-bank.dto'
import { CreateCardDto } from './dto/create-card.dto'
import { CreateCardPaymentDto } from './dto/create-card-payment.dto'
import { PaymentDto } from './dto/payment.dto'
import { StatusDto } from './dto/status.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle.address.entity'
import { PaymentEntity } from './entities/payment.entity'
import { AccountStatusEnum } from './enum/account.status.enum'
import { CardVerificationEnum } from './enum/card.verification.enum'
import { PaymentSourceEnum } from './enum/payment.source.enum'
import { PaymentStatusEnum } from './enum/payment.status.enum'

@Injectable()
export class PaymentService {
  instance
  constructor(
    private readonly configService: ConfigService,
    private readonly gemService: GemService,
    @InjectRepository(CardEntity)
    private readonly cardRepository: EntityRepository<CardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: EntityRepository<PaymentEntity>,
    @InjectRepository(CircleAddressEntity)
    private readonly circleAddressRepository: EntityRepository<CircleAddressEntity>,
    @InjectRepository(BankEntity)
    private readonly bankRepository: EntityRepository<BankEntity>,
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
        let response = get(error, 'response')
        if (!response) {
          response = error.toJSON()
        }
        return Promise.reject(response)
      },
    )
  }

  /**
   * get circle's public encryption key
   * @returns
   */
  async getEncryptionKey(): Promise<string> {
    return (await getPCIPublicKey(this.instance))['publicKey']
  }

  /**
   * create card using circle api, return status of creation
   * make card default
   * @param createCardDto
   * @returns
   */
  async createCard(
    userid: string,
    createCardDto: CreateCardDto,
    fourDigits: string,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

    createCardDto.metadata.email = user.email
    const response = await createCard(this.instance, createCardDto)

    if ((await response.status) !== 201) {
      throw Error('bad circle response: create card')
    }
    const cardId = response['id']
    await this.cardRepository.findOneOrFail({
      circleCardId: cardId,
      user: user,
    })
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
    for (const otherCard of cards) {
      if (otherCard.isDefault && otherCard.circleCardId != card.circleCardId) {
        otherCard.isDefault = false
        this.cardRepository.persistAndFlush(otherCard)
      }
    }
    return new StatusDto(cardId, card.status)
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
      if ((await response.status) !== 200) {
        throw Error('bad circle response: get card status')
      }
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
  async getDefault(userid: string): Promise<CardEntity | null> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

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
  async setDefault(userid: string, circleCardId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

    const card = await this.cardRepository.findOne({
      circleCardId: circleCardId,
      user: user,
    })
    if (card == null) {
      return false
    }
    const cards = await this.cardRepository.find({ user: user }) //replace user id with auth user id
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
   * select new default if card id deafult
   * @param id
   * @returns
   */
  async deleteCard(userid: string, circleCardId: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

    const card = await this.cardRepository.findOne({
      circleCardId: circleCardId,
      user: user,
    })
    if (card == null || !card.active) {
      return false
    }
    card.active = false
    await this.cardRepository.persistAndFlush(card)
    return true
  }

  /**
   * get all cards you registered with moment
   * @param userid
   * @returns
   */
  async getCards(userid: string): Promise<CardEntity[]> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

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
    userid: string,
    createCardPaymentDto: CreateCardPaymentDto,
  ): Promise<StatusDto> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })

    createCardPaymentDto.metadata.email = user.email
    if (createCardPaymentDto.source.type !== 'card') {
      throw Error('incorrect paymnet type')
    }
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

    if ((await response.status) !== 201) {
      throw Error('bad circle response: make card payment')
    }
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
    if (
      !(payment.status in [PaymentStatusEnum.PAID, PaymentStatusEnum.FAILED])
    ) {
      const response = await getPaymentById(this.instance, paymentId)
      if ((await response.status) !== 200) {
        throw Error('bad circle response: get payment status')
      }
      payment.status = response['status']
      this.paymentRepository.persistAndFlush(payment)
    }
    return new StatusDto(paymentId, payment.status)
  }

  /**
   * get depositable solana address
   * @param userid
   * @param createAddressDto
   * @returns solana address
   */
  async getAddress(
    userid: string,
    createAddressDto: CreateAddressDto,
  ): Promise<string> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })
    const checkAddress = await this.circleAddressRepository.findOne(
      {
        user: user,
      },
      { filters: { expiration: { date: new Date() } } },
    )
    if (checkAddress !== null) {
      return checkAddress.address
    }
    const response = await createAddress(
      this.instance,
      this.configService.get('circle.master_wallet_id') as string,
      createAddressDto,
    )
    if ((await response.status) !== 201) {
      throw Error('bad circle response: get address')
    }
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
    const user: UserEntity = await this.userRepository.findOneOrFail({
      id: userid,
    })
    const response = await createBank(this.instance, createBankDto)
    if ((await response.status) !== 201) {
      throw Error('bad circle response: create wire bank')
    }

    const bankId = response['id']
    await this.bankRepository.findOneOrFail({
      circleBankId: bankId,
      user: user,
    })

    const bank = new BankEntity()

    bank.user = user
    bank.circleBankId = response['id']
    bank.status = response['status']
    bank.description = response['description']
    bank.trackingRef = response['trackingRef']
    bank.fingerprint = response['fingerprint']
    this.bankRepository.persistAndFlush(bank)

    const banks = await this.bankRepository.find({ user: user }) //replace user id with auth user id
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
    if (bank.status == AccountStatusEnum.PENDING) {
      const response = await getBankById(this.instance, bankId)
      if ((await response.status) !== 200) {
        throw Error('bad circle response: get wire bank status')
      }
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

  /**
   * update payment info
   * @param payment
   */
  async procesPaymentUpdate(payment: PaymentDto) {
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
        console.log(
          'should not really happen, but logging info in db if it does',
        )
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
