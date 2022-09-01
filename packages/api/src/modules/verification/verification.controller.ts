import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { SubmitInquiryRequestDto } from './dto/submit-inquiry.dto'
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
  async submitInquiry(
    @Req() req: RequestWithUser,
    @Body() submitInquiryRequestDto: SubmitInquiryRequestDto,
  ): Promise<void> {
    await this.verificationService.submitInquiry(
      req.user.id,
      submitInquiryRequestDto,
    )
  }

  @ApiOperation({ summary: 'Check if user can submit inquiry' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Check was returned',
  })
  @Get('can')
  async canSubmit(@Req() req: RequestWithUser): Promise<boolean> {
    return await this.verificationService.canSubmit(req.user.id)
  }
}
