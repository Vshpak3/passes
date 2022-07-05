import {
  EntityRepository,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import {
  CREATOR_NOT_EXIST,
  IS_NOT_CREATOR,
  SUBSCRIBER_NOT_EXIST,
  SUBSCRIPTION_ALREADY_EXIST,
  SUBSCRIPTION_NOT_EXIST,
  SUBSCRIPTION_NOT_OWNED_BY_USER,
} from './constants/errors'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { GetSubscriptionDto } from './dto/get-subscription.dto'
import { SubscriptionEntity } from './entities/subscription.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: EntityRepository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<GetSubscriptionDto> {
    const subscriber = await this.userRepository.getReference(userId)
    if (!subscriber) {
      throw new BadRequestException(SUBSCRIBER_NOT_EXIST)
    }

    const creator = await this.userRepository.getReference(
      createSubscriptionDto.creatorUserId,
    )

    if (!creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    if (!creator.isCreator) {
      throw new BadRequestException(IS_NOT_CREATOR)
    }

    try {
      const subscription = this.subscriptionRepository.create({
        subscriber,
        creator,
        isActive: true,
      })

      await this.subscriptionRepository.persist(subscription).flush()

      return new GetSubscriptionDto(subscription)
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new InternalServerErrorException(SUBSCRIPTION_ALREADY_EXIST)
      }

      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne(id)
    if (!subscription) {
      throw new NotFoundException(SUBSCRIPTION_NOT_EXIST)
    }

    return new GetSubscriptionDto(subscription)
  }

  // async update(
  //   userId: string,
  //   subscriptionId: string,
  //   updateSubscriptionDto: UpdateSubscriptionDto,
  // ): Promise<GetSubscriptionDto> {
  //   const currentSubscription = await this.subscriptionRepository.findOne(
  //     subscriptionId,
  //   )

  //   if (!currentSubscription) {
  //     throw new NotFoundException(SUBSCRIPTION_NOT_EXIST)
  //   }

  //   if (currentSubscription.subscriber.id !== userId) {
  //     throw new ForbiddenException(SUBSCRIPTION_NOT_OWNED_BY_USER)
  //   }

  //   const newSubscription = wrap(currentSubscription).assign({
  //     isActive: updateSubscriptionDto.isActive,
  //   })

  //   await this.subscriptionRepository.persist(newSubscription).flush()
  //   return new GetSubscriptionDto(newSubscription)
  // }

  async remove(
    userId: string,
    subscriptionId: string,
  ): Promise<GetSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne(
      subscriptionId,
    )
    if (!subscription) {
      throw new NotFoundException(SUBSCRIPTION_NOT_EXIST)
    }

    if (subscription.subscriber.id !== userId) {
      throw new ForbiddenException(SUBSCRIPTION_NOT_OWNED_BY_USER)
    }

    const newSubscription = wrap(subscription).assign({
      isActive: false,
    })

    await this.subscriptionRepository.persist(newSubscription).flush()
    return new GetSubscriptionDto(newSubscription)
  }
}
