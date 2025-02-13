import { applyDecorators, HttpCode, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiResponseMetadata,
} from '@nestjs/swagger'

import { Role, RoleEnum } from '../modules/auth/core/auth.role'
import { JwtCreatorOnlyGuard } from '../modules/auth/jwt/creator-only/jwt-creator-only.guard'
import { JwtGeneralGuard } from '../modules/auth/jwt/general/jwt-general.guard'
import { JwtNoAuthGuard } from '../modules/auth/jwt/no-auth/jwt-no-auth.guard'
import { JwtRefreshGuard } from '../modules/auth/jwt/refresh/jwt-refresh.guard'
import { JwtUnverifiedGuard } from '../modules/auth/jwt/unverified/jwt-unverified.guard'

class ApiOptions {
  summary: string
  responseStatus: number
  responseType: ApiResponseMetadata['type']
  responseDesc: string
  role: RoleEnum
}

export function ApiEndpoint(options: ApiOptions) {
  let authDecorators
  switch (options.role) {
    case RoleEnum.NO_AUTH:
      authDecorators = [UseGuards(JwtNoAuthGuard)]
      break
    case RoleEnum.NO_AUTH_TRUE:
      authDecorators = []
      break
    case RoleEnum.UNVERIFIED:
      authDecorators = [ApiBearerAuth(), UseGuards(JwtUnverifiedGuard)]
      break
    case RoleEnum.GENERAL:
      authDecorators = [ApiBearerAuth(), UseGuards(JwtGeneralGuard)]
      break
    case RoleEnum.CREATOR_ONLY:
      authDecorators = [ApiBearerAuth(), UseGuards(JwtCreatorOnlyGuard)]
      break
    case RoleEnum.REFRESH:
      authDecorators = [UseGuards(JwtRefreshGuard)]
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
