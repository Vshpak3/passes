import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import {
  PASS_NOT_EXIST,
  PASS_NOT_OWNED_BY_USER,
  USER_ALREADY_OWNS_PASS,
} from './constants/errors'
import { CreatePassDto } from './dto/create-pass.dto'
import { GetPassDto } from './dto/get-pass.dto'
import { GetPassOwnershipDto } from './dto/get-pass-ownership.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'

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
      user,
      createPassDto.title,
      user.username.replace(/[^a-zA-Z]/g, '').substring(0, 10),
      createPassDto.description,
      createPassDto.imageUrl,
    )

    const data = PassEntity.toDict<PassEntity>({
      owner: userId,
      solNftCollection: solNftCollectionDto.id,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
    })

    await this.dbWriter(PassEntity.table).insert(data)
    return new GetPassDto(data)
  }

  async findOne(id: string): Promise<GetPassDto> {
    const pass = await this.dbReader(PassEntity.table)
      .innerJoin(
        `${UserEntity.table} as owner`,
        `${PassEntity.table}.owner_id`,
        'owner.id',
      )
      .innerJoin(
        `${SolNftCollectionEntity.table} as solNftCollection`,
        `${PassEntity.table}.sol_nft_collection_id`,
        'solNftCollection.id',
      )
      .select([
        '*',
        ...PassEntity.populate<PassEntity>(['owner', 'solNftCollection']),
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

    return await query
  }

  async findPassesByCreator(creatorId: string) {
    return await this.dbReader(PassEntity.table).where('owner_id', creatorId)
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
    const currentPass = await this.dbReader(PassEntity.table)
      .where({ id: passId })
      .first()

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.owner_id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const data = PassEntity.toDict<PassEntity>(updatePassDto)
    await this.dbWriter(PassEntity.table).update(data).where({ id: passId })
    return new GetPassDto(data)
  }

  async addHolder(userId: string, passId: string, temporary?: boolean) {
    const id = v4()

    const pass = await this.dbReader(PassEntity.table)
      .innerJoin(
        `${UserEntity.table} as owner`,
        `${PassEntity.table}.owner_id`,
        'owner.id',
      )
      .innerJoin(
        `${SolNftCollectionEntity.table} as solNftCollection`,
        `${PassEntity.table}.sol_nft_collection_id`,
        'solNftCollection.id',
      )
      .select([
        '*',
        ...PassEntity.populate<PassEntity>(['owner', 'solNftCollection']),
      ])
      .where(`${PassEntity.table}.id`, id)
      .first()

    const expiresAt = temporary
      ? new Date(new Date().getDate() + 30).valueOf()
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

    const query = () => this.dbWriter(PassOwnershipEntity.table).insert(data)

    await createOrThrowOnDuplicate(query, this.logger, USER_ALREADY_OWNS_PASS)

    return new GetPassOwnershipDto(pass.id, userId, expiresAt)
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
}
