import { GetContentDto } from '../../content/dto/get-content.dto'
import { PostEntity } from '../entities/post.entity'

export class GetPostDto {
  id: string
  userId: string
  text: string
  content?: GetContentDto[]
  numLikes: number
  numComments: number
  createdAt: string
  updatedAt: string

  constructor(postEntity: PostEntity) {
    this.id = postEntity.id
    this.userId = postEntity.user.id
    this.text = postEntity.text
    this.content =
      postEntity.content.getItems().map((c) => new GetContentDto(c)) ?? []
    this.numLikes = postEntity.numLikes
    this.numComments = postEntity.numComments
    this.createdAt = postEntity.createdAt.toISOString()
    this.updatedAt = postEntity.createdAt.toISOString()
  }
}
