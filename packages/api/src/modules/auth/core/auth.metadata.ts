import { SetMetadata } from '@nestjs/common'

export const ALLOW_UNAUTHORIZED_REQUEST = 'allowUnauthorizedRequest'

export const AllowUnauthorizedRequest = () =>
  SetMetadata(ALLOW_UNAUTHORIZED_REQUEST, true)
