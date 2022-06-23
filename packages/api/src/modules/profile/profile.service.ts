import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { ProfileEntity } from './entities/profile.entity'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: EntityRepository<ProfileEntity>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<string> {
    return 'TODO: This action adds a new profile'
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} profile`
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    ;`TODO: This action updates a #${id} profile`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} profile`
  }
}
