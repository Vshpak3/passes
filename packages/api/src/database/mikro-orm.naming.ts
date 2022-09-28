import { AbstractNamingStrategy } from '@mikro-orm/core'

export class ColumnNamingStrategy extends AbstractNamingStrategy {
  classToTableName(entityName: string): string {
    return entityName
      .replace('Entity', '')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
    if (!entityName.endsWith('_id')) {
      throw new Error(`Column does not end in _id: ${entityName}`)
    }
    return this.classToTableName(entityName)
  }

  propertyToColumnName(propertyName: string): string {
    if (propertyName !== propertyName.toLowerCase()) {
      throw new Error(`Column name is not lowercase: ${propertyName}`)
    }
    return propertyName
  }

  referenceColumnName(): string {
    return 'id'
  }

  joinColumnName(): string {
    throw new Error('Join columns are not supported')
  }

  joinTableName(): string {
    throw new Error('Join tables are not supported')
  }
}
