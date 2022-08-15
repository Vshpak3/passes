import { EntityProperty, Platform, Type } from '@mikro-orm/core'

export class UuidType extends Type<string, string> {
  // convertToDatabaseValue(value: string, platform: Platform): string {
  //   return Buffer.from(x, 'utf8')
  // }

  // convertToJSValue(value: Buffer, platform: Platform): Buffer {
  //   return new Buffer(toString('utf-8'))
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColumnType(prop: EntityProperty, platform: Platform) {
    return 'VARBINARY(16)'
  }
}
