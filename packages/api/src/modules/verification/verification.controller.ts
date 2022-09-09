import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetCreatorVerificationStepResponseDto } from './dto/get-creator-verification-step.dto'
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
    responseType: Boolean,
    responseDesc: 'Check was retrieved',
  })
  @Get('persona/inquiry/check')
  async canSubmitPersona(@Req() req: RequestWithUser): Promise<boolean> {
    return await this.verificationService.canSubmitPersona(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Refresh persona KYC verifications for user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Persona KYC verifications for user were refreshed',
  })
  @Post('persona/refresh')
  async refreshPersonaVerifications(
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.verificationService.refreshPersonaVerifications(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Submit creator verification step',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorVerificationStepResponseDto,
    responseDesc: 'Creator verification step was submitted',
  })
  @Post('creator-verification/step')
  async submitCreatorVerificationStep(
    @Req() req: RequestWithUser,
    @Body()
    submitCreatorVerificationStepRequestDto: SubmitCreatorVerificationStepRequestDto,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    return await this.verificationService.submitCreatorVerificationStep(
      req.user.id,
      submitCreatorVerificationStepRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get current creator verification step',
    responseStatus: HttpStatus.CREATED,
    responseType: GetCreatorVerificationStepResponseDto,
    responseDesc: 'Current creator verification step was retrieved',
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
