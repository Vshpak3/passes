import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: createUserDto.email,
      userName: createUserDto.userName,
    })
    await this.userRepository.persist(user).flush()
    return user
  }

  async createOAuthUser(
    email: string,
    provider: string,
    providerId: string,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: email,
      userName: email.substring(0, 30),
      oauthId: providerId,
      oauthProvider: provider,
    })
    await this.userRepository.persist(user).flush()
    return user
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id)
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  async findOneByOAuth(
    oauthId: string,
    oauthProvider: string,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ oauthId, oauthProvider })
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.findOne(userId)

    // TODO: Only certain user fields should be allowed to be updated
    const newUser = wrap(currentUser).assign({
      ...updateUserDto,
    })

    await this.userRepository.persist(newUser).flush()
    return newUser
  }

  async remove(userId: string) {
    const currentUser = await this.findOne(userId)

    const newUser = wrap(currentUser).assign({
      isDisabled: true,
    })

    await this.userRepository.persist(newUser).flush()
    return newUser
  }
}
