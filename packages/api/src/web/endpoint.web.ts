import { applyDecorators, HttpCode } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { AllowUnauthorizedRequest } from '../modules/auth/core/auth.metadata'

class ApiOptions {
  summary: string
  responseStatus: number
  responseType: any
  responseDesc: string
  allowUnauthorizedRequest?: boolean
}

export function ApiEndpoint(options: ApiOptions) {
  const auth = options.allowUnauthorizedRequest
    ? AllowUnauthorizedRequest()
    : ApiBearerAuth()

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ApiResponse({
      status: options.responseStatus,
      type: options.responseType,
      description: options.responseDesc,
    }),
    HttpCode(options.responseStatus),
    auth,
  )
}
