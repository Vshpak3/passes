import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreateCreatorSettingsRequestDto } from './dto/create-creator-settings.dto'
import { UpdateCreatorSettingsRequestDto } from './dto/update-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

const CREATOR_SETTINGS_EXISTS = 'Creator Settings already exists'

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

  async findByUser(userId: string): Promise<CreatorSettingsEntity> {
    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
      )
      .first()
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }
    return creatorSettings
  }

  async update(
    userId: string,
    updateCreatorSettingsDto: UpdateCreatorSettingsRequestDto,
  ): Promise<CreatorSettingsEntity> {
    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
      )
      .first()
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }

    const data = CreatorSettingsEntity.toDict<CreatorSettingsEntity>(
      updateCreatorSettingsDto,
    )
    await this.dbWriter(CreatorSettingsEntity.table)
      .update(data)
      .where({ id: creatorSettings.id })
    return { ...creatorSettings, ...data }
  }

  async create(
    userId: string,
    createCreatorSettingsDto: CreateCreatorSettingsRequestDto,
  ): Promise<CreatorSettingsEntity> {
    const data = CreatorSettingsEntity.toDict<CreatorSettingsEntity>({
      user: userId,
      ...createCreatorSettingsDto,
    })
    const query = () => this.dbWriter(CreatorSettingsEntity.table).insert(data)
    await createOrThrowOnDuplicate(query, this.logger, CREATOR_SETTINGS_EXISTS)
    return data as any
  }
}
