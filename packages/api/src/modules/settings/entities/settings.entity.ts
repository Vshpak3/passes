import { Entity, Property, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'settings' })
export class SettingsEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity
}
