import { Entity, Enum, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

@Entity({ tableName: 'creator_verification' })
export class CreatorVerificationEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Enum({
    type: () => CreatorVerificationStepEnum,
    default: CreatorVerificationStepEnum.STEP_1_PROFILE,
  })
  step: CreatorVerificationStepEnum
}
