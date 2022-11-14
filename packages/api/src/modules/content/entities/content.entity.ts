import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ContentTypeEnum } from '../enums/content-type.enum'

@Entity()
export class ContentEntity extends BaseEntity {
  static table = 'content'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Enum(() => ContentTypeEnum)
  content_type: ContentTypeEnum

  @Property({ default: false })
  in_message: boolean

  @Property({ default: false })
  in_post: boolean

  @Property({ length: 3 })
  deleted_at: Date | null

  @Property({ default: false })
  processed: boolean

  @Property({ default: false })
  failed: boolean

  @Property({ default: false })
  uploaded: boolean
}
