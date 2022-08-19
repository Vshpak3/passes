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
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
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

  @ApiOperation({ summary: 'Register payin for pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterPayinResponseDto,
    description: 'Pass payin was registered',
  })
  @Post('register')
  async register(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderDto,
  ): Promise<RegisterPayinResponseDto> {
    return this.passService.registerPass(
      req.user.id,
      createPassHolderDto.passId,
      createPassHolderDto.temporary,
      createPassHolderDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Get register pass data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Data for registering a pass was returned',
  })
  @Post('register/data')
  async registerData(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderDto,
  ): Promise<PayinDataDto> {
    return this.passService.registerPassData(
      req.user.id,
      createPassHolderDto.passId,
    )
  }
}
