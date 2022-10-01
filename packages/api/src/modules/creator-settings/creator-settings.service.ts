import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorSettingsDto } from './dto/creator-settings.dto'
import { UpdateCreatorSettingsRequestDto } from './dto/update-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'
import { InvalidMessageTipMinimumError } from './error/creator-settings.error'

export const MINIMUM_MESSAGE_TIP_AMOUNT = 3.0

@Injectable()
export class CreatorSettingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async findByUser(userId: string): Promise<CreatorSettingsDto> {
    const creatorSettings = await this.dbReader<CreatorSettingsEntity>(
      CreatorSettingsEntity.table,
    )
      .where({ user_id: userId })
      .first()
    if (!creatorSettings) {
      throw new InternalServerErrorException(
        `Unexpected missing creator settings for user: ${userId}`,
      )
    }
    return new CreatorSettingsDto(creatorSettings)
  }

  async updateCreatorSettings(
    userId: string,
    updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<boolean> {
    const data = {
      minimum_tip_amount: updateCreatorSettingsDto.minimumTipAmount,
      welcome_message: updateCreatorSettingsDto.welcomeMessage,
      allow_comments_on_posts: updateCreatorSettingsDto.allowCommentsOnPosts,
      payout_frequency: updateCreatorSettingsDto.payoutFrequency,
      show_follower_count: updateCreatorSettingsDto.showFollowerCount,
      show_media_count: updateCreatorSettingsDto.showMediaCount,
    }
    Object.keys(data).forEach((key) =>
      data[key] === undefined ? delete data[key] : {},
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
    const updated = await this.dbWriter<CreatorSettingsEntity>(
      CreatorSettingsEntity.table,
    )
      .update(data)
      .where({ user_id: userId })
    return updated === 1
  }
}
