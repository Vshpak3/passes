import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { PassEntity } from './entities/pass.entity'
import { CreatePassDto } from './dto/create-pass.dto'
import { UpdatePassDto } from './dto/update-pass.dto'

@Injectable()
export class PassService {
  constructor(
    @InjectRepository(PassEntity)
    private readonly passRepository: EntityRepository<PassEntity>,
  ) {}

  async create(createPassDto: CreatePassDto): Promise<string> {
    return `TODO: This action adds a new pass ${createPassDto}`
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} pass`
  }

  async update(id: string, updatePassDto: UpdatePassDto) {
    ;`TODO: This action updates a #${id} pass $ ${updatePassDto}`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} pass`
  }
}
