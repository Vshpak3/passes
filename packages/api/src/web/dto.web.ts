import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import _ from 'lodash'

interface InternalDtoOptions {
  optional?: boolean
  forceLower?: boolean
}

type DtoOptions = ApiPropertyOptions & InternalDtoOptions

export function DtoProperty(options?: DtoOptions) {
  const decorators: Array<PropertyDecorator> = [Expose()]

  // Remove our custom options
  const apiProperty: ApiPropertyOptions = {}
  _.assign(apiProperty, _.pick(options, _.keys(apiProperty)))
  decorators.push(ApiProperty(options))

  // Check for the optional decorator
  if (options?.optional) {
    decorators.push(IsOptional())
  }

  // Check for lower case option
  if (options?.forceLower) {
    decorators.push(Transform((s) => s.value?.toLowerCase()))
  }

  return applyDecorators(...decorators)
}
