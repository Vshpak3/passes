import {
  EntityRepository,
  UniqueConstraintViolationException,
} from '@mikro-orm/core'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'

// Creates an entity in the database and ensures a 409 is thrown if the entity
// already exists. Avoids doing an extra lookup / round trip to the database.
export async function createOrThrowOnDuplicate<T>(
  repository: EntityRepository<T>,
  entity: T,
  errorMessage: string,
): Promise<void> {
  try {
    await repository.persistAndFlush(entity)
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new ConflictException(errorMessage)
    }
    throw new InternalServerErrorException(error)
  }
}
