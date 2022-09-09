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
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
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

  @ApiEndpoint({
    summary: 'Creates a pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A pass was created',
  })
  @Post()
  async createPass(
    @Req() req: RequestWithUser,
    @Body() createPassDto: CreatePassRequestDto,
  ): Promise<boolean> {
    return this.passService.createPass(req.user.id, createPassDto)
  }

  @ApiEndpoint({
    summary: 'Gets passes created by a creator',
    responseStatus: HttpStatus.OK,
    responseType: GetPassesResponseDto,
    responseDesc: 'A list of creator passes was retrieved',
    allowUnauthorizedRequest: true,
  })
  @Get('created/:creatorId')
  async getCreatorPasses(
    @Param('creatorId') creatorId: string,
  ): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(
      await this.passService.findPassesByCreator(creatorId),
    )
  }

  @ApiEndpoint({
    summary: 'Gets external passes',
    responseStatus: HttpStatus.OK,
    responseType: GetPassesResponseDto,
    responseDesc: 'A list of external passes was retrieved',
    allowUnauthorizedRequest: true,
  })
  @Get('external')
  async getExternalPasses(): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(await this.passService.getExternalPasses())
  }

  @ApiEndpoint({
    summary: 'Gets passes held by user',
    responseStatus: HttpStatus.OK,
    responseType: GetPassHoldersResponseDto,
    responseDesc: 'A list of pass holdings was retrieved',
  })
  @Get('passholdings')
  async getPassHoldings(
    @Req() req: RequestWithUser,
    @Query('creatorId') creatorId: string,
  ): Promise<GetPassHoldersResponseDto> {
    return new GetPassHoldersResponseDto(
      await this.passService.findPassHoldings(req.user.id, creatorId),
    )
  }

  @ApiEndpoint({
    summary: 'Gets a pass',
    responseStatus: HttpStatus.OK,
    responseType: GetPassResponseDto,
    responseDesc: 'A pass was retrieved',
  })
  @Get(':passId')
  async findPass(@Param('passId') passId: string): Promise<GetPassResponseDto> {
    return this.passService.findPass(passId)
  }

  @ApiEndpoint({
    summary: 'Updates a pass',
    responseStatus: HttpStatus.OK,
    responseType: GetPassResponseDto,
    responseDesc: 'A pass was updated',
  })
  @Patch(':passId')
  async updatePass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
    @Body() updatePassDto: UpdatePassRequestDto,
  ): Promise<GetPassResponseDto> {
    return this.passService.updatePass(req.user.id, passId, updatePassDto)
  }

  @ApiEndpoint({
    summary: 'Register create pass payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Create pass payin was registered',
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

  @ApiEndpoint({
    summary: 'Get register create pass data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Data for register create pass was retrieved',
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

  @ApiEndpoint({
    summary: 'Register renew pass payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Renew pass payin was registered',
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

  @ApiEndpoint({
    summary: 'Get register renew pass data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Data for register renew pass was retrieved',
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

  @ApiEndpoint({
    summary: 'Add pass subscription',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Pass subscription was added',
  })
  @Post('subscription/add/:passHolderId')
  async addPassSubscription(
    @Req() req: RequestWithUser,
    @Param('passHolderId') passHolderId: string,
  ) {
    await this.passService.addPassSubscription(req.user.id, passHolderId)
  }

  @ApiEndpoint({
    summary: 'Pin a pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A pass was pinned',
  })
  @Get('pin/:passId')
  async pinPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<boolean> {
    return await this.passService.pinPass(req.user.id, passId)
  }

  @ApiEndpoint({
    summary: 'Unpin a pass',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A pass was unpinned',
  })
  @Get('unpin/:passId')
  async unpinPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<boolean> {
    return await this.passService.unpinPass(req.user.id, passId)
  }

  @ApiEndpoint({
    summary: 'Get a passholders',
    responseStatus: HttpStatus.OK,
    responseType: GetPassHoldersResponseDto,
    responseDesc: 'A pass was unpinned',
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
