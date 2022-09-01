// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { UserEntity } from '../user/entities/user.entity'
import {
  CREATOR_NOT_EXIST,
  FOLLOWER_NOT_EXIST,
  FOLLOWING_ALREADY_EXIST,
  FOLLOWING_NOT_EXIST,
  Following_NOT_OWNED_BY_USER,
  IS_NOT_CREATOR,
} from './constants/errors'
import { CreateFollowingRequestDto } from './dto/create-following.dto'
import { FollowDto } from './dto/follow.dto'
import { GetFanResponseDto } from './dto/get-fan.dto'
import { SearchFanRequestDto } from './dto/search-fan.dto'
import { FollowEntity } from './entities/follow.entity'
import { FollowBlockEntity } from './entities/follow-block.entity'
import { FollowReportEntity } from './entities/follow-report.entity'
import { FollowRestrictEntity } from './entities/follow-restrict.entity'

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
    createFollowingDto: CreateFollowingRequestDto,
  ): Promise<FollowDto> {
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
    return new FollowDto(data)
  }

  async searchByQuery(
    userId: string,
    searchFanDto: SearchFanRequestDto,
  ): Promise<GetFanResponseDto[]> {
    const strippedQuery = searchFanDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    const query = this.dbReader(FollowEntity.table)
      .innerJoin(UserEntity.table, 'user.id', 'follow.subscriber_id')
      .leftJoin(ProfileEntity.table, 'profile.user_id', 'follow.subscriber_id')
      .select(
        'user.id',
        'user.username',
        'user.display_name',
        'profile.profile_image_url',
      )
      .where(async function () {
        await this.whereILike('user.username', likeClause).orWhereILike(
          'user.display_name',
          likeClause,
        )
      })
      .andWhere('follow.creator_id', userId)

    if (searchFanDto.cursor) {
      await query.andWhere(
        this.dbReader.raw(`user.id > ${searchFanDto.cursor}`),
      )
    }

    const followResult = await query
      .orderBy('user.display_name', 'asc')
      .limit(50)

    return followResult.map((follow) => {
      return new GetFanResponseDto(
        follow.id,
        follow.username,
        follow.display_name,
        follow.profile_image_url,
      )
    })
  }

  async findOne(id: string): Promise<FollowDto> {
    const following = await this.dbReader(FollowEntity.table)
      .where({ id })
      .first()
    if (!following) {
      throw new NotFoundException(FOLLOWING_NOT_EXIST)
    }

    return new FollowDto(following)
  }

  async report(
    creatorId: string,
    subscriberId: string,
    reason: string,
  ): Promise<void> {
    await this.dbWriter(FollowReportEntity.table).insert(
      FollowReportEntity.toDict({
        id: uuid.v4(),
        creator: creatorId,
        subscriber: subscriberId,
        reason: reason,
      }),
    )
  }

  async restrict(creatorId: string, subscriberId: string): Promise<void> {
    await this.dbWriter(FollowRestrictEntity.table).insert(
      FollowRestrictEntity.toDict({
        id: uuid.v4(),
        creator: creatorId,
        subscriber: subscriberId,
      }),
    )
  }

  async unrestrict(creatorId: string, subscriberId: string): Promise<void> {
    await this.dbWriter(FollowRestrictEntity.table)
      .where(`${FollowRestrictEntity.table}.creator_id`, creatorId)
      .where(`${FollowRestrictEntity.table}.subscriber_id`, subscriberId)
      .delete()
  }

  async block(creatorId: string, subscriberId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table).insert(
      FollowBlockEntity.toDict({
        id: uuid.v4(),
        creator: creatorId,
        subscriber: subscriberId,
      }),
    )
  }

  async unblock(creatorId: string, subscriberId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .where(`${FollowBlockEntity.table}.subscriber_id`, subscriberId)
      .delete()
  }

  async remove(userId: string, followId: string): Promise<FollowDto> {
    const following = await this.findOne(followId)

    if (following.subscriberId !== userId) {
      throw new ForbiddenException(Following_NOT_OWNED_BY_USER)
    }

    const data = FollowEntity.toDict<FollowEntity>({ isActive: false })
    await this.dbWriter(FollowEntity.table).update(data).where({ id: followId })

    return new FollowDto({ ...following, ...data })
  }
}
