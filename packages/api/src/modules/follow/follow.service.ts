import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { UserEntity } from '../user/entities/user.entity'
import {
  CREATOR_NOT_EXIST,
  FOLLOWER_NOT_EXIST,
  FOLLOWING_ALREADY_EXIST,
  FOLLOWING_NOT_EXIST,
  Following_NOT_OWNED_BY_USER,
  IS_NOT_CREATOR,
} from './constants/errors'
import { CreateFollowingDto } from './dto/create-following.dto'
import { GetFollowingDto } from './dto/get-following.dto'
import { FollowEntity } from './entities/follow.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: EntityRepository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(
    userId: string,
    createFollowingDto: CreateFollowingDto,
  ): Promise<GetFollowingDto> {
    const subscriber = await this.userRepository.getReference(userId)
    if (!subscriber) {
      throw new BadRequestException(FOLLOWER_NOT_EXIST)
    }

    const creator = await this.userRepository.getReference(
      createFollowingDto.creatorUserId,
    )

    if (!creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    if (!creator.isCreator) {
      throw new BadRequestException(IS_NOT_CREATOR)
    }

    const following = this.followRepository.create({
      subscriber,
      creator,
      isActive: true,
    })

    createOrThrowOnDuplicate(
      this.followRepository,
      following,
      FOLLOWING_ALREADY_EXIST,
    )
    return new GetFollowingDto(following)
  }

  async findOne(id: string): Promise<GetFollowingDto> {
    const following = await this.followRepository.findOne(id)
    if (!following) {
      throw new NotFoundException(FOLLOWING_NOT_EXIST)
    }

    return new GetFollowingDto(following)
  }

  async remove(userId: string, followId: string): Promise<GetFollowingDto> {
    const following = await this.followRepository.findOne(followId)
    if (!following) {
      throw new NotFoundException(FOLLOWING_NOT_EXIST)
    }

    if (following.subscriber.id !== userId) {
      throw new ForbiddenException(Following_NOT_OWNED_BY_USER)
    }

    const newFollowing = wrap(following).assign({
      isActive: false,
    })

    await this.followRepository.persistAndFlush(newFollowing)
    return new GetFollowingDto(newFollowing)
  }
}
