import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { UpdateSettingsDto } from './dto/update-settings.dto'
import { SettingsEntity } from './entities/settings.entity'

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
