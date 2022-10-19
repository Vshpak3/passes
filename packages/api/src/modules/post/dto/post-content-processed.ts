import { PickType } from '@nestjs/swagger'

import { PostDto } from './post.dto'

export class PostContentProcessed extends PickType(PostDto, [
  'postId',
  'contents',
  'contentProcessed',
]) {}
