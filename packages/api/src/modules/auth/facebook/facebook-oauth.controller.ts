import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { redirectAfterOAuthLogin } from '../../../util/auth.util'
import { ApiEndpoint } from '../../../web/endpoint.web'
import { S3ContentService } from '../../s3content/s3content.service'
import { FacebookDeletionConfirmationDto } from '../dto/fb/fb-deletion-confirmation.dto'
import { RawFacebookDeletionRequestDto } from '../dto/fb/raw-fb-deletion-request.dto'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { FacebookComplianceService } from './facebook-compliance.service'
import { FacebookOauthGuard } from './facebook-oauth.guard'

@Controller('auth/facebook')
@ApiTags('auth/facebook')
export class FacebookOauthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly s3contentService: S3ContentService,
    private readonly fbComplianceService: FacebookComplianceService,
  ) {}

  @ApiEndpoint({
    summary: 'Start the facebook oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Start the facebook oauth flow',
    allowUnauthorizedRequest: true,
  })
  @UseGuards(FacebookOauthGuard)
  @Get()
  async facebookAuth() {
    // Guard redirects
  }

  @ApiEndpoint({
    summary: 'Redirect from facebook oauth flow',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Redirect from facebook oauth flow',
    allowUnauthorizedRequest: true,
  })
  @ApiBearerAuth()
  @UseGuards(FacebookOauthGuard)
  @Get('redirect')
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return redirectAfterOAuthLogin.bind(this)(res, req.user)
  }

  @ApiEndpoint({
    summary: 'Initiate a deletion request for a Facebook OAuth user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Initiate a deletion request for a Facebook OAuth user',
    allowUnauthorizedRequest: true,
  })
  @Post('deletion_callback')
  async facebookInitiateDelete(
    @Body() body: RawFacebookDeletionRequestDto,
    @Res() res: Response,
  ) {
    const confirmationCode =
      await this.fbComplianceService.initiateDeletionRequest(
        body.signed_request,
      )

    const url =
      this.configService.get('apiBaseUrl') +
      `/auth/facebook/deletion_confirmation?confirmationCode=${confirmationCode}`

    // Facebook requires this format, can't use standard JSON...
    res.type('json')
    res.send(`{ url: '${url}', confirmation_code: '${confirmationCode}' }`)
  }

  @ApiEndpoint({
    summary: 'Check if a deletion request has been fulfilled',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Check if a deletion request has been fulfilled',
    allowUnauthorizedRequest: true,
  })
  @Get('deletion_confirmation')
  async facebookDeletionConfirmation(
    @Query('confirmationCode') confirmationCode: string,
  ) {
    if (!confirmationCode) {
      return new FacebookDeletionConfirmationDto(false)
    }

    const exists = await this.fbComplianceService.checkDeletionRequest(
      confirmationCode,
    )

    // If exists, then the deletion request has been processed
    return new FacebookDeletionConfirmationDto(exists)
  }
}
