import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'
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
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import { PASS_NOT_EXIST, PASS_NOT_OWNED_BY_USER } from './constants/errors'
import { CreatePassRequestDto } from './dto/create-pass.dto'
import { PassDto } from './dto/pass.dto'
import { UpdatePassRequestDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassHolderEntity } from './entities/pass-holder.entity'
import { PassPurchaseEntity } from './entities/pass-purchase.entity'
import { PassTypeEnum } from './enum/pass.enum'
import { ForbiddenPassException } from './error/pass.error'

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

  async create(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<PassDto> {
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    const solNftCollectionDto = await this.solService.createNftCollection(
      user.id,
      createPassDto.title,
      user.username.replace(/[^a-zA-Z]/g, '').substring(0, 10),
      createPassDto.description,
      createPassDto.imageUrl,
    )

    const duration =
      createPassDto.duration === undefined &&
      createPassDto.type === PassTypeEnum.SUBSCRIPTION
        ? DEFAULT_PASS_DURATION_MS
        : createPassDto.duration

    const data = PassEntity.toDict<PassEntity>({
      id: v4(),
      creator: userId,
      solNftCollection: solNftCollectionDto.id,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
      duration,
      freetrial: createPassDto.freetrial,
    })

    await this.dbWriter(PassEntity.table).insert(data)
    return new PassDto(data)
  }

  async findOne(id: string): Promise<PassDto> {
    const pass = await this.dbReader(PassEntity.table)
      .innerJoin(
        `${UserEntity.table} as owner`,
        `${PassEntity.table}.creator_id`,
        'owner.id',
      )
      .innerJoin(
        `${SolNftCollectionEntity.table} as solNftCollection`,
        `${PassEntity.table}.sol_nft_collection_id`,
        'solNftCollection.id',
      )
      .select([
        '*',
        ...PassEntity.populate<PassEntity>(['creator', 'solNftCollection']),
      ])
      .where(`${PassEntity.table}.id`, id)
      .first()

    if (!pass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    return new PassDto(pass)
  }

  async findOwnedPasses(userId: string, creatorId?: string) {
    let query = this.dbReader(PassEntity.table)
      .rightJoin(
        `${PassHolderEntity.table} as passHolder`,
        `${PassEntity.table}.id`,
        `passHolder.pass_id`,
      )
      .innerJoin(
        `${UserEntity.table} as owner`,
        `passHolder.holder_id`,
        'owner.id',
      )
      .where('owner.id', userId)
      .select(
        `${PassEntity.table}.*`,
        `owner.username as creator_username`,
        `owner.display_name as creator_display_name`,
      )

    if (creatorId) {
      query = query.where('owner_id', creatorId)
    }

    return (await query).map((pass) => new PassDto(pass))
  }

  async findPassesByCreator(creatorId: string) {
    return (
      await this.dbReader(PassEntity.table).where('creator_id', creatorId)
    ).map((pass) => new PassDto(pass))
  }

  async update(
    userId: string,
    passId: string,
    updatePassDto: UpdatePassRequestDto,
  ) {
    const currentPass = await this.dbReader(PassEntity.table)
      .where({ id: passId })
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

  async createPass(userId: string, passId: string) {
    const id = v4()

    const pass = await this.dbReader(PassEntity.table)
      .select('*')
      .where('id', passId)
      .first()

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION
        ? Date.now() + pass.duration + DEFAULT_PASS_GRACE_MS
        : undefined

    const userCustodialWallet = await this.walletService.getDefaultWallet(
      userId,
    )
    const solNftDto = await this.solService.createNftPass(
      userId,
      userCustodialWallet.id as string,
      pass.sol_nft_collection_id,
      new PublicKey(userCustodialWallet.address),
    )
    const data = PassHolderEntity.toDict<PassHolderEntity>({
      id,
      pass: passId,
      holder: userId,
      expiresAt: expiresAt,
      solNft: solNftDto.id,
    })
    await this.dbWriter(PassHolderEntity.table).insert(data)

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
        `${PassHolderEntity}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .select([
        `${PassHolderEntity.table}.id`,
        `${PassHolderEntity.table}.expires_at`,
        `${PassEntity.table}.duration`,
      ])
      .first()

    if (!passHolder.expires_at) {
      throw new ForbiddenPassException("can't extend non subscription pass")
    }

    if (passHolder.expires_at < Date.now()) {
      await this.dbWriter(PassHolderEntity.table)
        .where('id', passHolder.id)
        .increment('expires_at', passHolder.duration)
    } else {
      await this.dbWriter(PassHolderEntity.table)
        .where('id', passHolder.id)
        .update(
          'expires_at',
          Date.now() + passHolder.duration + DEFAULT_PASS_GRACE_MS,
        )
    }
    return (
      await this.dbReader(PassHolderEntity.table)
        .where('id', passHolder.id)
        .select(...PassHolderEntity.populate<PassHolderEntity>(['expiresAt']))
        .first()
    ).expires_at
  }

  async registerRenewPass(
    userId: string,
    passHolderId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerCreatePassData(
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
        `${PassHolderEntity}.pass_id`,
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

  async registerCreatePass(
    userId: string,
    passId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerCreatePassData(
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
      await this.createPass(userId, passId)
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

  async registerCreatePassData(
    userId: string,
    passId: string,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`nft-pass-${userId}-${passId}`).toString(
      CryptoJS.enc.Hex,
    )

    const pass = await this.dbReader(PassEntity.table)
      .where('id', passId)
      .select('price')
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
    const blocked = checkPayin !== undefined || checkHolder !== undefined

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
        `${PassHolderEntity}.pass_id`,
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
}
