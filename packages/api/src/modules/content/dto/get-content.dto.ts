import { ContentEntity } from '../entities/content.entity'

export class GetContentDto {
  id: string
  postId: string
  url: string
  contentType: string

  constructor(contentEntity: ContentEntity) {
    this.id = contentEntity.id
    this.postId = contentEntity.post.id
    this.url = contentEntity.url
    this.contentType = contentEntity.contentType
  }
}
