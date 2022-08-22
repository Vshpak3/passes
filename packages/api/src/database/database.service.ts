import { EntityManager, Knex } from '@mikro-orm/mysql'
import { Injectable, Scope } from '@nestjs/common'
import { v4 } from 'uuid'

declare type EntityData<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]?: T[K] extends object ? string : T[K]
}

// Exclude functions and symbols from class, returning only class properties
declare type ExcludeFunctions<
  T,
  K extends keyof T,
  // eslint-disable-next-line @typescript-eslint/ban-types
> = T[K] extends Function ? never : K extends symbol ? never : K

type MetadataProp = {
  name: string
  fieldNames: string[]
  reference: 'scalar' | '1:1' | 'm:1' | '1:m' // TODO: ManyToMany case
  targetMeta: { props: MetadataProp[] }
  [key: string]: any
}

const propsToObj = (props: MetadataProp[]): Record<string, MetadataProp> =>
  props.reduce((obj, prop) => {
    obj[prop.name] = prop
    return obj
  }, {})

const mapEntityDataDBFields = <T>(
  propObj: Record<string, MetadataProp>,
  data: EntityData<T>,
): Record<string, any> => {
  return Object.keys(propObj).reduce((objMap, key) => {
    if (data[key] !== undefined) {
      objMap[propObj[key].fieldNames[0]] = data[key]
    }
    return objMap
  }, {})
}

const mapPopulateFields = (
  propObj: Record<string, MetadataProp>,
  fields: string[],
  subEntity?: string,
) =>
  fields.reduce((resultArray: string[], field) => {
    if (propObj[field]) {
      // TODO: ManyToMany case
      switch (propObj[field].reference) {
        case 'scalar': {
          let newField = propObj[field].fieldNames[0]
          if (subEntity)
            newField = `${subEntity}.${newField} as ${subEntity}_${newField}`
          resultArray = [...resultArray, newField]
          break
        }
        case 'm:1':
        case '1:1': {
          const { props } = propObj[field].targetMeta
          const targetPropObj = propsToObj(props)
          resultArray = [
            ...resultArray,
            ...mapPopulateFields(
              targetPropObj,
              Object.keys(targetPropObj).filter(
                (key) => targetPropObj[key].reference === 'scalar',
              ),
              field,
            ),
          ]
          break
        }
        // TODO: OneToMany case
        case '1:m':
          break
        default:
          break
      }
    }
    return resultArray
  }, [])

@Injectable({
  scope: Scope.TRANSIENT,
})
export class DatabaseService {
  protected _entityManager: EntityManager
  knex: Knex
  v4 = v4

  constructor(entityManager: EntityManager) {
    this._entityManager = entityManager
    this.knex = entityManager.getKnex()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { metadata } = this._entityManager
    const entityMetadata = Object.values(metadata.getAll())
    entityMetadata.forEach(({ class: entityClass, props, tableName }) => {
      if (entityClass && !entityClass.isInitialized) {
        entityClass.table = tableName

        entityClass.toDict = (data) =>
          mapEntityDataDBFields(propsToObj(props), data)

        entityClass.populate = (fields) =>
          mapPopulateFields(propsToObj(props), fields as string[])

        entityClass.isInitialized = true
      }
    })
  }
}
