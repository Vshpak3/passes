import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { PostEntity } from '../entities/post.entity'
import { PostNotificationEnum } from '../enum/post.notification.enum'
import { PostDto } from './post.dto'

export class PostNotificationDto extends PostDto {
  @DtoProperty({ type: 'uuid' })
  recieverId: string

  @DtoProperty({ custom_type: PostNotificationEnum })
  notification: PostNotificationEnum

  constructor(
    post:
      | (PostEntity & {
          is_liked: boolean
          username: string
          display_name: string
          paid: boolean
          paying: boolean
        })
      | undefined,
    isOwner: boolean,
    contents: ContentDto[],
    receiverId: string,
    notification: PostNotificationEnum,
  ) {
    super(post, isOwner, contents)
    this.recieverId = receiverId
    this.notification = notification
  }
}
