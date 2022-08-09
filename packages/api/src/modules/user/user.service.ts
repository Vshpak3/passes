import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { SearchUserRequestDto } from './dto/search-user-request.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, 'ReadWrite')
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: createUserDto.email,
      userName: createUserDto.userName,
    })
    await this.userRepository.persistAndFlush(user)
    return user
  }

  async createOAuthUser(
    email: string,
    provider: string,
    providerId: string,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: email,
      // TODO: Do users supply a username, or randomly generate one?
      userName: `${provider}-${providerId}`,
      oauthId: providerId,
      oauthProvider: provider,
    })
    await this.userRepository.persistAndFlush(user)
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

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const currentUser = await this.findOne(userId)

    // TODO: Only certain user fields should be allowed to be updated
    const newUser = wrap(currentUser).assign({
      ...updateUserDto,
    })

    await this.userRepository.persistAndFlush(newUser)
    return newUser
  }

  async remove(userId: string): Promise<UserEntity> {
    const currentUser = await this.findOne(userId)

    const newUser = wrap(currentUser).assign({
      isDisabled: true,
    })

    await this.userRepository.persistAndFlush(newUser)
    return newUser
  }

  // TODO: Sort by creators that the user follows, most interacted with first?
  async searchByQuery(searchUserDto: SearchUserRequestDto) {
    const likeClause = `%${searchUserDto.query}%`
    return await this.userRepository.find(
      {
        $or: [
          { userName: { $like: likeClause } },
          { displayName: { $like: likeClause } },
        ],
        isCreator: true,
        isDisabled: false,
      },
      { limit: 10 },
    )
  }

  async validateUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ userName: username })
    return !user
  }
}
