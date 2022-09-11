import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorSettingsDto } from './dto/creator-settings.dto'
import { UpdateCreatorSettingsRequestDto } from './dto/update-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'
import { InvalidMessageTipMinimumError } from './error/creator-settings.error'

const MINIMUM_MESSAGE_TIP_AMOUNT = 5.0

@Injectable()
export class CreatorSettingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async findByUser(userId: string): Promise<CreatorSettingsDto> {
    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
      )
      .first()
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }
    return new CreatorSettingsDto(creatorSettings)
  }

  async updateCreatorSettings(
    userId: string,
    updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<boolean> {
    const data = CreatorSettingsEntity.toDict<CreatorSettingsEntity>(
      updateCreatorSettingsDto,
    )
    if (Object.keys(data).length === 0) {
      return false
    }
    if (
      updateCreatorSettingsDto.minimumTipAmount &&
      updateCreatorSettingsDto.minimumTipAmount < MINIMUM_MESSAGE_TIP_AMOUNT
    ) {
      throw new InvalidMessageTipMinimumError('minimum tp value too low')
    }
    const updated = await this.dbWriter(CreatorSettingsEntity.table)
      .update(data)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
      )
    return updated === 1
  }
}
