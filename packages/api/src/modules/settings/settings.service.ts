import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { Settings } from './entities/settings.entity'
import { UpdateSettingsDto } from './dto/update-settings.dto'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: EntityRepository<Settings>,
  ) {}

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} accountSetting`
  }

  async update(id: string, updateSettingsDto: UpdateSettingsDto) {
    ;`TODO: This action updates a #${id} accountSetting`
  }
}
