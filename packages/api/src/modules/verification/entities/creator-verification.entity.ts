import { Entity, Enum, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

@Entity()
export class CreatorVerificationEntity extends BaseEntity {
  static table = 'creator_verification'
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Enum({
    type: () => CreatorVerificationStepEnum,
    default: CreatorVerificationStepEnum.STEP_1_PROFILE,
  })
  step: CreatorVerificationStepEnum
}
