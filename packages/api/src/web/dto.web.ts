import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export function DtoProperty(options?: ApiPropertyOptions) {
  return applyDecorators(Expose(), ApiProperty(options))
}
