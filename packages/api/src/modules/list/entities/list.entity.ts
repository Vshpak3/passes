import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'list' })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 255 })
  name: string
}
