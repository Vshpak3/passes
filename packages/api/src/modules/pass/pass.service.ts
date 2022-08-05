import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { SolNftEntity } from '../sol/entities/sol-nft.entity'
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
  table: string
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
    @InjectRepository(CollectionEntity, 'ReadWrite')
    private readonly collectionRepository: EntityRepository<CollectionEntity>,
    @InjectRepository(PassEntity, 'ReadWrite')
    private readonly passRepository: EntityRepository<PassEntity>,
    @InjectRepository(PassOwnershipEntity, 'ReadWrite')
    private readonly passOwnershipRepository: EntityRepository<PassOwnershipEntity>,
    @InjectRepository(UserEntity, 'ReadWrite')
    private readonly userRepository: EntityRepository<UserEntity>,
    @InjectRepository(SolNftCollectionEntity, 'ReadWrite')
    private readonly solNftCollectionRepository: EntityRepository<SolNftCollectionEntity>,
    @InjectRepository(SolNftEntity, 'ReadWrite')
    private readonly solNftRepository: EntityRepository<SolNftEntity>,
    private readonly solService: SolService,
    private readonly walletService: WalletService,
  ) {
    this.table = this.ReadWriteDatabaseService.getTableName(PassEntity)
  }

  async create(
    userId: string,
    createPassDto: CreatePassDto,
  ): Promise<GetPassDto> {
    // TODO: fix merge conflicts
    // const { knex, toDict, populate, getTableName, v4 } =
    // this.ReadWriteDatabaseService
    // const collectionTable = getTableName(CollectionEntity)
    // const userTable = getTableName(UserEntity)
    // const collection = await knex(collectionTable)
    //   .innerJoin(
    //     `${userTable} as owner`,
    //     `${collectionTable}.owner_id`,
    //     'owner.id',
    //   )
    //   .select([
    //     `${collectionTable}.id as id`,
    //     ...populate(CollectionEntity, ['owner']),
    //   ])
    //   .where(`${collectionTable}.id`, createPassDto.collectionId)
    //   .first()

    // if (!collection) {
    //   throw new BadRequestException(COLLECTION_NOT_EXIST)
    // }

    // if (collection.owner_id !== userId) {
    //   throw new UnauthorizedException(COLLECTION_NOT_OWNED_BY_USER)
    // }

    // const id = v4()
    // const data = toDict(PassEntity, {
    //   id,
    //   owner: userId,
    //   collection: collection.id,
    //   ...createPassDto,
    // })

    // await knex(this.table).insert(data)
    // return new GetPassDto(data)
    const user = await this.userRepository.findOneOrFail(userId)
    const solNftCollectionDto = await this.solService.createNftCollection(
      user,
      createPassDto.title,
      user.userName.replace(/[^a-zA-Z]/g, '').substring(0, 10),
      createPassDto.description,
      createPassDto.imageUrl,
    )
    const solNftCollection = await this.solNftCollectionRepository.getReference(
      solNftCollectionDto.id,
    )
    const pass = this.passRepository.create({
      owner: user,
      solNftCollection: solNftCollection,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
    })

    await this.passRepository.persistAndFlush(pass)
    return new GetPassDto(pass)
  }

  async findOne(id: string): Promise<GetPassDto> {
    // TODO: fix merge conflicts
    // const { knex, getTableName, populate } = this.ReadOnlyDatabaseService
    // const collectionTable = getTableName(CollectionEntity)
    // const userTable = getTableName(UserEntity)
    // const pass = await knex(this.table)
    //   .innerJoin(`${userTable} as owner`, `${this.table}.owner_id`, 'owner.id')
    //   .innerJoin(
    //     `${collectionTable} as collection`,
    //     `${this.table}.collection_id`,
    //     'collection.id',
    //   )
    //   .select(['*', ...populate(PassEntity, ['owner', 'collection'])])
    //   .where(`${this.table}.id`, id)
    //   .first()
    const pass = await this.passRepository.findOne(id, {
      populate: ['owner', 'solNftCollection'],
    })
    if (!pass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    return new GetPassDto(pass)
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
    const { knex, toDict } = this.ReadWriteDatabaseService
    const currentPass = await knex(this.table).where({ id: passId }).first()

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.owner_id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const data = toDict(PassEntity, updatePassDto)
    await knex(this.table).update(data).where({ id: passId })
    return new GetPassDto(data)
  }

  async addHolder(userId: string, passId: string, temporary?: boolean) {
    // TODO: fix merge conflicts
    // const { knex, toDict, getTableName, v4 } = this.ReadWriteDatabaseService
    // const id = v4()
    // const data = toDict(PassOwnershipEntity, {
    //   id,
    //   pass: passId,
    //   holder: userId,
    //   expiresAt: temporary
    //     ? new Date(new Date().getDate() + 30).valueOf()
    //     : undefined,
    // })

    // const passOwnershipTable = getTableName(PassOwnershipEntity)
    // const query = () => knex(passOwnershipTable).insert(data)

    // await createOrThrowOnDuplicate(query, USER_ALREADY_OWNS_PASS)
    const user = await this.userRepository.getReference(userId)
    const pass = await this.passRepository.findOneOrFail(passId, {
      populate: ['owner', 'solNftCollection'],
    })

    const expiresAt = temporary
      ? new Date(new Date().getDate() + 30).valueOf()
      : undefined

    const userCustodialWallet = await this.walletService.getUserCustodialWallet(
      userId,
    )

    const solNftDto = await this.solService.createNftPass(
      user.id,
      new PublicKey(userCustodialWallet.address),
      pass.solNftCollection.id,
    )

    const solNft = await this.solNftRepository.getReference(solNftDto.id)
    const passOwnership = this.passOwnershipRepository.create({
      pass: pass,
      holder: user,
      expiresAt: expiresAt,
      solNft: solNft,
    })

    const query = () =>
      this.passOwnershipRepository.persistAndFlush(passOwnership)

    await createOrThrowOnDuplicate(query, USER_ALREADY_OWNS_PASS)

    return new GetPassOwnershipDto(pass.id, user.id, expiresAt)
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const { knex, toDict, getTableName } = this.ReadOnlyDatabaseService
    const passOwnershipTable = getTableName(PassOwnershipEntity)
    const data = toDict(PassOwnershipEntity, { holder: userId, pass: passId })
    const ownership = await knex(passOwnershipTable).where(data).first()
    return !!ownership
  }
}
