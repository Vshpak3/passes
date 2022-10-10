import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
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

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiEndpoint({
    summary: 'Create content',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Content was created',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post()
  async createContent(
    @Req() req: RequestWithUser,
    @Body() createContentRequestDto: CreateContentRequestDto,
  ): Promise<void> {
    await this.contentService.createContent(
      req.user.id,
      createContentRequestDto,
    )
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
    summary: 'Get pre signed url for profile image',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Profile image was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/profile/image')
  async preSignProfileImage(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignProfileImage(
      req.user.id,
      'profile',
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get pre signed url for profile banner',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Profile banner was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/profile/banner')
  async preSignProfileBanner(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignProfileImage(
      req.user.id,
      'banner',
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get pre signed url for pass image',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Pass image was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/pass/:passId')
  async preSignPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignPass(req.user.id, passId)
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get signed url for content',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'Content url was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/content/:contentType')
  async preSignContent(
    @Req() req: RequestWithUser,
    @Param() params: CreateContentRequestDto,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignUploadContent(
      req.user.id,
      params.contentType,
    )
    return { url }
  }

  @ApiEndpoint({
    summary: 'Get signed url for W-9 form',
    responseStatus: HttpStatus.OK,
    responseType: GetSignedUrlResponseDto,
    responseDesc: 'W-9 url was signed',
    role: RoleEnum.GENERAL,
  })
  @Get('sign/w9')
  async preSignW9(
    @Req() req: RequestWithUser,
  ): Promise<GetSignedUrlResponseDto> {
    const url = await this.contentService.preSignW9(req.user.id)
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
