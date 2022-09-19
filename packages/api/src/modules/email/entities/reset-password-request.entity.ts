import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'reset_password_request' })
export class ResetPasswordRequestEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property()
  usedAt?: Date
}
