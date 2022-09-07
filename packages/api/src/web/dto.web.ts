import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export function DtoProperty(options?: ApiPropertyOptions) {
  const isOptional = options?.required === false ? [IsOptional] : []
  return applyDecorators(Expose(), ApiProperty(options), ...isOptional)
}
