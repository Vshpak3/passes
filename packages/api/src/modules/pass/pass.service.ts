import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'

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
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,

    private readonly solService: SolService,
    private readonly walletService: WalletService,
  ) {}

  async create(
    userId: string,
    createPassDto: CreatePassDto,
  ): Promise<GetPassDto> {
    const { knex, v4 } = this.ReadWriteDatabaseService

    const user = await knex(UserEntity.table).where({ id: userId }).first()
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

    const id = v4()
    const data = PassEntity.toDict<PassEntity>({
      id,
      owner: userId,
      solNftCollection: solNftCollectionDto.id,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
    })

    await knex(PassEntity.table).insert(data)
    return new GetPassDto(data)
  }

  async findOne(id: string): Promise<GetPassDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const pass = await knex(PassEntity.table)
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
    const { knex } = this.ReadOnlyDatabaseService
    let query = knex(PassEntity.table)
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

    if (creatorId) {
      query = query.where('owner_id', creatorId)
    }

    return await query
  }

  async findPassesByCreator(creatorId: string) {
    const { knex } = this.ReadOnlyDatabaseService
    return await knex(PassEntity.table).where('owner_id', creatorId)
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
    const { knex } = this.ReadWriteDatabaseService
    const currentPass = await knex(PassEntity.table)
      .where({ id: passId })
      .first()

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.owner_id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const data = PassEntity.toDict<PassEntity>(updatePassDto)
    await knex(PassEntity.table).update(data).where({ id: passId })
    return new GetPassDto(data)
  }

  async addHolder(userId: string, passId: string, temporary?: boolean) {
    const { knex, v4 } = this.ReadWriteDatabaseService
    const id = v4()

    const pass = await knex(PassEntity.table)
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

    const query = () => knex(PassOwnershipEntity.table).insert(data)

    await createOrThrowOnDuplicate(query, USER_ALREADY_OWNS_PASS)

    return new GetPassOwnershipDto(pass.id, userId, expiresAt)
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const { knex } = this.ReadOnlyDatabaseService
    const data = PassOwnershipEntity.toDict<PassOwnershipEntity>({
      holder: userId,
      pass: passId,
    })
    const ownership = await knex(PassOwnershipEntity.table).where(data).first()
    return !!ownership
  }
}
