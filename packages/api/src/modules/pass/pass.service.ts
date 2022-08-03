import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import {
  COLLECTION_NOT_EXIST,
  COLLECTION_NOT_OWNED_BY_USER,
} from '../collection/constants/errors'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { UserEntity } from '../user/entities/user.entity'
import {
  PASS_NOT_EXIST,
  PASS_NOT_OWNED_BY_USER,
  USER_ALREADY_OWNS_PASS,
} from './constants/errors'
import { CreatePassDto } from './dto/create-pass.dto'
import { GetPassDto } from './dto/get-pass.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'

@Injectable()
export class PassService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: EntityRepository<CollectionEntity>,
    @InjectRepository(PassEntity)
    private readonly passRepository: EntityRepository<PassEntity>,
    @InjectRepository(PassOwnershipEntity)
    private readonly passOwnershipRepository: EntityRepository<PassOwnershipEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(
    userId: string,
    createPassDto: CreatePassDto,
  ): Promise<CreatePassDto> {
    const collection = await this.collectionRepository.findOne(
      { id: createPassDto.collectionId },
      { populate: ['owner'] },
    )

    if (!collection) {
      throw new BadRequestException(COLLECTION_NOT_EXIST)
    }

    if (collection.owner.id !== userId) {
      throw new UnauthorizedException(COLLECTION_NOT_OWNED_BY_USER)
    }

    const user = await this.userRepository.getReference(userId)

    const pass = this.passRepository.create({
      owner: user,
      collection: collection,
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
    const pass = await this.passRepository.findOne(id, {
      populate: ['owner', 'collection'],
    })
    if (!pass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    return new GetPassDto(pass)
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
    const currentPass = await this.passRepository.findOne(passId)

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.owner.id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const newPost = wrap(currentPass).assign({
      ...updatePassDto,
    })

    await this.passRepository.persistAndFlush(newPost)
    return new GetPassDto(newPost)
  }

  async addHolder(userId: string, passId: string, temporary?: boolean) {
    const user = await this.userRepository.getReference(userId)
    const pass = await this.passRepository.getReference(passId)

    const passOwnership = this.passOwnershipRepository.create({
      pass: pass,
      holder: user,
      expiresAt: temporary
        ? new Date(new Date().getDate() + 30).valueOf()
        : undefined,
    })

    await createOrThrowOnDuplicate(
      this.passOwnershipRepository,
      passOwnership,
      USER_ALREADY_OWNS_PASS,
    )
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const ownership = await this.passOwnershipRepository.findOne({
      holder: userId,
      pass: passId,
    })
    return !!ownership
  }
}
