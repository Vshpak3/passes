import { Entity, Enum, ManyToMany, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ListEntity } from '../../list/entities/list.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ContentTypeEnum } from '../enums/content-type.enum'

@Entity({ tableName: 'content' })
export class ContentEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Enum(() => ContentTypeEnum)
  contentType: ContentTypeEnum

  @ManyToMany()
  list: ListEntity
}
