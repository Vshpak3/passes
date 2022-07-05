import { OmitType } from '@nestjs/swagger'

import { CreateSubscriptionDto } from './create-subscription.dto'

export class UpdateSubscriptionDto extends OmitType(CreateSubscriptionDto, [
  'creatorUserId',
] as const) {}
