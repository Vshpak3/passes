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
import { PayinMethodEnum } from '../payment/enum/payin-method.enum'
import { InvalidPayinRequestError } from '../payment/error/payin.error'
import { PaymentService } from '../payment/payment.service'
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import { PASS_NOT_EXIST, PASS_NOT_OWNED_BY_USER } from './constants/errors'
import { CreatePassDto } from './dto/create-pass.dto'
import { GetPassDto } from './dto/get-pass.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'
import { PassTypeEnum } from './enum/pass.enum'
import { ForbiddenPassException } from './error/pass.error'

export const NFT_PASS_CREATOR_CUT_FIAT = 0.8
export const NFT_PASS_CREATOR_CUT_CRYPTO = 0.9

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
    createPassDto: CreatePassDto,
  ): Promise<GetPassDto> {
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
      creator: userId,
      solNftCollection: solNftCollectionDto.id,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
      duration,
    })

    await this.dbWriter(PassEntity.table).insert(data)
    return new GetPassDto(data)
  }

  async findOne(id: string): Promise<GetPassDto> {
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

    return new GetPassDto(pass)
  }

  async findOwnedPasses(userId: string, creatorId?: string) {
    let query = this.dbReader(PassEntity.table)
      .rightJoin(
        `${PassOwnershipEntity.table} as passOwnership`,
        `${PassEntity.table}.id`,
        `passOwnership.pass_id`,
      )
      .innerJoin(
        `${UserEntity.table} as owner`,
        `passOwnership.holder_id`,
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

    return (await query).map((pass) => new GetPassDto(pass))
  }

  async findPassesByCreator(creatorId: string) {
    return (
      await this.dbReader(PassEntity.table).where('creator_id', creatorId)
    ).map((pass) => new GetPassDto(pass))
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
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
    return new GetPassDto(data)
  }

  async createPass(userId: string, passId: string) {
    const id = v4()

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
        ...PassEntity.populate<PassEntity>([
          'creator',
          'solNftCollection',
          'duration',
          'type',
        ]),
      ])
      .where(`${PassEntity.table}.id`, id)
      .first()

    const expiresAt =
      pass.type === PassTypeEnum.SUBSCRIPTION
        ? Date.now() + pass.duration + DEFAULT_PASS_GRACE_MS
        : undefined

    const userCustodialWallet = await this.walletService.getUserCustodialWallet(
      userId,
    )

    const solNftDto = await this.solService.createNftPass(
      userId,
      new PublicKey(userCustodialWallet.address),
      pass.solNftCollection_id,
    )
    const data = PassOwnershipEntity.toDict<PassOwnershipEntity>({
      id,
      pass: passId,
      holder: userId,
      expiresAt: expiresAt,
      solNft: solNftDto.id,
    })

    await this.dbWriter(PassOwnershipEntity.table).insert(data)

    return {
      id,
      passId: pass.id,
      holderId: userId,
      expiresAt,
    }
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const data = PassOwnershipEntity.toDict<PassOwnershipEntity>({
      holder: userId,
      pass: passId,
    })
    const ownership = await this.dbReader(PassOwnershipEntity.table)
      .where(data)
      .first()
    return !!ownership
  }

  async renewPass(passOwnershipId: string) {
    const passOwnership = await this.dbReader(PassOwnershipEntity.table)
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassOwnershipEntity}.pass_id`,
      )
      .where(`${PassOwnershipEntity.table}.id`, passOwnershipId)
      .select([
        `${PassOwnershipEntity.table}.id`,
        `${PassOwnershipEntity.table}.expires_at`,
        `${PassEntity.table}.duration`,
      ])
      .first()

    if (!passOwnership.expires_at) {
      throw new ForbiddenPassException("can't extend non subscription pass")
    }

    if (passOwnership.expires_at < Date.now()) {
      await this.dbWriter(PassOwnershipEntity.table)
        .where('id', passOwnership.id)
        .increment('expires_at', passOwnership.duration)
    } else {
      await this.dbWriter(PassOwnershipEntity.table)
        .where('id', passOwnership.id)
        .update(
          'expires_at',
          Date.now() + passOwnership.duration + DEFAULT_PASS_GRACE_MS,
        )
    }
    return (
      await this.dbReader(PassOwnershipEntity.table)
        .where('id', passOwnership.id)
        .select(
          ...PassOwnershipEntity.populate<PassOwnershipEntity>(['expiresAt']),
        )
        .first()
    ).expires_at
  }

  async registerRenewPass(
    userId: string,
    passOwnershipId: string,
    payinMethod?: PayinMethodDto,
  ) {
    const { amount, target, blocked } = await this.registerCreatePassData(
      userId,
      passOwnershipId,
    )
    if (blocked) {
      throw new InvalidPayinRequestError('invalid nft pass renewal')
    }

    // free pass
    if (amount === 0) {
      await this.renewPass(passOwnershipId)
      return {
        payinId: '',
        payinMethod: { method: PayinMethodEnum.NONE },
        amount: 0,
      }
    }

    const passOwnership = await this.dbReader(PassOwnershipEntity.table)
      .join(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${PassOwnershipEntity}.pass_id`,
      )
      .where(`${PassOwnershipEntity.table}.id`, passOwnershipId)
      .select([`${PassEntity.table}.creator_id`])
      .first()

    const callbackInput: RenewNftPassPayinCallbackInput = {
      passOwnershipId,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    const creatorCut =
      payinMethod.method === PayinMethodEnum.CIRCLE_CARD
        ? NFT_PASS_CREATOR_CUT_FIAT
        : NFT_PASS_CREATOR_CUT_CRYPTO
    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.CREATE_NFT_PASS,
      callbackInputJSON: JSON.stringify(callbackInput),
      creatorShares: [
        { creatorId: passOwnership.creator_id, amount: amount * creatorCut },
      ],
    })
  }

  async registerRenewPassData(
    userId: string,
    passOwnershipId: string,
  ): Promise<PayinDataDto> {
    const target = CryptoJS.SHA256(
      `nft-pass-ownership-${passOwnershipId}`,
    ).toString(CryptoJS.enc.Hex)

    const checkPayin = await this.dbReader(PayinEntity.table)
      .whereIn('payin_status', [
        PayinStatusEnum.CREATED,
        PayinStatusEnum.PENDING,
      ])
      .where('target', target)
      .select('id')
      .first()
    const checkOwnership = await this.dbReader(PassOwnershipEntity.table)
      .where(
        PassOwnershipEntity.toDict<PassOwnershipEntity>({
          id: passOwnershipId,
          holder: userId,
        }),
      )
      .select(
        ...PassOwnershipEntity.populate<PassOwnershipEntity>([
          'id',
          'holder',
          'pass',
        ]),
      )
      .first()

    const blocked =
      checkPayin !== undefined || checkOwnership.holder_id !== userId

    const pass = await this.dbReader(PassEntity.table)
      .where('id', checkOwnership.pass_id)
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

    // free pass
    if (amount === 0) {
      await this.createPass(userId, passId)
      return {
        payinId: '',
        payinMethod: { method: PayinMethodEnum.NONE },
        amount: 0,
      }
    }

    const pass = await this.dbReader(PassEntity.table)
      .where('id', passId)
      .select('creator_id', 'type')
      .first()

    const callbackInput: CreateNftPassPayinCallbackInput = {
      userId,
      passId,
    }
    if (payinMethod === undefined) {
      payinMethod = await this.payService.getDefaultPayinMethod(userId)
    }

    const creatorCut =
      payinMethod.method === PayinMethodEnum.CIRCLE_CARD
        ? NFT_PASS_CREATOR_CUT_FIAT
        : NFT_PASS_CREATOR_CUT_CRYPTO
    return await this.payService.registerPayin({
      userId,
      target,
      amount,
      payinMethod,
      callback: PayinCallbackEnum.CREATE_NFT_PASS,
      callbackInputJSON: JSON.stringify(callbackInput),
      creatorShares: [
        { creatorId: pass.creator_id, amount: amount * creatorCut },
      ],
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
      .where('target', target)
      .select('id')
      .first()
    const checkOwnership = await this.dbReader(PassOwnershipEntity.table)
      .where(
        PassOwnershipEntity.toDict<PassOwnershipEntity>({
          pass: passId,
          holder: userId,
        }),
      )
      .select('id')
      .first()
    const blocked = checkPayin !== undefined || checkOwnership !== undefined

    return { amount: pass.price, target, blocked }
  }
}
