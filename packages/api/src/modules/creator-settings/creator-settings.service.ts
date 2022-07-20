import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'

import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { UserEntity } from '../user/entities/user.entity'
import { CreateCreatorSettingsDto } from './dto/create-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

export const CREATOR_SETTINGS_EXISTS = 'Creator Settings already exists'

@Injectable()
export class CreatorSettingsService {
  constructor(
    @InjectRepository(CreatorSettingsEntity)
    private readonly creatorSettingsRepository: EntityRepository<CreatorSettingsEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async findByUser(userId: string): Promise<CreatorSettingsEntity> {
    const user = await this.userRepository.getReference(userId)
    const creatorSettings = await this.creatorSettingsRepository.findOne({
      user,
    })
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }
    return creatorSettings
  }

  async update(
    userId: string,
    createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreatorSettingsEntity> {
    const user = await this.userRepository.getReference(userId)
    const creatorSettings = await this.creatorSettingsRepository.findOne({
      user,
    })
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }
    creatorSettings.minimumTipAmount = createCreatorSettingsDto.minimumTipAmount
    await this.creatorSettingsRepository.persistAndFlush(creatorSettings)
    return creatorSettings
  }

  async create(
    userId: string,
    createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreatorSettingsEntity> {
    const user = await this.userRepository.getReference(userId)
    const creatorSettings = this.creatorSettingsRepository.create({
      user,
      minimumTipAmount: createCreatorSettingsDto.minimumTipAmount,
    })
    await createOrThrowOnDuplicate(
      this.creatorSettingsRepository,
      creatorSettings,
      CREATOR_SETTINGS_EXISTS,
    )
    return creatorSettings
  }
}
