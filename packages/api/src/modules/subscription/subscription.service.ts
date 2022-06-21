import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { Subscription } from './entities/subscription.entity'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: EntityRepository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<string> {
    return 'TODO: This action adds a new subscription'
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} subscription`
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    ;`TODO: This action updates a #${id} subscription`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} subscription`
  }
}
