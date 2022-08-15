import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { BatchMessageEntity } from '../../messages/entities/batch-message.entity'
import { ContentEntity } from './content.entity'

@Entity({ tableName: 'content_batch_message' })
@Unique({ properties: ['content', 'batchMessage'] })
export class ContentBatchMessageEntity extends BaseEntity {
  @ManyToOne()
  content: ContentEntity

  @ManyToOne()
  batchMessage: BatchMessageEntity
}
