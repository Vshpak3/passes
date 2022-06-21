import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    return 'TODO: This action adds a new user'
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} user`
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    ;`TODO: This action updates a #${id} user`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} user`
  }
}
