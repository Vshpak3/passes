import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

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
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: EntityRepository<CollectionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(
    userId: string,
    createPassDto: CreateCollectionDto,
  ): Promise<CreateCollectionDto> {
    const user = await this.userRepository.findOne({ id: userId })
    if (!user?.isCreator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    const collection = this.collectionRepository.create({
      owner: user,
      title: createPassDto.title,
      description: createPassDto.description,
      blockchain: 'solana',
    })

    await this.collectionRepository.persistAndFlush(collection)
    return new GetCollectionDto(collection)
  }

  async findOne(id: string): Promise<GetCollectionDto> {
    const collection = await this.collectionRepository.findOne(id, {
      populate: ['owner'],
    })
    if (!collection) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    return new GetCollectionDto(collection)
  }

  async findOneByCreatorUsername(username: string): Promise<GetCollectionDto> {
    const user = await this.userRepository.findOne({ userName: username })
    if (!user) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    const collection = await this.collectionRepository.findOne(
      { owner: user.id },
      {
        populate: ['owner'],
      },
    )
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
    const currentCollection = await this.collectionRepository.findOne(
      collectionId,
    )

    if (!currentCollection) {
      throw new NotFoundException(COLLECTION_NOT_EXIST)
    }

    if (currentCollection.owner.id !== userId) {
      throw new ForbiddenException(COLLECTION_NOT_OWNED_BY_USER)
    }

    const newCollection = wrap(currentCollection).assign({
      ...updatePassDto,
    })

    await this.collectionRepository.persistAndFlush(newCollection)
    return new GetCollectionDto(newCollection)
  }
}
