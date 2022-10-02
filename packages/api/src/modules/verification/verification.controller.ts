import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { GetCreatorVerificationStepResponseDto } from './dto/get-creator-verification-step.dto'
import { GetPersonaStatusResponseDto } from './dto/get-persona-status.dto'
import { SubmitCreatorVerificationStepRequestDto } from './dto/submit-creator-verification-step.dto'
import { SubmitPersonaInquiryRequestDto } from './dto/submit-persona-inquiry.dto'
import { VerificationService } from './verification.service'

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiEndpoint({
    summary: 'Submit inquiry',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Inquiry was submitted',
    role: RoleEnum.GENERAL,
  })
  @Post('persona/inquiry')
  async submitPersonaInquiry(
    @Req() req: RequestWithUser,
    @Body() submitInquiryRequestDto: SubmitPersonaInquiryRequestDto,
  ): Promise<void> {
    await this.verificationService.submitPersonaInquiry(
      req.user.id,
      submitInquiryRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Check if user can submit inquiry',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Check was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('persona/inquiry/check')
  async canSubmitPersona(
    @Req() req: RequestWithUser,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.verificationService.canSubmitPersona(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Refresh persona KYC verifications for user',
    responseStatus: HttpStatus.OK,
    responseType: GetPersonaStatusResponseDto,
    responseDesc: 'Persona KYC verifications for user were refreshed',
    role: RoleEnum.GENERAL,
  })
  @Get('persona/refresh')
  async refreshPersonaVerifications(
    @Req() req: RequestWithUser,
  ): Promise<GetPersonaStatusResponseDto> {
    return {
      status: await this.verificationService.refreshPersonaVerifications(
        req.user.id,
      ),
    }
  }

  @ApiEndpoint({
    summary: 'Submit creator verification step',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorVerificationStepResponseDto,
    responseDesc: 'Creator verification step was submitted',
    role: RoleEnum.GENERAL,
  })
  @Post('creator-verification/step')
  async submitCreatorVerificationStep(
    @Req() req: RequestWithUser,
    @Body()
    submitCreatorVerificationStepRequestDto: SubmitCreatorVerificationStepRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    return await this.verificationService.submitCreatorVerificationStep(
      req.user.id,
      submitCreatorVerificationStepRequestDto,
      res,
    )
  }

  @ApiEndpoint({
    summary: 'Get current creator verification step',
    responseStatus: HttpStatus.CREATED,
    responseType: GetCreatorVerificationStepResponseDto,
    responseDesc: 'Current creator verification step was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('creator-verification/step')
  async getCreatorVerificationStep(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    return await this.verificationService.getCreatorVerificationStep(
      req.user.id,
    )
  }
}
