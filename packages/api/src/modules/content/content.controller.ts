import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { GetSignedUrlResponseDto } from '../s3/dto/get-signed-url.dto'
import { S3Service } from '../s3/s3.service'
import { ContentService } from './content.service'
import { GetContentsResponseDto } from './dto/get-content.dto'
import { GetVaultQueryRequestDto } from './dto/get-vault-query-dto'

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly s3Service: S3Service,
  ) {}

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
    const url = await this.s3Service.preSignUrl(path, req.user.id)
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
