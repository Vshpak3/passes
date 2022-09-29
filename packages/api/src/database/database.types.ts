import { EntityProperty, Platform, Type } from '@mikro-orm/core'

export class DateType extends Type<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColumnType(prop: EntityProperty, platform: Platform) {
    return 'date'
  }
}
