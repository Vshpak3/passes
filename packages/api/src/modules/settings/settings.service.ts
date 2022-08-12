import { Injectable } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UpdateSettingsDto } from './dto/update-settings.dto'

@Injectable()
export class SettingsService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} accountSetting`
  }

  async update(id: string, updateSettingsDto: UpdateSettingsDto) {
    ;`TODO: This action updates a #${id} accountSetting ${updateSettingsDto}`
  }
}
