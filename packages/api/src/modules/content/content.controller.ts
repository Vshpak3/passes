import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { GetSignedUrlResponseDto } from '../s3content/dto/get-signed-url.dto'
import { ContentService } from './content.service'
import { CreateContentRequestDto } from './dto/create-content.dto'
import { DeleteContentRequestDto } from './dto/delete-content.dto'
import {
  GetVaultQueryRequestDto,
  GetVaultQueryResponseDto,
} from './dto/get-vault-query-dto'
import {
  MarkProcessedProfileImageRequestDto,
  MarkProcessedUserContentRequestDto,
} from './dto/mark-processed'
import { MarkUploadedRequestDto } from './dto/mark-uploaded-dto'
import { PresignPassRequestDto } from './dto/presign-pass.dto'

@ApiTags('content')
@Controller('content')
export class ContentController {
  private lambdaSecret: string

  constructor(
    private readonly configService: ConfigService,
    private readonly contentService: ContentService,
  ) {
    this.lambdaSecret = this.configService.get('lambda.secret') as string
  }

  @ApiEndpoint({
    summary: 'Mark user content as processed',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Content was marked successfully',
    role: RoleEnum.NO_AUTH, // Must be no auth for Lambdas
  })
  @Post('processed/usercontent')
  async markUserContentProcessed(
    @Body() markProcessedDto: MarkProcessedUserContentRequestDto,
  ): Promise<void> {
    if (this.lambdaSecret !== markProcessedDto.secret) {
      throw new BadRequestException()
    }
    await this.contentService.markUserContentProcessed(markProcessedDto)
  }

  @ApiEndpoint({
    summary: 'Mark profile image as processed',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Content was marked successfully',
    role: RoleEnum.NO_AUTH, // Must be no auth for Lambdas
  })
  @Post('processed/profile')
  async markProfileImageProcessed(
    @Body()
    markProcessedDto: MarkProcessedProfileImageRequestDto,
  ): Promise<void> {
    if (this.lambdaSecret !== markProcessedDto.secret) {
      throw new BadRequestException()
    }
    await this.contentService.markProfileImageProcessed(markProcessedDto)
  }

  @ApiEndpoint({
    summary: 'Mark uploaded',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Content was marked uploaded',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('uploaded')
  async markUploaded(
    @Req() req: RequestWithUser,
    @Body() markUploadedDto: MarkUploadedRequestDto,
  ): Promise<void> {
    await this.contentService.markUploaded(req.user.id, markUploadedDto)
  }

  @ApiEndpoint({
    summary: 'Delete content',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'Content was deleted',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Delete()
  async deleteContent(
    @Req() req: RequestWithUser,
    @Body() deleteContentRequestDto: DeleteContentRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.contentService.deleteContent(
        req.user.id,
        deleteContentRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Delete profile banner',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Profile banner was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete('profile-banner')
  async deleteProfileBanner(@Req() req: RequestWithUser): Promise<void> {
    await this.contentService.deleteProfileBanner(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Get pre signed url for uploading a profile image',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Profile image upload url was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/upload/profile-image')
  async preSignUploadProfileImage(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadProfileImage(
      req.user.id,
      'image',
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get pre signed url for uploading a profile banner',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Profile banner upload url was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/upload/profile-banner')
  async preSignUploadProfileBanner(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadProfileImage(
      req.user.id,
      'banner',
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get pre signed url for uploading a pass',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Pass upload url was signed',
    role: RoleEnum.GENERAL,
  })
  @Post('sign/upload/pass')
  async preSignUploadPass(
    @Req() req: RequestWithUser,
    @Body() presignPassRequestDto: PresignPassRequestDto,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadPass(
      req.user.id,
      presignPassRequestDto.passId,
      presignPassRequestDto.type,
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get signed url for uploading a W-9 form',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'W-9 upload url was signed',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Get('sign/upload/w9')
  async preSignUploadW9(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadW9(req.user.id)
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get signed url for uploading user content',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Content upload url was signed',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('sign/upload/content')
  async preSignUploadContent(
    @Req() req: RequestWithUser,
    @Body() createContentRequestDto: CreateContentRequestDto,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadContent(
      req.user.id,
      createContentRequestDto,
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Gets all content associated with the current authenticated user',
    responseStatus: HttpStatus.OK,
    responseType: GetVaultQueryResponseDto,
    responseDesc: 'Creator vault was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('vault')
  async getVaultContent(
    @Req() req: RequestWithUser,
    @Body() getVaultQueryRequestDto: GetVaultQueryRequestDto,
  ): Promise<GetVaultQueryResponseDto> {
    return new GetVaultQueryResponseDto(
      await this.contentService.getVault(req.user.id, getVaultQueryRequestDto),
      getVaultQueryRequestDto,
    )
  }
}
