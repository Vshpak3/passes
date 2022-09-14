import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import _ from 'lodash'

const internalDtoFields = ['optional', 'forceLower']
interface InternalDtoOptions {
  optional?: boolean
  forceLower?: boolean
}

type DtoOptions = ApiPropertyOptions & InternalDtoOptions

export function DtoProperty(options?: DtoOptions) {
  const decorators: Array<PropertyDecorator> = [Expose()]

  // Remove our custom options
  const apiProperty: ApiPropertyOptions = {}
  _.assign(apiProperty, _.omit(options, internalDtoFields))

  // Check for the optional decorator
  if (options?.optional) {
    decorators.push(IsOptional())
    apiProperty.required = false
  }

  // Check for lower case option
  if (options?.forceLower) {
    decorators.push(Transform((s) => s.value?.toLowerCase()))
  }

  decorators.push(ApiProperty(apiProperty))

  return applyDecorators(...decorators)
}
