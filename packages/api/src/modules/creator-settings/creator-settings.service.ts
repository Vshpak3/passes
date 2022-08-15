import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreateCreatorSettingsDto } from './dto/create-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'
export const CREATOR_SETTINGS_EXISTS = 'Creator Settings already exists'

@Injectable()
export class CreatorSettingsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async findByUser(userId: string): Promise<CreatorSettingsEntity> {
    const { knex } = this.ReadOnlyDatabaseService
    const creatorSettings = await knex(CreatorSettingsEntity.table)
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
    createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreatorSettingsEntity> {
    const { knex } = this.ReadWriteDatabaseService
    const creatorSettings = await knex(CreatorSettingsEntity.table)
      .where(
        CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
      )
      .first()
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }

    const data = CreatorSettingsEntity.toDict<CreatorSettingsEntity>(
      createCreatorSettingsDto,
    )
    await knex.update(data).where({ id: creatorSettings.id })
    return { ...creatorSettings, ...data }
  }

  async create(
    userId: string,
    createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreatorSettingsEntity> {
    const { knex } = this.ReadWriteDatabaseService
    const data = CreatorSettingsEntity.toDict<CreatorSettingsEntity>({
      user: userId,
      ...createCreatorSettingsDto,
    })
    const query = () => knex(CreatorSettingsEntity.table).insert(data)
    await createOrThrowOnDuplicate(query, this.logger, CREATOR_SETTINGS_EXISTS)
    return data as any
  }
}
