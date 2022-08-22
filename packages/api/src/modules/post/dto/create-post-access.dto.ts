import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePostAccessDto {
  @ApiProperty()
  postId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
