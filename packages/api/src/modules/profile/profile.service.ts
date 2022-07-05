import {
  EntityRepository,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import {
  PROFILE_NOT_EXIST,
  PROFILE_NOT_OWNED_BY_USER,
  USER_HAS_PROFILE,
  USER_NOT_EXIST,
} from './constants/errors'
import { CreateProfileDto } from './dto/create-profile.dto'
import { GetProfileDto } from './dto/get-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileEntity } from './entities/profile.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: EntityRepository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<GetProfileDto> {
    const user = await this.userRepository.getReference(userId)

    if (!user) {
      throw new BadRequestException(USER_NOT_EXIST)
    }

    try {
      const profile = this.profileRepository.create({
        user,
        description: createProfileDto.description,
        instagramUrl: createProfileDto.instagramUrl,
        tiktokUrl: createProfileDto.tiktokUrl,
        youtubeUrl: createProfileDto.youtubeUrl,
        discordUrl: createProfileDto.discordUrl,
        twitchUrl: createProfileDto.twitchUrl,
        isActive: true,
      })

      await this.profileRepository.persist(profile).flush()
      return new GetProfileDto(profile)
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException(USER_HAS_PROFILE)
      }

      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetProfileDto> {
    const profile = await this.profileRepository.findOne(id)
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    return new GetProfileDto(profile)
  }

  async update(
    userId: string,
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<GetProfileDto> {
    const currentProfile = await this.profileRepository.findOne(profileId)

    if (!currentProfile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (currentProfile.user.id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const newProfile = wrap(currentProfile).assign({
      ...updateProfileDto,
    })

    await this.profileRepository.persist(newProfile).flush()
    return new GetProfileDto(newProfile)
  }

  async remove(userId: string, profileId: string): Promise<GetProfileDto> {
    const profile = await this.profileRepository.findOne(profileId)
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user.id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const newProfile = wrap(profile).assign({
      isActive: false,
    })

    await this.profileRepository.persist(newProfile).flush()
    return new GetProfileDto(newProfile)
  }
}
