import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { SettingsEntity } from './entities/settings.entity'
import { UpdateSettingsDto } from './dto/update-settings.dto'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: EntityRepository<SettingsEntity>,
  ) {}

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} accountSetting`
  }

  async update(id: string, updateSettingsDto: UpdateSettingsDto) {
    ;`TODO: This action updates a #${id} accountSetting ${updateSettingsDto}`
  }
}
