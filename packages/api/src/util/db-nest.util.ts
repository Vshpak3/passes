import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { Logger } from 'winston'

// Creates an entity in the database and ensures a 409 is thrown if the entity
// already exists. Avoids doing an extra lookup / round trip to the database.
export async function createOrThrowOnDuplicate<T>(
  query: () => Promise<T>,
  logger: Logger,
  errorMessage: string,
  throwFourHundred?: boolean,
): Promise<void> {
  try {
    await query()
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      if (throwFourHundred) {
        throw new BadRequestException(errorMessage)
      }
      throw new ConflictException(errorMessage)
    }
    logger.error(error)
    throw new InternalServerErrorException('Internal Server Error')
  }
}
