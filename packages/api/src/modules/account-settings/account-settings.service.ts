import { Injectable } from '@nestjs/common'
import { CreateAccountSettingDto } from './dto/create-account-setting.dto'
import { UpdateAccountSettingDto } from './dto/update-account-setting.dto'

@Injectable()
export class AccountSettingsService {
  create(createAccountSettingDto: CreateAccountSettingDto) {
    return 'This action adds a new accountSetting'
  }

  findAll() {
    return `This action returns all accountSettings`
  }

  findOne(id: number) {
    return `This action returns a #${id} accountSetting`
  }

  update(id: number, updateAccountSettingDto: UpdateAccountSettingDto) {
    return `This action updates a #${id} accountSetting`
  }

  remove(id: number) {
    return `This action removes a #${id} accountSetting`
  }
}
