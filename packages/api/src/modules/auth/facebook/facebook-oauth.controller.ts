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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { redirectAfterSuccessfulLogin } from '../../../util/auth.util'
import { UserEntity } from '../../user/entities/user.entity'
import { AllowUnauthorizedRequest } from '../auth.metadata'
import { FacebookDeletionConfirmationDto } from '../dto/fb-deletion-confirmation'
import { RawFacebookDeletionRequestDto } from '../dto/raw-fb-deletion-request'
import { JwtAuthService } from '../jwt/jwt-auth.service'
import { JwtRefreshService } from '../jwt/jwt-refresh.service'
import { FacebookComplianceService } from './facebook-compliance.service'
import { FacebookOauthGuard } from './facebook-oauth.guard'

@Controller('auth/facebook')
@ApiTags('auth/facebook')
export class FacebookOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly configService: ConfigService,
    private readonly fbComplianceService: FacebookComplianceService,
  ) {}

  @ApiOperation({ summary: 'Start the facebook oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start the facebook oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(FacebookOauthGuard)
  @Get()
  async facebookAuth() {
    // Guard redirects
  }

  @ApiOperation({ summary: 'Redirect from facebook oauth flow' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirect from facebook oauth flow',
  })
  @AllowUnauthorizedRequest()
  @UseGuards(FacebookOauthGuard)
  @Get('redirect')
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity
    return redirectAfterSuccessfulLogin.bind(this)(res, user)
  }

  @ApiOperation({
    summary: 'Initiate a deletion request for a Facebook OAuth user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Initiate a deletion request for a Facebook OAuth user',
  })
  @AllowUnauthorizedRequest()
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

  @ApiOperation({ summary: 'Check if a deletion request has been fulfilled' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check if a deletion request has been fulfilled',
  })
  @AllowUnauthorizedRequest()
  @Get('deletion_confirmation')
  async facebookDeletionConfirmation(
    @Query('confirmationCode') confirmationCode: string,
  ) {
    const exists = await this.fbComplianceService.checkDeletionRequest(
      confirmationCode,
    )

    // If exists, then the deletion request has been processed
    return new FacebookDeletionConfirmationDto(exists)
  }
}
