import { InternalServerErrorException } from '@nestjs/common'

export const rejectIfAny = <T>(promises: PromiseSettledResult<T>[]) => {
  const rejected = promises.filter((result) => result.status === 'rejected')

  if (rejected.length) {
    throw new InternalServerErrorException(
      (rejected[0] as PromiseRejectedResult).reason,
    )
  }
}
