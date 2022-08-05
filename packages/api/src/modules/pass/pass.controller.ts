import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { CreatePassDto } from './dto/create-pass.dto'
import { CreatePassHolderDto } from './dto/create-pass-holder.dto'
import { GetPassDto } from './dto/get-pass.dto'
import { GetPassOwnershipDto } from './dto/get-pass-ownership.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassService } from './pass.service'

@ApiTags('pass')
@Controller('pass')
export class PassController {
  constructor(private readonly passService: PassService) {}

  @ApiOperation({ summary: 'Creates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassDto,
    description: 'A pass was created',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createPassDto: CreatePassDto,
  ): Promise<GetPassDto> {
    return this.passService.create(req.user.id, createPassDto)
  }

  @ApiOperation({ summary: 'Creates a pass holder' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassOwnershipDto,
    description: 'A pass holder was created',
  })
  @Post('holder')
  @UseGuards(JwtAuthGuard)
  async addHolder(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderDto,
  ): Promise<GetPassOwnershipDto> {
    return this.passService.addHolder(
      req.user.id,
      createPassHolderDto.passId,
      createPassHolderDto.temporary,
    )
  }

  @ApiOperation({ summary: 'Gets a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassDto,
    description: 'A pass was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetPassDto> {
    return this.passService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassDto,
    description: 'A pass was updated',
  })
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePassDto: UpdatePassDto,
  ) {
    return this.passService.update(req.user.id, id, updatePassDto)
  }
}
