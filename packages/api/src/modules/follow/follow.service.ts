import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

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
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async create(
    userId: string,
    createFollowingDto: CreateFollowingDto,
  ): Promise<GetFollowingDto> {
    const [subscriber, creator] = await Promise.all([
      this.dbReader(UserEntity.table).where({ id: userId }).first(),
      this.dbReader(UserEntity.table)
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
    const query = () => this.dbWriter(FollowEntity.table).insert(data)

    await createOrThrowOnDuplicate(query, this.logger, FOLLOWING_ALREADY_EXIST)
    return new GetFollowingDto(data)
  }

  async findOne(id: string): Promise<GetFollowingDto> {
    const following = await this.dbReader(FollowEntity.table)
      .where({ id })
      .first()
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

    const data = FollowEntity.toDict<FollowEntity>({ isActive: false })
    await this.dbWriter(FollowEntity.table).update(data).where({ id: followId })

    return new GetFollowingDto({ ...following, ...data })
  }
}
