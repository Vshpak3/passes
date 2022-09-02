/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BlobType,
  OptionalProps,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core'
import { Knex } from '@mikro-orm/mysql'

// Entity Class properties for optional properties allow null
declare type EntityData<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]?: T[K] extends T[K] | undefined
    ? null | MappedType<T[K]>
    : MappedType<T[K]>
}

// Map properties to type, for entity relationships (object) assign string (id)
declare type MappedType<T> =
  | (T extends Date ? Date | string : T extends object ? string : T)
  | Knex.Raw<any>

// Exclude functions and symbols from class, returning only class properties
declare type ExcludeFunctions<
  T,
  K extends keyof T,
  // eslint-disable-next-line @typescript-eslint/ban-types
> = T[K] extends Function ? never : K extends symbol ? never : K

export class EntityDBHelpers {
  // The following properties get initialized and replaced in the database service init function
  static isInitialized = false

  // TODO: Get the entity type without passing it manually
  /**
   * Maps data object from entity property name to db column name
   * @example
   * knex(ProfileEntity.table).update(
   *  ProfileEntity.toDict<ProfileEntity>({ profileImageUrl: "url" })
   *  // returns { profile_image_url: "url" }
   * ).where({ id })
   */
  // @ts-ignore
  static toDict<T>(_data: EntityData<T>): Record<string, any> {}
  // @ts-ignore
  static populate<T>(fields: Array<keyof EntityData<T>>): string[] {}

  static table: string

  instantiate<T>(init?: Partial<T>): this {
    Object.assign(this, init)
    return this
  }
}

export abstract class BaseEntity<O = void> extends EntityDBHelpers {
  [OptionalProps]?: O | 'createdAt' | 'updatedAt'

  @PrimaryKey({
    type: new UuidType(),
    defaultRaw: '(UUID())',
  })
  id: string

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
