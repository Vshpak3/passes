import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { SubscriptionEntity } from './entities/subscription.entity'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: EntityRepository<SubscriptionEntity>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<string> {
    return `TODO: This action adds a new subscription ${createSubscriptionDto}`
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} subscription`
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    ;`TODO: This action updates a #${id} subscription ${updateSubscriptionDto}`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} subscription`
  }
}
