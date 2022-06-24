import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
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
    const user = this.userRepository.create({
      email: createUserDto.email,
      userName: createUserDto.userName,
    })
    await this.userRepository.persist(user).flush()
    return createUserDto
  }

  async findOne(id: string): Promise<CreateUserDto> {
    // TODO: this should not return an entity but instead a dto
    // TODO: this should not 500 if the user is not found
    // TODO: validate ids as uuids in the controller
    return this.userRepository.findOneOrFail(id)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // TODO: implement this
    ;`TODO: This action updates a #${id} user ${updateUserDto}`
  }
}
