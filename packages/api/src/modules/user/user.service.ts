import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return new CreateUserDto()
  }

  async findOne(id: string): Promise<CreateUserDto> {
    return new CreateUserDto()
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    ;`TODO: This action updates a #${id} user`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} user`
  }
}
