import { EntityManager, Knex, knex } from '@mikro-orm/mysql'
import { Injectable, Scope } from '@nestjs/common'

import { getKnexOptions } from './database.options'

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
  reference: 'scalar' | '1:1' | 'm:1' | '1:m'
  targetMeta: { props: MetadataProp[] }
  [key: string]: any
}

const propsToObj = (props: MetadataProp[]): Record<string, MetadataProp> =>
  props.reduce((obj, prop) => {
    obj[prop.name] = prop
    return obj
  }, {})

const mapEntityDataDBFields = <T>(
  fieldToProp: Record<string, string>,
  data: EntityData<T>,
): Record<string, any> => {
  return Object.keys(fieldToProp).reduce((objMap, key) => {
    if (data[key] !== undefined) {
      objMap[fieldToProp[key]] = data[key]
    }
    return objMap
  }, {})
}

const mapFieldsToEntity = (
  propToField: Record<string, string>,
  data: Record<string, any>,
): Record<string, any> => {
  return Object.keys(propToField).reduce((objMap, key) => {
    if (data[key] !== undefined) {
      objMap[propToField[key]] = data[key]
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

  constructor(entityManager: EntityManager) {
    this._entityManager = entityManager
    this.knex = entityManager.getKnex()
    this.knex = knex(getKnexOptions(this.knex))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    Object.values(this._entityManager.metadata.getAll()).forEach(
      ({ class: entityClass, props, tableName }) => {
        if (entityClass && !entityClass.isInitialized) {
          const propObj = propsToObj(props)
          const { fieldToProp, propToField } = Object.keys(propObj).reduce(
            (objMap, key) => {
              objMap.fieldToProp[propObj[key].fieldNames[0]] = key
              objMap.propToField[key] = propObj[key].fieldNames[0]
              return objMap
            },
            { fieldToProp: {}, propToField: {} },
          )

          entityClass.table = tableName

          entityClass.toDict = (data) =>
            mapEntityDataDBFields(propToField, data)

          entityClass.populate = (fields) =>
            mapPopulateFields(propObj, fields as string[])

          entityClass.fromFields = (data) =>
            new entityClass().instantiate(mapFieldsToEntity(fieldToProp, data))

          entityClass.isInitialized = true
        }
      },
    )
  }
}
