import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
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

// eslint-disable-next-line sonarjs/cognitive-complexity
export function DtoProperty(options: DtoOptions) {
  const decorators: Array<PropertyDecorator> = [Expose()]

  const apiProperty: ApiPropertyOptions = {}

  // Validation on passed in types
  if (options.type === undefined && options.custom_type === undefined) {
    throw new Error('Either type or custom_type must be set')
  } else if (options.type !== undefined && options.custom_type !== undefined) {
    throw new Error('Cannot set both type and custom_type')
  }

  // Add validation if using a non-custom type
  if (options.type !== undefined && options.type !== 'any') {
    const decorator = decoratorMap[options.type.replace('[]', '')]
    const isArray = options.type.endsWith('[]')
    if (isArray) {
      decorators.push(IsArray())
    }
    decorators.push(decorator('all', { each: isArray }))
  }

  // Add validation for the provided custom type
  if (options.custom_type !== undefined) {
    const type = options.custom_type
    const isArray = Array.isArray(type)
    if (isArray) {
      decorators.push(IsArray())
    }
    if (isEnum(type)) {
      // Validate as an enum if an enum is provided
      decorators.push(IsEnum(type, { each: isArray }))
      apiProperty.enum = type
    } else {
      // Validate nested objects if a type is provided
      decorators.push(ValidateNested({ each: isArray }))
      decorators.push(Type(() => (isArray ? type[0] : type)))
      apiProperty.type = type
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
