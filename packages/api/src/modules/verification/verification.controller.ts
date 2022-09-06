import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { GetCreatorVerificationStepResponseDto } from './dto/get-creator-verification-step.dto'
import { SubmitCreatorVerificationStepRequestDto } from './dto/submit-creator-verification-step.dto'
import { SubmitPersonaInquiryRequestDto } from './dto/submit-persona-inquiry.dto'
import { VerificationService } from './verification.service'

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiOperation({ summary: 'Submit inquiry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'Inquiry was submitted',
  })
  @Post()
  async submitPersonaInquiry(
    @Req() req: RequestWithUser,
    @Body() submitInquiryRequestDto: SubmitPersonaInquiryRequestDto,
  ): Promise<void> {
    await this.verificationService.submitPersonaInquiry(
      req.user.id,
      submitInquiryRequestDto,
    )
  }

  @ApiOperation({ summary: 'Check if user can submit inquiry' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Check was retrieved',
  })
  @Get('can')
  async canSubmitPersona(@Req() req: RequestWithUser): Promise<boolean> {
    return await this.verificationService.canSubmitPersona(req.user.id)
  }

  @ApiOperation({ summary: 'Refresh persona KYC verifications for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Persona KYC verifications for user were refreshed',
  })
  @Post('refresh/persona')
  async refreshPersonaVerifications(
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.verificationService.refreshPersonaVerifications(req.user.id)
  }

  @ApiOperation({ summary: 'Submit creator verification step' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCreatorVerificationStepResponseDto,
    description: 'Creator verification step was submitted',
  })
  @Post('step')
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

  @ApiOperation({ summary: 'Get current creator verification step' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetCreatorVerificationStepResponseDto,
    description: 'Current creator verification step was retrieved',
  })
  @Get('step')
  async getCreatorVerificationStep(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    return await this.verificationService.getCreatorVerificationStep(
      req.user.id,
    )
  }
}
