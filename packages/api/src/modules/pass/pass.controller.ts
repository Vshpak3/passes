import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { GetPassesDto } from './dto/get-passes-dto'
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

  @ApiOperation({ summary: 'Gets passes created by a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassesDto,
    description: 'A list of passes was retrieved',
  })
  @UseGuards(JwtAuthGuard)
  @Get('created/:creatorId')
  async getCreatorPasses(
    @Param('creatorId') creatorId: string,
  ): Promise<GetPassesDto> {
    return new GetPassesDto(
      await this.passService.findPassesByCreator(creatorId),
    )
  }

  @ApiOperation({ summary: 'Gets passes held by user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassesDto,
    description: 'A list of passes was retrieved',
  })
  @UseGuards(JwtAuthGuard)
  @Get('owned')
  async getOwnedPasses(
    @Req() req: RequestWithUser,
    @Query('creatorId') creatorId: string,
  ): Promise<GetPassesDto> {
    const passes = await this.passService.findOwnedPasses(
      req.user.id,
      creatorId,
    )
    return new GetPassesDto(passes)
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
