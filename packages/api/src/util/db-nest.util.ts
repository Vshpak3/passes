import { ConflictException, InternalServerErrorException } from '@nestjs/common'

// Creates an entity in the database and ensures a 409 is thrown if the entity
// already exists. Avoids doing an extra lookup / round trip to the database.
export async function createOrThrowOnDuplicate<T>(
  query: () => Promise<T>,
  errorMessage: string,
): Promise<void> {
  try {
    await query()
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ConflictException(errorMessage)
    }
    console.error(error)
    throw new InternalServerErrorException('Internal Server Error')
  }
}
