import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import CryptoJS from 'crypto-js'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import {
  CreateNftPassPayinCallbackInput,
  RenewNftPassPayinCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinEntity } from '../payment/entities/payin.entity'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PayinStatusEnum } from '../payment/enum/payin.status.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
import { PASS_NOT_EXIST, PASS_NOT_OWNED_BY_USER } from './constants/errors'
import { CreatePassRequestDto } from './dto/create-pass.dto'
import { PassDto } from './dto/pass.dto'
import { PassHolderDto } from './dto/pass-holder.dto'
import { UpdatePassRequestDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassHolderEntity } from './entities/pass-holder.entity'
import { PassPurchaseEntity } from './entities/pass-purchase.entity'
import { PassTypeEnum } from './enum/pass.enum'
import {
  ForbiddenPassException,
  NoPassError,
  UnsupportedChainPassError,
} from './error/pass.error'

const DEFAULT_PASS_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const DEFAULT_PASS_GRACE_MS = 2 * 24 * 60 * 60 * 1000 // 2 days

@Injectable()
export class PassService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private readonly solService: SolService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
  ) {}

  async createPass(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<boolean> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ id: userId, isCreator: true }))
      .select('id')
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    // TODO: check image exists

    const duration =
      createPassDto.duration === undefined &&
      createPassDto.type === PassTypeEnum.SUBSCRIPTION
        ? DEFAULT_PASS_DURATION_MS
        : createPassDto.duration
    const data = PassEntity.toDict<PassEntity>({
      id: v4(),
      creator: userId,
      title: createPassDto.title,
      description: createPassDto.description,
      type: createPassDto.type,
      price: createPassDto.price,
      duration,
      freetrial: createPassDto.freetrial,
      messages: createPassDto.messages,
      totalSupply: createPassDto.totalSupply,
      remainingSupply: createPassDto.totalSupply,
    })
    await this.dbWriter(PassEntity.table).insert(data)

    switch (createPassDto.chain) {
      case ChainEnum.SOL:
        await this.solService.createSolNftCollection(
          user.id,
          data.id,
          createPassDto.title,
          user.username.replace(/[^a-zA-Z]/g, '').substring(0, 10),
          createPassDto.description,
        )
        break
      case ChainEnum.ETH: // TODO
      default:
        throw new UnsupportedChainPassError(
          `can not create a pass on chain ${createPassDto.chain}`,
        )
    }
    return true
  }

  async findPass(passId: string): Promise<PassDto> {
    const pass = await this.dbReader(PassEntity.table)
      .innerJoin(
        `${UserEntity.table}`,
        `${PassEntity.table}.creator_id`,
        `${UserEntity.table}.id`,
      )
      .select([
        `${UserEntity.table}.username as creator_username`,
        `${UserEntity.table}.display_name as creator_display_name`,
        `${PassEntity.table}.*`,
      ])
      .where(`${PassEntity.table}.id`, passId)
      .first()

    if (!pass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    return new PassDto(pass)
  }

  async findPassHoldings(userId: string, creatorId?: string) {
    let query = this.dbReader(PassHolderEntity.table)
      .innerJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .innerJoin(
        `${UserEntity.table}`,
        `${PassEntity.table}.creator_id`,
        `${UserEntity.table}.id`,
      )
      .where(`${PassHolderEntity.table}.holder_id`, userId)
      .select(
        `${PassEntity.table}.type`,
        `${PassEntity.table}.title`,
        `${PassEntity.table}.description`,
        `${PassEntity.table}.creator_id`,
        `${PassHolderEntity.table}.*`,
        `${UserEntity.table}.username as creator_username`,
        `${UserEntity.table}.display_name as creator_display_name`,
      )

    if (creatorId) {
      query = query.andWhere(`${UserEntity.table}.id`, creatorId)
    }

    return (await query).map((pass) => new PassHolderDto(pass))
  }

  async getPassHolders(
    userId: string,
    passId: string,
  ): Promise<PassHolderDto[]> {
    await this.checkPass(userId, passId)
    return (
      await this.dbReader(PassHolderEntity.table)
        .innerJoin(
          UserEntity.table,
          `${UserEntity.table}.id`,
          `${PassHolderEntity.table}.holder_id`,
        )
        .where(`${PassHolderEntity.table}.pass_id`, passId)
        .distinct(`${PassHolderEntity.table}.holder_id`)
        .select([
          `${PassHolderEntity.table}.*`,
          `${UserEntity.table}.username as holder_username`,
          `${UserEntity.table}.display_name as holder_display_name`,
        ])
    ).map((passHolder) => new PassHolderDto(passHolder))
  }

  async findPassesByCreator(creatorId: string) {
    return (
      await this.dbReader(PassEntity.table)
        .where('creator_id', creatorId)
        .select('*')
    ).map((pass) => new PassDto(pass))
  }

  async getExternalPasses() {
    return (
      await this.dbReader(PassEntity.table)
        .where('creator_id', null)
        .select('*')
    ).map((pass) => new PassDto(pass))
  }

  async updatePass(
    userId: string,
    passId: string,
    updatePassDto: UpdatePassRequestDto,
  ) {
    const currentPass = await this.dbReader(PassEntity.table)
      .where({ id: passId })
      .select(['id', 'creator_id'])
      .first()

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.creator_id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const data = PassEntity.toDict<PassEntity>(updatePassDto)
    await this.dbWriter(PassEntity.table).update(data).where({ id: passId })
    return new PassDto(data)
  }

  async createPassHolder(userId: string, passId: string) {
    const id = v4()

    const pass = await this.dbReader(PassEntity.table)
      .select('*')
      .where('id', passId)
      .first()

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION
        ? new Date(Date.now() + pass.duration + DEFAULT_PASS_GRACE_MS)
        : undefined

    const userCustodialWallet = await this.walletService.getDefaultWallet(
      userId,
    )

    const solNftDto = await this.solService.createNftPass(
      userId,
      pass.id,
      id,
      pass.title,
      //TODO: figure out symbol
      // user.username.replace(/[^a-zA-Z]/g, '').substring(0, 10),
      '',
      pass.description,
      userCustodialWallet.address,
    )
    const data = PassHolderEntity.toDict<PassHolderEntity>({
      id,
      pass: passId,
      wallet: userCustodialWallet.walletId,
      holder: userId,
      expiresAt: expiresAt,
      messages: pass.messages,
      address: solNftDto.mintPubKey,
      chain: ChainEnum.SOL,
    })
    await this.dbWriter(PassHolderEntity.table).insert(data)
    await this.dbWriter(PassEntity.table)
      .where('id', passId)
      .decrement('remaining_supply')

    await this.passPurchased(userId, passId)

    return {
      id,
      passId: pass.id,
      holderId: userId,
      expiresAt,
    }
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const data = PassHolderEntity.toDict<PassHolderEntity>({
      holder: userId,
      pass: passId,
    })
    const holder = await this.dbReader(PassHolderEntity.table)
      .where(data)
      .first()
    return !!holder
  }

  async renewPass(passHolderId: string) {
    const passHolder = await this.dbReader(PassHolderEntity.table)
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .select([
        `${PassHolderEntity.table}.id`,
        `${PassHolderEntity.table}.expires_at`,
        `${PassEntity.table}.duration`,
        `${PassEntity.table}.messages as pass_messages`,
      ])
      .first()

    if (!passHolder.expires_at) {
      throw new ForbiddenPassException("can't extend non subscription pass")
    }

    const expiresAt = new Date(
      Date.now() + passHolder.duration + DEFAULT_PASS_GRACE_MS,
    )
    await this.dbWriter(PassHolderEntity.table)
      .where('id', passHolder.id)
      .update(
        PassHolderEntity.toDict<PassHolderEntity>({
          expiresAt,
          messages: passHolder.pass_messages,
        }),
      )

    return expiresAt
  }

  async registerRenewPass(
    userId: string,
    passHolderId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerBuyPassData(
      userId,
      passHolderId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError('invalid nft pass renewal')
    }

    // free pass
    if (amount === 0) {
      await this.renewPass(passHolderId)
      return new RegisterPayinResponseDto()
    }

    const passHolder = await this.dbReader(PassHolderEntity.table)
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .select(`${PassEntity.table}.creator_id`)
      .first()

    const callbackInput: RenewNftPassPayinCallbackInput = {
      passHolderId,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.RENEW_NFT_PASS,
      callbackInputJSON: callbackInput,
      creatorId: passHolder.creator_id,
    })
  }

  async registerRenewPassData(
    userId: string,
    passHolderId: string,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`nft-pass-holder-${passHolderId}`).toString(
      CryptoJS.enc.Hex,
    )

    const checkPayin = await this.dbReader(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .andWhere('target', target)
      .select('id')
      .first()
    const checkHolder = await this.dbReader(PassHolderEntity.table)
      .where(
        PassHolderEntity.toDict<PassHolderEntity>({
          id: passHolderId,
          holder: userId,
        }),
      )
      .select(
        ...PassHolderEntity.populate<PassHolderEntity>([
          'id',
          'holder',
          'pass',
        ]),
      )
      .first()

    const blocked = checkPayin !== undefined || checkHolder.holder_id !== userId

    const pass = await this.dbReader(PassEntity.table)
      .where('id', checkHolder.pass_id)
      .select('price')
      .first()

    return { amount: pass.price, target, blocked }
  }

  async registerBuyPass(
    userId: string,
    passId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerBuyPassData(
      userId,
      passId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError('invalid nft pass creation')
    }

    // free pass or free trial
    const pass = await this.dbReader(PassEntity.table)
      .where('id', passId)
      .select(
        ...PassEntity.populate<PassEntity>(['creator', 'type', 'freetrial']),
      )
      .first()

    // stop people from following scenario -
    //    1. get free trial for pass
    //    2. transfer pass after free trial
    //    3. get new pass with free trial

    const passPurchaseQuery = this.dbReader(PassPurchaseEntity.table)
      .where(
        PassPurchaseEntity.toDict<PassPurchaseEntity>({
          user: userId,
          pass: passId,
        }),
      )
      .select('id')
      .first()

    if (
      amount === 0 ||
      (pass.freetrial &&
        pass.type === PassTypeEnum.SUBSCRIPTION &&
        (await passPurchaseQuery))
    ) {
      await this.createPassHolder(userId, passId)
      return new RegisterPayinResponseDto()
    }

    const callbackInput: CreateNftPassPayinCallbackInput = {
      userId,
      passId,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback:
        pass.type === PassTypeEnum.LIFETIME
          ? PayinCallbackEnum.CREATE_NFT_LIFETIME_PASS
          : PayinCallbackEnum.CREATE_NFT_SUBSCRIPTION_PASS,
      callbackInputJSON: callbackInput,
      creatorId: pass.creator_id,
    })
  }

  async registerBuyPassData(
    userId: string,
    passId: string,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`nft-pass-${userId}-${passId}`).toString(
      CryptoJS.enc.Hex,
    )

    const pass = await this.dbReader(PassEntity.table)
      .where('id', passId)
      .select(['price', 'remaining_supply'])
      .first()

    const checkPayin = await this.dbReader(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .andWhere('target', target)
      .select('id')
      .first()
    const checkHolder = await this.dbReader(PassHolderEntity.table)
      .where(
        PassHolderEntity.toDict<PassHolderEntity>({
          pass: passId,
          holder: userId,
        }),
      )
      .select('id')
      .first()
    const blocked =
      checkPayin !== undefined ||
      checkHolder !== undefined ||
      pass.remaining_supply > 0

    return { amount: pass.price, target, blocked }
  }

  /**
   * subscription pass exists in your wallet, but no subscription is found
   * occurs when pass is transferred on chain or subscription was cancelled and pass still held
   *
   * @param userId
   * @param passHolderId
   */
  async addPassSubscription(userId: string, passHolderId: string) {
    const passHolder = await this.dbReader(PassHolderEntity.table)
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .select(`${PassEntity.table}.price`)
      .first()

    if (!passHolder) {
      throw new ForbiddenPassException('user does not own pass')
    }

    await this.payService.subscribe({
      userId,
      passHolderId,
      amount: passHolder.price,
    })
  }

  async passPurchased(userId: string, passId: string) {
    await this.dbWriter(PassPurchaseEntity.table)
      .insert(
        PassPurchaseEntity.toDict<PassPurchaseEntity>({
          pass: passId,
          user: userId,
        }),
      )
      .onConflict(['pass_id', 'user_id'])
      .ignore()
  }

  async pinPass(userId: string, passId: string): Promise<boolean> {
    return (
      (await this.dbWriter(PassEntity.table)
        .where(PassEntity.toDict<PassEntity>({ creator: userId, id: passId }))
        .update(
          PassEntity.toDict<PassEntity>({ pinnedAt: this.dbWriter.fn.now() }),
        )) === 1
    )
  }

  async unpinPass(userId: string, passId: string): Promise<boolean> {
    return (
      (await this.dbWriter(PassEntity.table)
        .where(PassEntity.toDict<PassEntity>({ creator: userId, id: passId }))
        .update(PassEntity.toDict<PassEntity>({ pinnedAt: null }))) === 1
    )
  }

  async checkPass(userId: string, passId: string) {
    if (
      !(await this.dbReader(PassEntity.table)
        .where(PassEntity.toDict<PassEntity>({ creator: userId, id: passId }))
        .first())
    )
      throw new NoPassError('pass does not exist or unowned by user')
  }
}
