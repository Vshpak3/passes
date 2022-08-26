import { Injectable } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UpdateSettingsRequestDto } from './dto/update-settings.dto'

@Injectable()
export class SettingsService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} accountSetting`
  }

  async update(id: string, updateSettingsDto: UpdateSettingsRequestDto) {
    ;`TODO: This action updates a #${id} accountSetting ${updateSettingsDto}`
  }
}
