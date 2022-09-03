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
import { CreatePassRequestDto } from './dto/create-pass.dto'
import { CreatePassHolderRequestDto } from './dto/create-pass-holder.dto'
import { GetPassesResponseDto, GetPassResponseDto } from './dto/get-pass.dto'
import { GetPassHoldersResponseDto } from './dto/get-pass-holder.dto'
import { RenewPassHolderRequestDto } from './dto/renew-pass-holder.dto'
import { UpdatePassRequestDto } from './dto/update-pass.dto'
import { PassService } from './pass.service'

@ApiTags('pass')
@Controller('pass')
export class PassController {
  constructor(private readonly passService: PassService) {}

  @ApiOperation({ summary: 'Creates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassResponseDto,
    description: 'A pass was created',
  })
  @Post()
  async createPass(
    @Req() req: RequestWithUser,
    @Body() createPassDto: CreatePassRequestDto,
  ): Promise<GetPassResponseDto> {
    return this.passService.createPass(req.user.id, createPassDto)
  }

  @ApiOperation({ summary: 'Gets passes created by a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassesResponseDto,
    description: 'A list of passes was retrieved',
  })
  @Get('created/:creatorId')
  async getCreatorPasses(
    @Param('creatorId') creatorId: string,
  ): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(
      await this.passService.findPassesByCreator(creatorId),
    )
  }

  @ApiOperation({ summary: 'Gets passes held by user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassesResponseDto,
    description: 'A list of passes was retrieved',
  })
  @Get('owned')
  async getOwnedPasses(
    @Req() req: RequestWithUser,
    @Query('creatorId') creatorId: string,
  ): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(
      await this.passService.findOwnedPasses(req.user.id, creatorId),
    )
  }

  @ApiOperation({ summary: 'Gets a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassResponseDto,
    description: 'A pass was retrieved',
  })
  @Get(':passId')
  async findPass(@Param('passId') passId: string): Promise<GetPassResponseDto> {
    return this.passService.findPass(passId)
  }

  @ApiOperation({ summary: 'Updates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassResponseDto,
    description: 'A pass was updated',
  })
  @Patch(':passId')
  async updatePass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
    @Body() updatePassDto: UpdatePassRequestDto,
  ): Promise<GetPassResponseDto> {
    return this.passService.updatePass(req.user.id, passId, updatePassDto)
  }

  @ApiOperation({ summary: 'Register create pass payin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterPayinResponseDto,
    description: 'Create pass payin was registered',
  })
  @Post('pay/create')
  async registerBuyPass(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return this.passService.registerBuyPass(
      req.user.id,
      createPassHolderDto.passId,
      createPassHolderDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Get register create pass data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Data for register create pass was returned',
  })
  @Post('pay/data/create')
  async registerBuyPassData(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderRequestDto,
  ): Promise<PayinDataDto> {
    return this.passService.registerBuyPassData(
      req.user.id,
      createPassHolderDto.passId,
    )
  }

  @ApiOperation({ summary: 'Register renew pass payin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterPayinResponseDto,
    description: 'Renew pass payin was registered',
  })
  @Post('pay/renew')
  async registerRenewPass(
    @Req() req: RequestWithUser,
    @Body() renewPassHolderDto: RenewPassHolderRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return this.passService.registerRenewPass(
      req.user.id,
      renewPassHolderDto.passHolderId,
      renewPassHolderDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Get register renew pass data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Data for register renew pass was returned',
  })
  @Post('pay/data/renew')
  async registerRenewPassData(
    @Req() req: RequestWithUser,
    @Body() renewPassHolderDto: RenewPassHolderRequestDto,
  ): Promise<PayinDataDto> {
    return this.passService.registerRenewPassData(
      req.user.id,
      renewPassHolderDto.passHolderId,
    )
  }

  @ApiOperation({ summary: 'Add pass subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'Pass subscription was added',
  })
  @Post('subscription/add/:passHolderId')
  async addPassSubscription(
    @Req() req: RequestWithUser,
    @Param('passHolderId') passHolderId: string,
  ) {
    await this.passService.addPassSubscription(req.user.id, passHolderId)
  }

  @ApiOperation({ summary: 'Pin a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A pass was pinned',
  })
  @Get('pin/:passId')
  async pinPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<boolean> {
    return await this.passService.pinPass(req.user.id, passId)
  }

  @ApiOperation({ summary: 'Unpin a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A pass was unpinned',
  })
  @Get('unpin/:passId')
  async unpinPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<boolean> {
    return await this.passService.unpinPass(req.user.id, passId)
  }

  @ApiOperation({ summary: 'Get a passholders' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPassHoldersResponseDto,
    description: 'A pass was unpinned',
  })
  @Get('passholders/:passId')
  async getPassHolders(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<GetPassHoldersResponseDto> {
    return new GetPassHoldersResponseDto(
      await this.passService.getPassHolders(req.user.id, passId),
    )
  }
}
