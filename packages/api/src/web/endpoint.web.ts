import { applyDecorators, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Role, RoleEnum } from '../modules/auth/core/auth.metadata'
import { JwtRefreshGuard } from '../modules/auth/jwt/jwt-refresh.guard'
import { JwtUnverifiedGuard } from '../modules/auth/jwt/jwt-unverified.guard'

class ApiOptions {
  summary: string
  responseStatus: number
  responseType: any
  responseDesc: string
  role: RoleEnum
}

export function ApiEndpoint(options: ApiOptions) {
  let authDecorators
  switch (options.role) {
    case RoleEnum.NO_AUTH:
      authDecorators = []
      break
    case RoleEnum.UNVERIFIED:
      authDecorators = [ApiBearerAuth(), UseGuards(JwtUnverifiedGuard)]
      break
    case RoleEnum.GENERAL:
    case RoleEnum.CREATOR_ONLY:
      authDecorators = [ApiBearerAuth()]
      break
    case RoleEnum.REFRESH:
      authDecorators = [ApiBearerAuth(), UseGuards(JwtRefreshGuard)]
      break
  }

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ApiResponse({
      status: options.responseStatus,
      type: options.responseType,
      description: options.responseDesc,
    }),
    HttpCode(options.responseStatus),
    Role(options.role),
    ...authDecorators,
  )
}
