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
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { OrderEnum } from '../../util/dto/page.dto'
import { isEnv } from '../../util/env'
import { createPaginatedQuery } from '../../util/page.util'
import { validateAddress } from '../../util/wallet.util'
import { EthService } from '../eth/eth.service'
import {
  CreateNftPassPayinCallbackInput,
  RenewNftPassPayinCallbackInput,
} from '../payment/callback.types'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { PayinMethodDto } from '../payment/dto/payin-method.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { BlockedReasonEnum } from '../payment/enum/blocked-reason.enum'
import { PayinCallbackEnum } from '../payment/enum/payin.callback.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import {
  EXPIRING_DURATION_MS,
  PaymentService,
} from '../payment/payment.service'
import { PostUserAccessEntity } from '../post/entities/post-user-access.entity'
import {
  getCollectionMediaUri,
  getNftMediaUri,
} from '../s3content/s3.nft.helper'
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
import { GetPassesRequestDto } from './dto/get-pass.dto'
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
import { AccessTypeEnum } from './enum/access.enum'
import { PassTypeEnum } from './enum/pass.enum'
import { PassAnimationEnum } from './enum/pass-animation.enum'
import { PassImageEnum } from './enum/pass-image.enum'
import {
  BadPassPropertiesException,
  ForbiddenPassException,
  PassHolderNotFoundException,
  PassNotFoundException,
  UnsupportedChainPassError,
} from './error/pass.error'
import { createPassHolderQuery } from './pass.util'

const DEFAULT_PASS_DURATION_MS = ms('30 days')
const DEFAULT_PASS_SYMBOL = 'PASS'
const MAX_PASSES_PER_REQUEST = 20
export const MAX_PASSHOLDERS_PER_REQUEST = 20

const MAX_PASSES_PER_CREATOR = 1000
const MAX_PINNED_PASSES = 3 // @share-with-frontend pass
const MAX_PASSES_PER_WEEK = 5

@Injectable()
export class PassService {
  private nftS3Bucket: string

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly solService: SolService,
    private readonly ethService: EthService,

    private readonly walletService: WalletService,
    @Inject(forwardRef(() => PaymentService))
    private readonly payService: PaymentService,
    private readonly s3ContentService: S3ContentService,
  ) {
    this.nftS3Bucket = configService.get('s3_bucket.nft') as string
  }

  async manualPass(
    userId: string,
    createPassDto: CreatePassRequestDto,
  ): Promise<CreatePassResponseDto> {
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
      animation_type: createPassDto.animationType,
      image_type: createPassDto.imageType,
      access_type: createPassDto.accessType,
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
            createPassDto.imageType,
            createPassDto.animationType ?? undefined,
          )
        ).passPubKey
        break
      case ChainEnum.ETH:
        data.collection_address = await this.ethService.createEthNftCollection(
          data.id,
          data.title,
          'PASS',
          data.royalties,
        )
        break
      default:
        throw new UnsupportedChainPassError(
          `can not create a pass on chain ${data.chain}`,
        )
    }
    await createOrThrowOnDuplicate(
      () => this.dbWriter<PassEntity>(PassEntity.table).insert(data),
      this.logger,
      "can't use same pass title",
    )
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

    const passesThisWeek = await this.dbReader<PassEntity>(PassEntity.table)
      .andWhere({ creator_id: userId, minted: true })
      .andWhere('created_at', '>', new Date(Date.now() - ms('1 week')))
      .count()
    if (passesThisWeek[0]['count(*)'] >= MAX_PASSES_PER_WEEK) {
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
      animation_type: createPassDto.animationType,
      image_type: createPassDto.imageType,
      access_type: createPassDto.accessType,
    }
    if (
      createPassDto.chain !== ChainEnum.SOL &&
      createPassDto.chain !== ChainEnum.ETH
    ) {
      throw new UnsupportedChainPassError(
        `can not create a pass on chain ${createPassDto.chain}`,
      )
    }
    await createOrThrowOnDuplicate(
      () => this.dbWriter<PassEntity>(PassEntity.table).insert(data),
      this.logger,
      "can't use same pass title",
    )

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

    if (
      !isEnv('dev') &&
      !(await this.s3ContentService.doesObjectExist(
        getCollectionMediaUri(null, pass.id, pass.image_type),
      ))
    ) {
      throw new NotFoundException('Image is not uploaded')
    }

    if (
      pass.animation_type &&
      !(await this.s3ContentService.doesObjectExist(
        getCollectionMediaUri(null, pass.id, pass.animation_type),
      ))
    ) {
      throw new NotFoundException('Image is not uploaded')
    }

    if (!pass || pass.collection_address) {
      throw new NotFoundException('Pass can not be minted')
    }
    let collectionAddress: string | undefined = undefined
    if (isEnv('dev')) {
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
              pass.image_type,
              pass.animation_type ?? undefined,
            )
          ).passPubKey
          break
        case ChainEnum.ETH:
          collectionAddress = await this.ethService.createEthNftCollection(
            pass.id,
            pass.title,
            'PASS',
            pass.royalties,
          )
          break
        default:
          throw new UnsupportedChainPassError(
            `can not create a pass on chain ${pass.chain}`,
          )
      }
    }
    await this.dbWriter<PassEntity>(PassEntity.table)
      .update({ collection_address: collectionAddress, minted: true })
      .where({ id: pass.id })
    return new MintPassResponseDto(true)
  }

  async getPass(passId: string): Promise<PassDto> {
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

  async getPassHoldings(
    userId: string,
    getPassHoldingsRequestDto: GetPassHoldingsRequestDto,
  ) {
    const {
      createdAt,
      lastId,
      creatorId,
      passId,
      passType,
      expired,
      search,
      order,
    } = getPassHoldingsRequestDto
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
        `${PassEntity.table}.messages as total_messages`,
        `${PassHolderEntity.table}.*`,
        `${UserEntity.table}.username as creator_username`,
        `${UserEntity.table}.display_name as creator_display_name`,
      )

    if (passType) {
      query = query.andWhere(`${PassEntity.table}.type`, passType)
    }
    if (expired !== undefined) {
      query = query.andWhere(
        `${PassHolderEntity.table}.expires_at`,
        expired ? '<=' : '>',
        new Date(),
      )
    }

    if (creatorId) {
      query = query.andWhere(`${UserEntity.table}.id`, creatorId)
    }

    if (passId) {
      query = query.andWhere(`${PassEntity.table}.id`, passId)
    }
    query = createPaginatedQuery(
      query,
      PassHolderEntity.table,
      PassHolderEntity.table,
      'created_at',
      order,
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
        `${PassEntity.table}.messages as total_messages`,
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
          new Date(),
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

  async getCreatorPasses(getCreatorPassesRequestDto: GetPassesRequestDto) {
    const { createdAt, search, creatorId, lastId, pinned, type } =
      getCreatorPassesRequestDto
    let query = this.dbReader<PassEntity>(PassEntity.table)
      .andWhere({ minted: true })
      .select('*')
    if (creatorId) {
      query = query.andWhere({ creator_id: creatorId })
    }

    if (type) {
      query = query.andWhere('type', type)
    }
    if (pinned) {
      query = query.whereNotNull('pinned_at')
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

  async getExternalPasses(getExternalPassesRequestDto: GetPassesRequestDto) {
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
      .whereNotNull('creator_id')
      .andWhere({ id: passId })
      .first()

    if (!pass) {
      throw new NotFoundException('No pass found')
    }

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION && pass.duration
        ? new Date(Date.now() + pass.duration + EXPIRING_DURATION_MS)
        : undefined
    let walletId = ''

    if (walletAddress && !validateAddress(walletAddress, pass.chain)) {
      walletAddress = undefined
    }

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
      image_type: pass.image_type,
      animation_type: pass.animation_type,
      access_type: pass.access_type,
    } as PassHolderEntity

    await this.copyNftObject(
      pass.id,
      data.id,
      pass.image_type,
      pass.animation_type ?? undefined,
    )

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
            pass.image_type,
            pass.animation_type ?? undefined,
          )
        ).mintPubKey
        break
      case ChainEnum.ETH:
        data.address = pass.collection_address as string
        // DEPRECRATED: Randomized tokenId
        // for (let i = 0; i < MINT_RETRIES; ++i) {
        //   try {
        //     const tokenId = CryptoJS.SHA256(`${data.id}-${i}`).toString(
        //       CryptoJS.enc.Hex,
        //     )
        //     data.token_id = tokenId
        //     await this.dbWriter<PassHolderEntity>(
        //       PassHolderEntity.table,
        //     ).insert(data)
        //   } catch (err) {
        //     continue
        //   }
        //   break
        // }
        data.token_id = await this.ethService.createEthNft(
          pass.creator_id ?? '',
          pass.id,
          data.id,
          pass.title,
          pass.symbol,
          pass.description,
          pass.collection_address ?? '',
          walletAddress,
          pass.image_type,
          pass.animation_type ?? undefined, // TODO: be dynamic
        )
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

  async copyNftObject(
    passId: string,
    passHolderId: string,
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ) {
    await this.s3ContentService.copyObject({
      Bucket: this.nftS3Bucket,
      Key: getNftMediaUri(null, passId, passHolderId, imageType),
      CopySource: `/${this.nftS3Bucket}/${getCollectionMediaUri(
        null,
        passId,
        imageType,
      )}`,
    })
    if (animationType) {
      await this.s3ContentService.copyObject({
        Bucket: this.nftS3Bucket,
        Key: getNftMediaUri(null, passId, passHolderId, animationType),
        CopySource: `/${this.nftS3Bucket}/${getCollectionMediaUri(
          null,
          passId,
          animationType,
        )}`,
      })
    }
  }

  async useSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .whereNotNull('remaining_supply')
      .decrement('remaining_supply', 1)
  }

  async addSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .whereNotNull('total_supply')
      .increment('total_supply', 1)
  }

  async freeSupply(passId: string) {
    await this.dbWriter<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .whereNotNull('remaining_supply')
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
      Date.now() + passHolder.duration + EXPIRING_DURATION_MS,
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
        `${PassHolderEntity.table}.access_type`,
        `${PassEntity.table}.type`,
        `${PassEntity.table}.duration`,
      ])
      .first()

    if (!passHolder) {
      throw new ForbiddenPassException("can't extend non subscription pass")
    }

    let oldDate = new Date(Date.now() + ms('1 year'))
    let newDate = new Date(0)
    if (passHolder.type === PassTypeEnum.SUBSCRIPTION) {
      oldDate = passHolder.expires_at
      newDate = new Date(oldDate.valueOf() - passHolder.duration)
      await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
        .update({ expires_at: newDate })
        .where({ id: passHolderId })
    }

    await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
      .update({ expires_at: newDate })
      .where({ id: passHolderId })

    if (passHolder.access_type === AccessTypeEnum.ACCOUNT_ACCESS) {
      const accesses = await this.dbReader<PostUserAccessEntity>(
        PostUserAccessEntity.table,
      )
        .whereLike({ pass_holder_ids: `%${passHolderId}$` })
        .andWhere('created_at', '>=', newDate)
        .andWhere('created_at', '<=', oldDate)
        .select('id', 'pass_holder_ids', 'payin_id')
      await Promise.allSettled(
        accesses.map(async (access) => {
          let ids: string[] = JSON.parse(access.pass_holder_ids)
          ids = ids.filter((id) => id !== passHolder.id)
          if (!access.payin_id && !ids.length) {
            await this.dbWriter<PostUserAccessEntity>(
              PostUserAccessEntity.table,
            )
              .where({ id: access.id })
              .update({ paid_at: null, pass_holder_ids: JSON.stringify(ids) })
          } else {
            await this.dbWriter<PostUserAccessEntity>(
              PostUserAccessEntity.table,
            )
              .where({ id: access.id })
              .update({ pass_holder_ids: JSON.stringify(ids) })
          }
        }),
      )
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
    payinMethod?: PayinMethodDto,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(`nft-pass-holder-${passHolderId}`).toString(
      CryptoJS.enc.Hex,
    )

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
    } else if (await this.payService.checkPayinTargetBlocked(target)) {
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
    if (!this.payService.validatePayinData(userId, payinMethod)) {
      blocked = BlockedReasonEnum.NO_PAYIN_METHOD
    }

    return { amount: pass.price, target, blocked }
  }

  async registerPurchasePass(
    userId: string,
    passId: string,
    walletAddress?: string,
    payinMethod?: PayinMethodDto,
  ): Promise<RegisterPayinResponseDto> {
    const { amount, target, blocked, amountEth } =
      await this.registerPurchasePassData(userId, passId)
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

  async registerPurchasePassData(
    userId: string,
    passId: string,
    payinMethod?: PayinMethodDto,
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
    } else if (await this.payService.checkPayinTargetBlocked(target)) {
      blocked = BlockedReasonEnum.PURCHASE_IN_PROGRESS
    } else if (checkHolder) {
      // Don't block someone from repurchasing
      // blocked = BlockedReasonEnum.ALREADY_OWNS_PASS
    } else if (pass.remaining_supply === 0) {
      blocked = BlockedReasonEnum.INSUFFICIENT_SUPPLY
    }

    if (!this.payService.validatePayinData(userId, payinMethod)) {
      blocked = BlockedReasonEnum.NO_PAYIN_METHOD
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
    if (
      (
        await this.dbWriter<PassEntity>(PassEntity.table)
          .whereNotNull('pinned_at')
          .andWhere('creator_id', userId)
          .count('*')
      )[0]['count(*)'] >= MAX_PINNED_PASSES
    ) {
      throw new BadPassPropertiesException('Too many pinned passes')
    }
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
      .whereIn(`${PassEntity.table}.id`, passIds)
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
