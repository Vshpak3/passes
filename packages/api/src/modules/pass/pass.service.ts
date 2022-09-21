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

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentFormatEnum } from '../content/enums/content-format.enum'
import {
  CreateNftPassPayinCallbackInput,
  RenewNftPassPayinCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { PayinEntity } from '../payment/entities/payin.entity'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { PayinStatusEnum } from '../payment/enum/payin.status.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { S3ContentService } from '../s3content/s3content.service'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
import { PASS_NOT_EXIST, PASS_NOT_OWNED_BY_USER } from './constants/errors'
import {
  CreatePassRequestDto,
  CreatePassResponseDto,
} from './dto/create-pass.dto'
import {
  GetCreatorPassesRequestDto,
  GetExternalPassesRequestDto,
} from './dto/get-pass.dto'
import { GetPassHoldersRequestDto } from './dto/get-pass-holders.dto'
import { GetPassHoldingsRequestDto } from './dto/get-pass-holdings.dto'
import { MintPassRequestDto, MintPassResponseDto } from './dto/mint-pass.dto'
import { PassDto } from './dto/pass.dto'
import { PassHolderDto } from './dto/pass-holder.dto'
import { UpdatePassRequestDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassHolderEntity } from './entities/pass-holder.entity'
import { PassPurchaseEntity } from './entities/pass-purchase.entity'
import { UserExternalPassEntity } from './entities/user-external-pass.entity'
import { PassTypeEnum } from './enum/pass.enum'
import {
  ForbiddenPassException,
  NoPassError,
  UnsupportedChainPassError,
} from './error/pass.error'
import { createPassHolderQuery } from './pass.util'

export const DEFAULT_PASS_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
export const DEFAULT_PASS_GRACE_MS = 2 * 24 * 60 * 60 * 1000 // 2 days
export const DEFAULT_PASS_SYMBOL = 'PASS'
export const MAX_PASSES_PER_REQUEST = 20
export const MAX_PASSHOLDERS_PER_REQUEST = 20

@Injectable()
export class PassService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly solService: SolService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly s3ContentService: S3ContentService,
  ) {}

  async createPass(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<CreatePassResponseDto> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ id: userId, isCreator: true }))
      .select(['id', 'username'])
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
      chain: createPassDto.chain,
      symbol: DEFAULT_PASS_SYMBOL,
    })
    if (
      createPassDto.chain !== ChainEnum.SOL &&
      createPassDto.chain !== ChainEnum.ETH
    ) {
      throw new UnsupportedChainPassError(
        `can not create a pass on chain ${createPassDto.chain}`,
      )
    }
    await this.dbWriter(PassEntity.table).insert(data)

    return new CreatePassResponseDto(data.id)
  }

  async mintPass(
    userId: string,
    mintPassDto: MintPassRequestDto,
  ): Promise<MintPassResponseDto> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ id: userId, isCreator: true }))
      .select(['id', 'username'])
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    const pass = await this.dbReader(PassEntity.table)
      .where(
        PassEntity.toDict<PassEntity>({
          creator: userId,
          id: mintPassDto.passId,
        }),
      )
      .select('*')
      .first()

    if (
      !(await this.s3ContentService.doesObjectExist(
        `nft/${pass.id}/image.${ContentFormatEnum.IMAGE}`,
      ))
    ) {
      throw new NotFoundException('Image is not uploaded')
    }
    if (!pass || pass.collection_address) {
      throw new NotFoundException('Pass can not be minted')
    }
    let collectionAddress: string | undefined = undefined
    switch (pass.chain) {
      case ChainEnum.SOL:
        collectionAddress = (
          await this.solService.createSolNftCollection(
            user.id,
            pass.id,
            pass.title,
            'PASS',
            pass.description,
          )
        ).passPubKey
        break
      case ChainEnum.ETH: // TODO
      default:
        throw new UnsupportedChainPassError(
          `can not create a pass on chain ${pass.chain}`,
        )
    }
    await this.dbWriter(PassEntity.table)
      .update(PassEntity.toDict<PassEntity>({ collectionAddress }))
      .where('id', pass.id)
    return new MintPassResponseDto(true)
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

  async findPassHoldings(
    userId: string,
    getPassHoldingsRequestDto: GetPassHoldingsRequestDto,
  ) {
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
        `${PassEntity.table}.collection_address`,
        `${PassHolderEntity.table}.*`,
        `${UserEntity.table}.username as creator_username`,
        `${UserEntity.table}.display_name as creator_display_name`,
      )

    if (getPassHoldingsRequestDto.creatorId) {
      query = query.andWhere(
        `${UserEntity.table}.id`,
        getPassHoldingsRequestDto.creatorId,
      )
    }

    if (getPassHoldingsRequestDto.passId) {
      query = query.andWhere(
        `${PassEntity.table}.id`,
        getPassHoldingsRequestDto.passId,
      )
    }
    query = createPassHolderQuery(query, getPassHoldingsRequestDto)
    return (await query).map((pass) => new PassHolderDto(pass))
  }

  async getPassHolders(
    userId: string,
    getPassHoldersRequest: GetPassHoldersRequestDto,
  ): Promise<PassHolderDto[]> {
    let query = this.dbReader(PassHolderEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${PassHolderEntity.table}.holder_id`,
      )
      .innerJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassEntity.table}.creator`, userId)
      .select([
        `${PassHolderEntity.table}.*`,
        `${PassEntity.table}.totalSupply`,
        `${PassEntity.table}.remainingSupply`,
        `${PassEntity.table}.price`,
        `${PassEntity.table}.freetrial`,
        `${PassEntity.table}.title`,
        `${PassEntity.table}.description`,
        `${PassEntity.table}.type`,
        `${UserEntity.table}.username as holder_username`,
        `${UserEntity.table}.display_name as holder_display_name`,
      ])
    if (getPassHoldersRequest.passId) {
      query = query.andWhere(
        `${PassEntity.table}.id`,
        getPassHoldersRequest.passId,
      )
    }
    if (getPassHoldersRequest.holderId) {
      query = query.andWhere(
        `${PassHolderEntity.table}.holder_id`,
        getPassHoldersRequest.holderId,
      )
    }
    query = createPassHolderQuery(query, getPassHoldersRequest)
    return (await query).map((passHolder) => new PassHolderDto(passHolder))
  }

  async findPassesByCreator(
    getCreatorPassesRequestDto: GetCreatorPassesRequestDto,
  ) {
    const { lastId, createdAt, search, creatorId } = getCreatorPassesRequestDto
    let query = this.dbReader(PassEntity.table)
      .whereNotNull('collection_address')
      .andWhere('creator_id', creatorId)
      .select('*')
      .orderBy([
        { column: `${PassEntity.table}.pinned_at`, order: 'desc' },
        { column: `${PassEntity.table}.created_at`, order: 'desc' },
        { column: `${PassEntity.table}.id`, order: 'desc' },
      ])
    if (lastId) {
      query = query.andWhere(`${PassEntity.table}.id`, '<', lastId)
    }
    if (createdAt) {
      query = query.andWhere(`${PassEntity.table}.created_at`, '<=', createdAt)
    }
    if (search) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.where(function () {
        return this.whereILike(
          `${PassEntity.table}.title`,
          likeClause,
        ).orWhereILike(`${PassEntity.table}.description`, likeClause)
      })
    }

    return (await query.limit(MAX_PASSES_PER_REQUEST)).map(
      (pass) => new PassDto(pass),
    )
  }

  async getExternalPasses(
    getExternalPassesRequestDto: GetExternalPassesRequestDto,
  ) {
    const { lastId, createdAt, search, creatorId } = getExternalPassesRequestDto
    let query = this.dbReader(PassEntity.table)
      .whereNull('creator_id')
      .select('*')
      .orderBy([
        { column: `${PassEntity.table}.created_at`, order: 'desc' },
        { column: `${PassEntity.table}.id`, order: 'desc' },
      ])
    if (lastId) {
      query = query.andWhere(`${PassEntity.table}.id`, '<', lastId)
    }
    if (createdAt) {
      query = query.andWhere(`${PassEntity.table}.created_at`, '<=', createdAt)
    }
    if (creatorId) {
      const userExternalPasses = await this.dbReader(
        UserExternalPassEntity.table,
      )
        .where('user_id', creatorId)
        .select('pass_id')
      query = query.whereIn(
        `${PassEntity.table}.id`,
        userExternalPasses.map((externalPass) => externalPass.pass_id),
      )
    }
    if (search) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.where(function () {
        return this.whereILike(
          `${PassEntity.table}.title`,
          likeClause,
        ).orWhereILike(`${PassEntity.table}.description`, likeClause)
      })
    }
    return (await query.limit(MAX_PASSES_PER_REQUEST)).map(
      (pass) => new PassDto(pass),
    )
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
      .whereNotNull('collection_address')
      .andWhere('id', passId)
      .first()

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION
        ? new Date(Date.now() + pass.duration + DEFAULT_PASS_GRACE_MS)
        : undefined

    const userWallet = await this.walletService.getDefaultWallet(
      userId,
      pass.chain,
    )

    const data = PassHolderEntity.toDict<PassHolderEntity>({
      id,
      pass: passId,
      wallet: userWallet.walletId,
      holder: userId,
      expiresAt: expiresAt,
      messages: pass.messages,
      chain: pass.chain,
    })
    await this.dbWriter(PassHolderEntity.table).insert(data)

    let address = ''
    const tokenId = undefined
    switch (pass.chain) {
      case ChainEnum.SOL:
        address = (
          await this.solService.createNftPass(
            userId,
            pass.id,
            id,
            pass.title,
            pass.symbol,
            pass.description,
            userWallet.address,
            pass.royalties,
          )
        ).mintPubKey
        break
      case ChainEnum.ETH:
        break
      default:
        throw new UnsupportedChainPassError(
          `can not create a pass on chain ${pass.chain}`,
        )
    }
    const updateData = PassHolderEntity.toDict<PassHolderEntity>({
      address,
      tokenId,
    })
    await this.dbWriter(PassHolderEntity.table)
      .where('id', id)
      .update(updateData)
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
      throw new InvalidPayinRequestError(blocked)
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
      .whereNotNull('address')
      .select(
        ...PassHolderEntity.populate<PassHolderEntity>([
          'id',
          'holder',
          'pass',
        ]),
      )
      .first()

    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (checkPayin !== undefined) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkHolder.holder_id !== userId) {
      blocked = BlockedReasonEnum.IS_NOT_PASSHOLDER
    }

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
      throw new InvalidPayinRequestError(blocked)
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

    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (checkPayin !== undefined) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkHolder !== undefined) {
      blocked = BlockedReasonEnum.ALREADY_OWNS_PASS
    } else if (pass.remaining_supply === 0) {
      blocked = BlockedReasonEnum.INSUFFICIENT_SUPPLY
    }

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
    ) {
      throw new NoPassError('pass does not exist or unowned by user')
    }
  }

  async validatePassIds(userId: string, passIds: string[]): Promise<void> {
    const filteredPasses = await this.dbReader(PassEntity.table)
      .leftJoin(
        UserExternalPassEntity.table,
        `${UserExternalPassEntity.table}.pass_id`,
        `${PassEntity.table}.id`,
      )
      .whereIn('id', passIds)
      .andWhere(function () {
        return this.where(
          `${UserExternalPassEntity.table}.user_id`,
          userId,
        ).orWhere(`${PassEntity.table}.creator_id`, userId)
      })
      .select(`${PassEntity.table}.id`)
    const filteredPassIds = new Set(filteredPasses.map((pass) => pass.id))
    for (const passId in passIds) {
      if (!filteredPassIds.has(passId)) {
        throw new NoPassError('cant find pass for user')
      }
    }
  }
}
