import { Injectable, NotFoundException } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreateCreatorSettingsDto } from './dto/create-creator-settings.dto'
import { CreatorSettingsEntity } from './entities/creator-settings.entity'

export const CREATOR_SETTINGS_EXISTS = 'Creator Settings already exists'

@Injectable()
export class CreatorSettingsService {
  table: string
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {
    this.ReadWriteDatabaseService.getTableName(CreatorSettingsEntity)
  }

  async findByUser(userId: string): Promise<CreatorSettingsEntity> {
    const { knex, toDict } = this.ReadOnlyDatabaseService
    const creatorSettings = await knex(this.table)
      .where(toDict(CreatorSettingsEntity, { user: userId }))
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
    const { knex, toDict } = this.ReadWriteDatabaseService
    const creatorSettings = await knex(this.table)
      .where(toDict(CreatorSettingsEntity, { user: userId }))
      .first()
    if (!creatorSettings) {
      throw new NotFoundException('CreatorSettings does not exist for user')
    }

    const data = toDict(CreatorSettingsEntity, createCreatorSettingsDto)
    await knex.update(data).where({ id: creatorSettings.id })
    return { ...creatorSettings, ...data }
  }

  async create(
    userId: string,
    createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreatorSettingsEntity> {
    const { knex, toDict, v4 } = this.ReadWriteDatabaseService
    const id = v4()
    const data = toDict(CreatorSettingsEntity, {
      id,
      user: userId,
      ...createCreatorSettingsDto,
    })
    const query = () => knex(this.table).insert(data)
    await createOrThrowOnDuplicate(query, CREATOR_SETTINGS_EXISTS)
    return data as any
  }
}
