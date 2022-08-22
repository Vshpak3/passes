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
import { GetSignedUrlDto } from '../s3/dto/get-signed-url.dto'
import { S3Service } from '../s3/s3.service'
import { ContentService } from './content.service'
import { GetContentDto } from './dto/get-content.dto'
import { GetVaultQueryDto } from './dto/get-vault-query-dto'

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
    type: GetSignedUrlDto,
    description: 'Url was signed',
  })
  @UseGuards(JwtAuthGuard)
  @Get('sign/:path(*)')
  async preSignUrl(
    @Req() req: RequestWithUser,
    @Param('path') path: string,
  ): Promise<GetSignedUrlDto> {
    // TODO: validate path
    const url = await this.s3Service.preSignUrl(path, req.user.id)
    return { url }
  }

  @ApiOperation({
    summary: 'Gets all content associated with the current authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetContentDto],
    description: 'Creator vault was retrieved',
  })
  @Get('vault')
  async getVaultContent(
    @Req() req: RequestWithUser,
    @Query() { category, type }: GetVaultQueryDto,
  ): Promise<GetContentDto[]> {
    // TODO: add pagination
    return this.contentService.getVault(req.user.id, category, type)
  }
}
