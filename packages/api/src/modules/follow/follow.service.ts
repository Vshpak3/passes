import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import {
  FOLLOWING_ALREADY_EXIST,
  FOLLOWING_NOT_EXIST,
  Following_NOT_OWNED_BY_USER,
} from './constants/errors'
import { CreateFollowingDto } from './dto/create-following.dto'
import { GetFollowingDto } from './dto/get-following.dto'
import { FollowEntity } from './entities/follow.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class FollowService {
  table: string
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {
    this.table = this.ReadWriteDatabaseService.getTableName(FollowEntity)
  }

  async create(
    userId: string,
    createFollowingDto: CreateFollowingDto,
  ): Promise<GetFollowingDto> {
    const { knex, toDict, v4 } = this.ReadWriteDatabaseService

    // TODO: refactor to new database setup
    // const subscriber = await this.userRepository.getReference(userId)
    // if (!subscriber) {
    //   throw new BadRequestException(FOLLOWER_NOT_EXIST)
    // }

    // const creator = await this.userRepository.getReference(
    //   createFollowingDto.creatorUserId,
    // )

    // if (!creator) {
    //   throw new BadRequestException(CREATOR_NOT_EXIST)
    // }

    // if (!creator.isCreator) {
    //   throw new BadRequestException(IS_NOT_CREATOR)
    // }

    const id = v4()
    const data = toDict(FollowEntity, {
      id,
      subscriber: userId,
      creator: createFollowingDto.creatorUserId,
      isActive: true,
    })
    const query = () => knex(this.table).insert(data)

    createOrThrowOnDuplicate(query, FOLLOWING_ALREADY_EXIST)
    return new GetFollowingDto(data)
  }

  async findOne(id: string): Promise<GetFollowingDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const following = await knex(this.table).where({ id }).first()
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

    const { knex, toDict } = this.ReadWriteDatabaseService
    const data = toDict(FollowEntity, { isActive: false })
    await knex(this.table).update(data).where({ id: followId })

    return new GetFollowingDto({ ...following, ...data })
  }
}
