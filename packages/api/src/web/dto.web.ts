import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import _ from 'lodash'

// Hacky way to validate a type is an enum
function isEnum(e: any): boolean {
  return _.isEmpty(_.xor(Object.keys(e), Object.getOwnPropertyNames(e)))
}

// If 'any' is provided there will be no validation
type TypeOptions =
  | 'any'
  | 'boolean'
  | 'boolean[]'
  | 'date'
  | 'date[]'
  | 'number'
  | 'number[]'
  | 'string'
  | 'string[]'
  | 'uuid'
  | 'uuid[]'

const decoratorMap = {
  boolean: IsBoolean,
  date: IsDateString,
  number: IsInt,
  string: IsString,
  uuid: IsUUID,
}

export interface DtoOptions {
  type?: TypeOptions
  custom_type?: any
  optional?: boolean
  forceLower?: boolean
}

export function DtoProperty(options: DtoOptions) {
  const decorators: Array<PropertyDecorator> = [Expose()]

  const apiProperty: ApiPropertyOptions = {}

  // Validation on passed in types
  if (options.type === undefined && options.custom_type === undefined) {
    throw new Error('Either type or custom_type must be set')
  } else if (options.type !== undefined && options.custom_type !== undefined) {
    throw new Error('Cannot set both type and custom_type')
  }

  // Adds validation for the provided type
  if (options.type !== undefined && options.type !== 'any') {
    const decorator = decoratorMap[options.type.replace('[]', '')]
    const args = options.type.endsWith('[]') ? ['all', { each: true }] : []
    decorators.push(decorator(...args))
  }

  // Adds validation for the provided custom type
  if (options.custom_type !== undefined) {
    if (isEnum(options.custom_type)) {
      // Validate as an enum if an enum is provided
      decorators.push(IsEnum(options.custom_type))
      apiProperty.enum = options.custom_type
    } else {
      // Validate nested objects if a type is provided
      decorators.push(ValidateNested())
      apiProperty.type = options.custom_type
    }
  }

  // Check for the optional decorator
  if (options.optional) {
    decorators.push(IsOptional())
    apiProperty.required = false
  }

  // Check for lower case option
  if (options.forceLower) {
    decorators.push(Transform((s) => s.value?.toLowerCase()))
  }

  decorators.push(ApiProperty(apiProperty))

  return applyDecorators(...decorators)
}
