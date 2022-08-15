import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ListEntity } from '../../list/entities/list.entity'
import { ListMemberEntity } from '../../list/entities/list-member.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'batch_message' })
export class BatchMessageEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToOne()
  list: ListEntity

  @Property()
  text: string

  @Property()
  lastProcessed?: ListMemberEntity
}
