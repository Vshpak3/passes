import { PickType } from '@nestjs/swagger'

import { CreatePostDto } from './create-post.dto'

export class UpdatePostDto extends PickType(CreatePostDto, ['text'] as const) {}
