import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ContentTypeEnum } from '../enums/content-type.enum'

@Entity({ tableName: 'content' })
export class ContentEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Enum(() => ContentTypeEnum)
  contentType: ContentTypeEnum

  @Property({ default: false })
  inMessage: boolean

  @Property({ default: false })
  inPost: boolean
}
