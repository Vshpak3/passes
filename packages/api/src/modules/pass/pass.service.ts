import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import CryptoJS from 'crypto-js'
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
import { PostPassHolderAccessEntity } from '../post/entities/post-passholder-access.entity'
import { PostUserAccessEntity } from '../post/entities/post-user-access.entity'
import { S3ContentService } from '../s3content/s3content.service'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
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
  PassHolderNotFoundException,
  PassNotFoundException,
  UnsupportedChainPassError,
} from './error/pass.error'
import { createPassHolderQuery } from './pass.util'
export const DEFAULT_PASS_DURATION_MS = ms('30 days')
export const DEFAULT_PASS_GRACE_MS = ms('2 days')
export const DEFAULT_PASS_SYMBOL = 'PASS'
export const MAX_PASSES_PER_REQUEST = 20
export const MAX_PASSHOLDERS_PER_REQUEST = 20

export const MAX_PASSES_PER_CREATOR = 1000

@Injectable()
export class PassService {
  private env: string

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly solService: SolService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly s3ContentService: S3ContentService,
  ) {
    this.env = this.configService.get('infra.env') as string
  }

  async manualPass(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<CreatePassResponseDto> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select(['email'])
      .first()
    if (!user || user.email != 'patrick@passes.com') {
      throw new InternalServerErrorException(
        `Unexpected missing user: ${userId}`,
      )
    }
    const duration =
      createPassDto.duration === undefined &&
      createPassDto.type === PassTypeEnum.SUBSCRIPTION
        ? DEFAULT_PASS_DURATION_MS
        : createPassDto.duration
    const data = {
      id: v4(),
      creator_id: userId,
      title: createPassDto.title,
      description: createPassDto.description,
      type: createPassDto.type,
      price: createPassDto.price,
      duration,
      freetrial: createPassDto.freetrial,
      messages: createPassDto.messages,
      total_supply: createPassDto.totalSupply,
      remaining_supply: createPassDto.totalSupply,
      chain: createPassDto.chain,
      symbol: DEFAULT_PASS_SYMBOL,
      royalties: createPassDto.royalties,
    } as PassEntity
    switch (data.chain) {
      case ChainEnum.SOL:
        data.collection_address = (
          await this.solService.createSolNftCollection(
            userId,
            data.id,
            data.title,
            'PASS',
            data.description,
            'video',
            ContentFormatEnum.VIDEO,
          )
        ).passPubKey
        break
      case ChainEnum.ETH: // TODO
      default:
        throw new UnsupportedChainPassError(
          `can not create a pass on chain ${data.chain}`,
        )
    }
    await this.dbWriter<PassEntity>(PassEntity.table).insert(data)
    return new CreatePassResponseDto(data.id)
  }

  async createPass(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<CreatePassResponseDto> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId, is_creator: true })
      .select(['id', 'username'])
      .first()
    if (!user) {
      throw new InternalServerErrorException(
        `Unexpected missing user: ${userId}`,
      )
    }

    const count = await this.dbReader<PassEntity>(PassEntity.table)
      .andWhere({ creator_id: userId, minted: true })
      .count()
    if (count[0]['count(*)'] >= MAX_PASSES_PER_CREATOR) {
      throw new BadRequestException(
        `${MAX_PASSES_PER_CREATOR} pass limit reached`,
      )
    }
    const duration =
      createPassDto.duration === undefined &&
      createPassDto.type === PassTypeEnum.SUBSCRIPTION
        ? DEFAULT_PASS_DURATION_MS
        : createPassDto.duration
    const data = {
      id: v4(),
      creator_id: userId,
      title: createPassDto.title,
      description: createPassDto.description,
      type: createPassDto.type,
      price: createPassDto.price,
      duration,
      freetrial: createPassDto.freetrial,
      messages: createPassDto.messages,
      total_supply: createPassDto.totalSupply,
      remaining_supply: createPassDto.totalSupply,
      chain: createPassDto.chain,
      symbol: DEFAULT_PASS_SYMBOL,
      royalties: createPassDto.royalties,
    }
    if (
      createPassDto.chain !== ChainEnum.SOL &&
      createPassDto.chain !== ChainEnum.ETH
    ) {
      throw new UnsupportedChainPassError(
        `can not create a pass on chain ${createPassDto.chain}`,
      )
    }
    await this.dbWriter<PassEntity>(PassEntity.table).insert(data)

    return new CreatePassResponseDto(data.id)
  }

  async mintPass(
    userId: string,
    mintPassDto: MintPassRequestDto,
  ): Promise<MintPassResponseDto> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId, is_creator: true })
      .select(['id', 'username'])
      .first()
    if (!user) {
      throw new InternalServerErrorException(
        `Unexpected missing user: ${userId}`,
      )
    }
    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({
        creator_id: userId,
        id: mintPassDto.passId,
      })
      .select('*')
      .first()
    if (!pass) {
      throw new NotFoundException('No pass found')
    }

    // if (
    //   !(await this.s3ContentService.doesObjectExist(
    //     getCollectionImageUri(null, pass.id, ContentFormatEnum.IMAGE),
    //   ))
    // ) {
    //   throw new NotFoundException('Image is not uploaded')
    // }

    if (!pass || pass.collection_address) {
      throw new NotFoundException('Pass can not be minted')
    }
    let collectionAddress: string | undefined = undefined
    if (this.env === 'dev') {
      collectionAddress = '123456789'
    } else {
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
    }
    await this.dbWriter<PassEntity>(PassEntity.table)
      .update({ collection_address: collectionAddress })
      .where({ id: pass.id })
    return new MintPassResponseDto(true)
  }

  async findPass(passId: string): Promise<PassDto> {
    const pass = await this.dbReader<PassEntity>(PassEntity.table)
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
    const { creatorId, passId } = getPassHoldingsRequestDto
    let query = this.dbReader<PassHolderEntity>(PassHolderEntity.table)
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

    if (creatorId) {
      query = query.andWhere(`${UserEntity.table}.id`, creatorId)
    }

    if (passId) {
      query = query.andWhere(`${PassEntity.table}.id`, passId)
    }
    query = createPassHolderQuery(query, getPassHoldingsRequestDto)
    const passHolders = await query

    return passHolders.map((passHolder) => new PassHolderDto(passHolder))
  }

  async getPassHolders(
    userId: string,
    getPassHoldersRequest: GetPassHoldersRequestDto,
  ): Promise<PassHolderDto[]> {
    const { holderId, passId, activeOnly } = getPassHoldersRequest
    let query = this.dbReader<PassHolderEntity>(PassHolderEntity.table)
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
        `${PassEntity.table}.total_supply`,
        `${PassEntity.table}.remaining_supply`,
        `${PassEntity.table}.price`,
        `${PassEntity.table}.freetrial`,
        `${PassEntity.table}.title`,
        `${PassEntity.table}.description`,
        `${PassEntity.table}.type`,
        `${UserEntity.table}.username as holder_username`,
        `${UserEntity.table}.display_name as holder_display_name`,
      ])

    if (activeOnly) {
      query = query.andWhere(function () {
        return this.whereNull(`${PassHolderEntity.table}.expires_at`).orWhere(
          `${PassHolderEntity.table}.expires_at`,
          '>',
          Date.now(),
        )
      })
    }
    if (passId) {
      query = query.andWhere(`${PassEntity.table}.id`, passId)
    }
    if (holderId) {
      query = query.andWhere(`${PassHolderEntity.table}.holder_id`, holderId)
    }
    query = createPassHolderQuery(query, getPassHoldersRequest)
    const passHolders = await query

    return passHolders.map((passHolder) => new PassHolderDto(passHolder))
  }

  async findPassesByCreator(
    getCreatorPassesRequestDto: GetCreatorPassesRequestDto,
  ) {
    const { createdAt, search, creatorId, lastId, pinned } =
      getCreatorPassesRequestDto
    let query = this.dbReader<PassEntity>(PassEntity.table)
      .whereNotNull('collection_address')
      .andWhere({ creator_id: creatorId })
      .select('*')
    if (pinned) {
      query = query.whereNotNull('pinned_at')
    } else if (pinned === false) {
      query = query.whereNull('pinned_at')
    }

    query = createPaginatedQuery(
      query,
      PassEntity.table,
      PassEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    if (search && search.length) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.andWhere(function () {
        return this.whereILike(
          `${PassEntity.table}.title`,
          likeClause,
        ).orWhereILike(`${PassEntity.table}.description`, likeClause)
      })
    }

    const passes = await query.limit(MAX_PASSES_PER_REQUEST)
    return passes.map((pass) => new PassDto(pass))
  }

  async getExternalPasses(
    getExternalPassesRequestDto: GetExternalPassesRequestDto,
  ) {
    const { lastId, createdAt, search, creatorId } = getExternalPassesRequestDto
    let query = this.dbReader<PassEntity>(PassEntity.table)
      .whereNull('creator_id')
      .select('*')

    query = createPaginatedQuery(
      query,
      PassEntity.table,
      PassEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    if (creatorId) {
      const userExternalPasses = await this.dbReader(
        UserExternalPassEntity.table,
      )
        .where({ user_id: creatorId })
        .select('pass_id')
      query = query.whereIn(
        `${PassEntity.table}.id`,
        userExternalPasses.map((externalPass) => externalPass.pass_id),
      )
    }
    if (search && search.length) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.andWhere(function () {
        return this.whereILike(
          `${PassEntity.table}.title`,
          likeClause,
        ).orWhereILike(`${PassEntity.table}.description`, likeClause)
      })
    }

    const passes = await query.limit(MAX_PASSES_PER_REQUEST)
    return passes.map((pass) => new PassDto(pass))
  }

  async updatePass(
    userId: string,
    passId: string,
    updatePassDto: UpdatePassRequestDto,
  ) {
    const currentPass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .select(['id', 'creator_id'])
      .first()

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.creator_id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const data = {
      title: updatePassDto.title,
      description: updatePassDto.description,
    }

    Object.keys(data).forEach((key) =>
      data[key] === undefined ? delete data[key] : {},
    )

    await this.dbWriter<PassEntity>(PassEntity.table)
      .update(data)
      .where({ id: passId })
  }

  async createPassHolder(
    userId: string,
    passId: string,
    walletAddress?: string,
  ) {
    const id = v4()

    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .select('*')
      .whereNotNull('collection_address')
      .andWhere({ id: passId })
      .first()

    if (!pass) {
      throw new NotFoundException('No pass found')
    }

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION && pass.duration
        ? new Date(Date.now() + pass.duration + DEFAULT_PASS_GRACE_MS)
        : undefined
    let walletId = ''
    if (walletAddress) {
      await this.walletService.createUnauthenticatedWallet(userId, {
        walletAddress,
        chain: pass.chain,
      })
      walletId =
        (
          await this.dbWriter<WalletEntity>(WalletEntity.table)
            .where({
              address: walletAddress,
              chain: pass.chain,
            })
            .select('id')
            .first()
        )?.id ?? ''
    } else {
      const wallet = await this.walletService.getDefaultWallet(
        userId,
        pass.chain,
      )
      walletId = wallet.walletId
      walletAddress = wallet.address
    }

    const data = {
      id,
      pass_id: passId,
      wallet_id: walletId,
      holder_id: userId,
      expires_at: expiresAt,
      messages: pass.messages,
      chain: pass.chain,
    } as PassHolderEntity

    switch (pass.chain) {
      case ChainEnum.SOL:
        data.address = (
          await this.solService.createNftPass(
            pass.id,
            id,
            pass.title,
            pass.symbol,
            pass.description,
            walletAddress,
            pass.royalties,
            'video',
            ContentFormatEnum.VIDEO,
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
    await this.dbWriter<PassHolderEntity>(PassHolderEntity.table).insert(data)
    await this.passPurchased(userId, passId)

    return {
      id,
      passId: pass.id,
      holderId: userId,
      expiresAt,
    }
  }

  async useSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .decrement('remaining_supply', 1)
  }

  async addSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .increment('total_supply', 1)
  }

  async freeSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .increment('remaining_supply', 1)
  }

  async renewPass(passHolderId: string) {
    const passHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
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
    await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
      .where({ id: passHolder.id })
      .update({
        expires_at: expiresAt,
        messages: passHolder.pass_messages,
      })

    return expiresAt
  }

  async revertPassHolder(passHolderId: string) {
    const passHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .select([
        `${PassHolderEntity.table}.id`,
        `${PassHolderEntity.table}.expires_at`,
        `${PassEntity.table}.type`,
        `${PassEntity.table}.duration`,
      ])
      .first()

    if (!passHolder) {
      throw new ForbiddenPassException("can't extend non subscription pass")
    }

    if (passHolder.type === PassTypeEnum.LIFETIME) {
      await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
        .update({ expires_at: new Date(0) })
        .where({ id: passHolderId })
    } else if (passHolder.type === PassTypeEnum.SUBSCRIPTION) {
      const oldDate = passHolder.expires_at
      const newDate = new Date(oldDate.valueOf() - passHolder.duration)
      await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
        .update({ expires_at: newDate })
        .where({ id: passHolderId })
      const filteredIds = (
        await this.dbReader<PostPassHolderAccessEntity>(
          PostPassHolderAccessEntity.table,
        )
          .where({ pass_holder_id: passHolderId })
          .andWhere('created_at', '>=', newDate)
          .andWhere('created_at', '<=', oldDate)
          .select('post_user_access_id')
      ).map((postPassHolderAccess) => postPassHolderAccess.post_user_access_id)
      await this.dbWriter<PostPassHolderAccessEntity>(
        PostPassHolderAccessEntity.table,
      )
        .where({ pass_holder_id: passHolderId })
        .andWhere('created_at', '>=', newDate)
        .andWhere('created_at', '<=', oldDate)
        .delete()
      await this.dbWriter<PostUserAccessEntity>(PostUserAccessEntity.table)
        .leftJoin(
          PostPassHolderAccessEntity.table,
          `${PostPassHolderAccessEntity.table}.post_user_access_id`,
          `${PostUserAccessEntity.table}.id`,
        )
        .whereIn(`${PostUserAccessEntity.table}.id`, filteredIds)
        .whereNull(`${PostPassHolderAccessEntity.table}.id`)
        .whereNull(`${PostUserAccessEntity.table}.payin_id`)
        .delete()
    }
  }

  async registerRenewPass(
    userId: string,
    passHolderId: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked } = await this.registerRenewPassData(
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

    const passHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
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
    if (!payinMethod) {
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

    const checkPayin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .andWhere({ target: target })
      .select('id')
      .first()
    const checkHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .where({
        id: passHolderId,
        holder_id: userId,
      })
      .whereNotNull('address')
      .select('*')
      .first()
    if (!checkHolder) {
      throw new PassHolderNotFoundException(
        `passholder ${passHolderId} not found`,
      )
    }
    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (checkPayin !== undefined) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkHolder.holder_id !== userId) {
      blocked = BlockedReasonEnum.IS_NOT_PASSHOLDER
    }

    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({ id: checkHolder.pass_id })
      .select('price')
      .first()
    if (!pass) {
      throw new PassNotFoundException(`passholder ${passHolderId} not found`)
    }
    return { amount: pass.price, target, blocked }
  }

  async registerBuyPass(
    userId: string,
    passId: string,
    walletAddress?: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked, amountEth } =
      await this.registerBuyPassData(userId, passId)
    if (blocked) {
      throw new InvalidPayinRequestError(blocked)
    }

    // free pass or free trial
    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .select('creator_id', 'type', 'freetrial')
      .first()
    if (!pass || !pass.creator_id) {
      throw new PassNotFoundException(`pass ${passId} not found`)
    }

    // stop people from following scenario -
    //    1. get free trial for pass
    //    2. transfer pass after free trial
    //    3. get new pass with free trial

    const passPurchaseQuery = this.dbReader<PassPurchaseEntity>(
      PassPurchaseEntity.table,
    )
      .where({
        user_id: userId,
        pass_id: passId,
      })
      .select('id')
      .first()

    if (
      amount === 0 ||
      (pass.freetrial &&
        pass.type === PassTypeEnum.SUBSCRIPTION &&
        (await passPurchaseQuery))
    ) {
      await this.useSupply(passId)
      await this.createPassHolder(userId, passId)
      return new RegisterPayinResponseDto()
    }

    const callbackInput: CreateNftPassPayinCallbackInput = {
      userId,
      passId,
      walletAddress,
    }
    if (!payinMethod) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    return await this.payService.registerPayin({
      userId,
      target,
      amount: amount,
      amountEth: amountEth,
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

    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .select(['price', 'remaining_supply', 'eth_price'])
      .first()
    if (!pass) {
      throw new PassNotFoundException(`pass ${passId} not found`)
    }

    const checkPayin = await this.dbReader<PayinEntity>(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .andWhere({ target: target })
      .select('id')
      .first()
    const checkHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .where({
        pass_id: passId,
        holder_id: userId,
      })
      .select('id')
      .first()

    let blocked: BlockedReasonEnum | undefined = undefined
    if (await this.payService.checkPayinBlocked(userId)) {
      blocked = BlockedReasonEnum.PAYMENTS_DEACTIVATED
    } else if (checkPayin) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkHolder) {
      blocked = BlockedReasonEnum.ALREADY_OWNS_PASS
    } else if (pass.remaining_supply === 0) {
      blocked = BlockedReasonEnum.INSUFFICIENT_SUPPLY
    }

    return {
      amount: pass.price,
      target,
      blocked,
      amountEth: pass.eth_price ?? undefined,
    }
  }

  /**
   * subscription pass exists in your wallet, but no subscription is found
   * occurs when pass is transferred on chain or subscription was cancelled and pass still held
   *
   * @param userId
   * @param passHolderId
   */
  async addPassSubscription(userId: string, passHolderId: string) {
    const passHolder = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassHolderEntity.table}.pass_id`,
      )
      .where(`${PassHolderEntity.table}.id`, passHolderId)
      .andWhere(`${PassHolderEntity.table}.holder_id`, userId)
      .select(`${PassEntity.table}.price`, `${PassEntity.table}.type`)
      .first()

    if (!passHolder) {
      throw new ForbiddenPassException('user does not own pass')
    }

    if (passHolder.type !== PassTypeEnum.SUBSCRIPTION) {
      throw new ForbiddenPassException('pass is not a subscription')
    }

    await this.payService.subscribe({
      userId,
      passHolderId,
      amount: passHolder.price,
      target: CryptoJS.SHA256(`nft-pass-holder-${passHolderId}`).toString(
        CryptoJS.enc.Hex,
      ),
    })
  }

  async passPurchased(userId: string, passId: string) {
    await this.dbWriter<PassPurchaseEntity>(PassPurchaseEntity.table)
      .insert({
        pass_id: passId,
        user_id: userId,
      })
      .onConflict(['pass_id', 'user_id'])
      .ignore()
  }

  async pinPass(userId: string, passId: string): Promise<boolean> {
    return (
      (await this.dbWriter<PassEntity>(PassEntity.table)
        .where({ creator_id: userId, id: passId })
        .update({ pinned_at: this.dbWriter.fn.now() })) === 1
    )
  }

  async unpinPass(userId: string, passId: string): Promise<boolean> {
    return (
      (await this.dbWriter<PassEntity>(PassEntity.table)
        .where({ creator_id: userId, id: passId })
        .update({ pinned_at: null })) === 1
    )
  }

  async checkPass(userId: string, passId: string) {
    if (
      !(await this.dbReader<PassEntity>(PassEntity.table)
        .where({ creator_id: userId, id: passId })
        .first())
    ) {
      throw new PassNotFoundException('pass does not exist or unowned by user')
    }
  }

  async validatePassIds(userId: string, passIds: string[]): Promise<void> {
    const filteredPasses = await this.dbReader<PassEntity>(PassEntity.table)
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
    await Promise.all(
      passIds.map(async (passId) => {
        if (!filteredPassIds.has(passId)) {
          throw new PassNotFoundException('cant find pass for user')
        }
      }),
    )
  }
}
