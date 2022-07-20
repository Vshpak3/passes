import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { CreatorSettingsService } from './creator-settings.service'
import { CreateCreatorSettingsDto } from './dto/create-creator-settings.dto'

@ApiTags('creator-settings')
@Controller('creator-settings')
export class CreatorSettingsController {
  constructor(
    private readonly creatorSettingsService: CreatorSettingsService,
  ) {}

  @ApiOperation({ summary: 'Gets creator settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCreatorSettingsDto,
    description: 'Creator Settings was retrieved',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@Req() req: RequestWithUser): Promise<CreateCreatorSettingsDto> {
    return await this.creatorSettingsService.findByUser(req.user.id)
  }

  @ApiOperation({ summary: 'Updates creator settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCreatorSettingsDto,
    description: 'Creator Settings was updated',
  })
  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: RequestWithUser,
    @Body() createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreateCreatorSettingsDto> {
    return await this.creatorSettingsService.update(
      req.user.id,
      createCreatorSettingsDto,
    )
  }

  @ApiOperation({ summary: 'Creates creator settings' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCreatorSettingsDto,
    description: 'Creator Settings was created',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createCreatorSettingsDto: CreateCreatorSettingsDto,
  ): Promise<CreateCreatorSettingsDto> {
    return await this.creatorSettingsService.create(
      req.user.id,
      createCreatorSettingsDto,
    )
  }
}
