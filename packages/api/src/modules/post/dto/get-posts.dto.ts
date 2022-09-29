import { DtoProperty } from '../../../web/dto.web'
import {
  GetFeedRequestDto,
  GetFeedResponseDto,
} from '../../feed/dto/get-feed-dto'

export class GetPostsRequestDto extends GetFeedRequestDto {
  @DtoProperty({ type: 'boolean' })
  scheduledOnly?: boolean
}

export class GetPostsResponseDto extends GetFeedResponseDto {}
