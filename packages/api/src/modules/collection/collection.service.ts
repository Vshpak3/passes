import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import {
  COLLECTION_NOT_EXIST,
  COLLECTION_NOT_OWNED_BY_USER,
  USER_IS_NOT_CREATOR,
} from './constants/errors'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { GetCollectionDto } from './dto/get-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { CollectionEntity } from './entities/collection.entity'

@Injectable()
export class CollectionService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    createPassDto: CreateCollectionDto,
  ): Promise<CreateCollectionDto> {
    const { knex } = this.ReadWriteDatabaseService
    const user = await knex(UserEntity.table).where({ id: userId }).first()
    if (!user?.is_creator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    const data = CollectionEntity.toDict<CollectionEntity>({
      owner: userId,
      blockchain: 'solana',
      title: createPassDto.title,
      description: createPassDto.description,
    })

    await knex(CollectionEntity.table).insert(data)

    return new GetCollectionDto(data)
  }

  async findOne(id: string): Promise<GetCollectionDto> {
    const { knex } = this.ReadOnlyDatabaseService
    // TODO: check if populate: ['owner'] is needed
    const collection = await knex(CollectionEntity.table).where({ id }).first()

    if (!collection) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    return new GetCollectionDto(collection)
  }

  async findOneByCreatorUsername(username: string): Promise<GetCollectionDto> {
    const { knex } = this.ReadOnlyDatabaseService

    const user = await knex(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    if (!user) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    // TODO: check if populate: ['owner'] is needed
    const collection = await knex(CollectionEntity.table)
      .where(
        CollectionEntity.toDict<CollectionEntity>({
          owner: user.id,
        }),
      )
      .first()
    if (!collection) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    return new GetCollectionDto(collection)
  }

  async update(
    userId: string,
    collectionId: string,
    updatePassDto: UpdateCollectionDto,
  ) {
    const { knex } = this.ReadWriteDatabaseService
    const currentCollection = await knex(CollectionEntity.table)
      .where({ id: collectionId })
      .first()

    if (!currentCollection) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    if (currentCollection.owner_id !== userId) {
      throw new ForbiddenException(COLLECTION_NOT_OWNED_BY_USER)
    }

    const data = CollectionEntity.toDict<CollectionEntity>(updatePassDto)
    await knex(CollectionEntity.table).update(data).where({ id: collectionId })

    return new GetCollectionDto({ ...currentCollection, ...data })
  }
}
