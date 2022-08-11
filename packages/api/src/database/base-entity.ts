/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OptionalProps, PrimaryKey, Property, UuidType } from '@mikro-orm/core'
import { v4 } from 'uuid'

// Entity Class properties for optional properties allow null
declare type EntityData<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]?: T[K] extends T[K] | undefined
    ? null | MappedType<T[K]>
    : MappedType<T[K]>
}

// Map properties to type, for entity relationships (object) assign string (id)
declare type MappedType<T> = T extends Date
  ? Date
  : T extends object
  ? string
  : T

// Exclude functions and symbols from class, returning only class properties
declare type ExcludeFunctions<
  T,
  K extends keyof T,
  // eslint-disable-next-line @typescript-eslint/ban-types
> = T[K] extends Function ? never : K extends symbol ? never : K

export abstract class BaseEntity<O = void> {
  [OptionalProps]?: O | 'createdAt' | 'updatedAt'

  @PrimaryKey({ customType: new UuidType() })
  id = v4()

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  static isInitialized = false

  /**
   * Maps data object from entity property name to db column name
   * @example
   * knex(ProfileEntity.table).update(
   *  ProfileEntity.toDict({ profileImageUrl: "url" }) // returns { profile_image_url: "url" }
   * ).where({ id })
   */
  // @ts-ignore
  static toDict<T>(_data: EntityData<T>): Record<string, any> {}
  // @ts-ignore
  static populate<T>(fields: Array<keyof EntityData<T>>): string[] {}

  static table: string
}
