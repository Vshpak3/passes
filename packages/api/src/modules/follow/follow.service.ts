import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
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
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    createFollowingDto: CreateFollowingDto,
  ): Promise<GetFollowingDto> {
    const { knex } = this.ReadWriteDatabaseService

    const [subscriber, creator] = await Promise.all([
      knex(UserEntity.table).where({ id: userId }).first(),
      knex(UserEntity.table)
        .where({ id: createFollowingDto.creatorUserId })
        .first(),
    ])
    if (!subscriber) {
      throw new BadRequestException(FOLLOWER_NOT_EXIST)
    }

    if (!creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    if (!creator.isCreator) {
      throw new BadRequestException(IS_NOT_CREATOR)
    }

    const data = FollowEntity.toDict<FollowEntity>({
      subscriber: userId,
      creator: createFollowingDto.creatorUserId,
      isActive: true,
    })
    const query = () => knex(FollowEntity.table).insert(data)

    createOrThrowOnDuplicate(query, FOLLOWING_ALREADY_EXIST)
    return new GetFollowingDto(data)
  }

  async findOne(id: string): Promise<GetFollowingDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const following = await knex(FollowEntity.table).where({ id }).first()
    if (!following) {
      throw new NotFoundException(FOLLOWING_NOT_EXIST)
    }

    return new GetFollowingDto(following)
  }

  async remove(userId: string, followId: string): Promise<GetFollowingDto> {
    const following = await this.findOne(followId)

    if (following.subscriberId !== userId) {
      throw new ForbiddenException(Following_NOT_OWNED_BY_USER)
    }

    const { knex } = this.ReadWriteDatabaseService
    const data = FollowEntity.toDict<FollowEntity>({ isActive: false })
    await knex(FollowEntity.table).update(data).where({ id: followId })

    return new GetFollowingDto({ ...following, ...data })
  }
}
