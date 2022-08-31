import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { GetSignedUrlResponseDto } from '../s3content/dto/get-signed-url.dto'
import { S3ContentService } from '../s3content/s3content.service'
import { ContentService } from './content.service'
import { CreateContentRequestDto } from './dto/create-content.dto'
import {
  GetContentResponseDto,
  GetContentsResponseDto,
} from './dto/get-content.dto'
import { GetVaultQueryRequestDto } from './dto/get-vault-query-dto'

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly s3contentService: S3ContentService,
  ) {}

  @ApiOperation({ summary: 'Create content' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetContentResponseDto,
    description: 'Content was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createContentRequestDto: CreateContentRequestDto,
  ): Promise<GetContentResponseDto> {
    return this.contentService.create(req.user.id, createContentRequestDto)
  }

  @ApiOperation({ summary: 'Get signed url for specified path' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSignedUrlResponseDto,
    description: 'Url was signed',
  })
  @UseGuards(JwtAuthGuard)
  @Get('sign/:path(*)')
  async preSignUrl(
    @Req() req: RequestWithUser,
    @Param('path') path: string,
  ): Promise<GetSignedUrlResponseDto> {
    // TODO: validate path
    const url = await this.s3contentService.preSignUrl(path, req.user.id)
    return { url }
  }

  @ApiOperation({
    summary: 'Gets all content associated with the current authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetContentsResponseDto,
    description: 'Creator vault was retrieved',
  })
  @Get('vault')
  async getVaultContent(
    @Req() req: RequestWithUser,
    @Query() { category, type }: GetVaultQueryRequestDto,
  ): Promise<GetContentsResponseDto> {
    // TODO: add pagination
    return new GetContentsResponseDto(
      await this.contentService.getVault(req.user.id, category, type),
    )
  }
}
