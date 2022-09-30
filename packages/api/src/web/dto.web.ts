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
  registerDecorator,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import _ from 'lodash'

// Hacky way to validate a type is an enum
function isEnum(e: any): boolean {
  return _.isEmpty(_.xor(Object.keys(e), Object.getOwnPropertyNames(e)))
}

export function IsCurrencyNumber(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, _args: ValidationArguments) {
          return (
            typeof value === 'number' && value >= 0 && (value * 100) % 1 === 0
          )
        },
      },
    })
  }
}
// If 'any' is provided there will be no validation
type TypeOptions =
  | 'any'
  | 'boolean'
  | 'boolean[]'
  | 'currency'
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
  currency: IsCurrencyNumber,
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
  nullable?: boolean
  format?: string
}
// eslint-disable-next-line sonarjs/cognitive-complexity
export function DtoProperty(options: DtoOptions) {
  const decorators: Array<PropertyDecorator> = [Expose()]
  const apiProperties: ApiPropertyOptions = {}

  const general_type = options.type
  const custom_type = options.custom_type

  // Validation on passed in types
  if (general_type === undefined && custom_type === undefined) {
    throw new Error('Either type or custom_type must be set')
  } else if (general_type !== undefined && custom_type !== undefined) {
    throw new Error('Cannot set both type and custom_type')
  }

  // Add validation if using a non-custom type
  if (general_type !== undefined && general_type !== 'any') {
    const type = general_type.replace('[]', '')
    const isArray = general_type.endsWith('[]')
    if (isArray) {
      decorators.push(IsArray())
      apiProperties.isArray = true
    }
    decorators.push(decoratorMap[type]('all', { each: isArray }))
    switch (type) {
      case 'date':
        apiProperties.type = 'string'
        apiProperties.format = 'date-time'
        break
      case 'currency':
        apiProperties.type = 'number'
        apiProperties.format = 'currency'
        break
      case 'number':
        apiProperties.type = 'integer'
        break
      case 'uuid':
        apiProperties.type = 'string'
        apiProperties.format = 'uuid'
        break
      default:
        apiProperties.type = type
        break
    }

    if (options.format) {
      apiProperties.format = options.format
    }
  }

  // Add validation for the provided custom type
  // TODO: consider arrays of enums
  if (custom_type !== undefined) {
    const isArray = Array.isArray(custom_type)
    if (isArray) {
      decorators.push(IsArray())
    }
    if (isEnum(custom_type)) {
      decorators.push(IsEnum(custom_type, { each: isArray }))
      apiProperties.enum = custom_type
    } else {
      decorators.push(ValidateNested({ each: isArray }))
      decorators.push(Type(() => (isArray ? custom_type[0] : custom_type)))
      apiProperties.type = custom_type
    }
  }

  // Check for the nullable decorator
  if (options.nullable) {
    decorators.push(ValidateIf((_object, value) => value !== null))
    apiProperties.nullable = true
  }

  // Check for the optional decorator
  if (options.optional) {
    decorators.push(IsOptional())
    apiProperties.required = false
  }

  // Check for lower case option
  if (options.forceLower) {
    decorators.push(Transform((s) => s.value?.toLowerCase()))
  }

  decorators.push(ApiProperty(apiProperties))

  return applyDecorators(...decorators)
}
