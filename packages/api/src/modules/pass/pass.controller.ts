import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.metadata'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import {
  CreatePassRequestDto,
  CreatePassResponseDto,
} from './dto/create-pass.dto'
import { CreatePassHolderRequestDto } from './dto/create-pass-holder.dto'
import {
  GetCreatorPassesRequestDto,
  GetExternalPassesRequestDto,
  GetPassesResponseDto,
} from './dto/get-pass.dto'
import {
  GetPassHoldersRequestDto,
  GetPassHoldersResponseDto,
} from './dto/get-pass-holders.dto'
import {
  GetPassHoldingsRequestDto,
  GetPassHoldingsResponseDto,
} from './dto/get-pass-holdings.dto'
import { MintPassRequestDto, MintPassResponseDto } from './dto/mint-pass.dto'
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
    responseType: CreatePassResponseDto,
    responseDesc: 'A pass was created',
    role: RoleEnum.GENERAL,
  })
  @Post()
  async createPass(
    @Req() req: RequestWithUser,
    @Body() createPassDto: CreatePassRequestDto,
  ): Promise<CreatePassResponseDto> {
    return await this.passService.createPass(req.user.id, createPassDto)
  }

  @ApiEndpoint({
    summary: 'Mints a pass',
    responseStatus: HttpStatus.OK,
    responseType: MintPassResponseDto,
    responseDesc: 'A pass was minted',
    role: RoleEnum.GENERAL,
  })
  @Post('mint')
  async mintPass(
    @Req() req: RequestWithUser,
    @Body() mintPassDto: MintPassRequestDto,
  ): Promise<MintPassResponseDto> {
    return await this.passService.mintPass(req.user.id, mintPassDto)
  }

  @ApiEndpoint({
    summary: 'Gets passes created by a creator',
    responseStatus: HttpStatus.OK,
    responseType: GetPassesResponseDto,
    responseDesc: 'A list of creator passes was retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Post('created')
  async getCreatorPasses(
    @Body() getPassesRequestDto: GetCreatorPassesRequestDto,
  ): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(
      await this.passService.findPassesByCreator(getPassesRequestDto),
    )
  }

  @ApiEndpoint({
    summary: 'Gets external passes',
    responseStatus: HttpStatus.OK,
    responseType: GetPassesResponseDto,
    responseDesc: 'A list of external passes was retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Post('external')
  async getExternalPasses(
    @Body() getPassesRequestDto: GetExternalPassesRequestDto,
  ): Promise<GetPassesResponseDto> {
    return new GetPassesResponseDto(
      await this.passService.getExternalPasses(getPassesRequestDto),
    )
  }

  @ApiEndpoint({
    summary: 'Gets passes held by user',
    responseStatus: HttpStatus.OK,
    responseType: GetPassHoldingsResponseDto,
    responseDesc: 'A list of pass holdings was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('passholdings')
  async getPassHoldings(
    @Req() req: RequestWithUser,
    @Body() getPassHoldingsRequestDto: GetPassHoldingsRequestDto,
  ): Promise<GetPassHoldingsResponseDto> {
    return new GetPassHoldingsResponseDto(
      await this.passService.findPassHoldings(
        req.user.id,
        getPassHoldingsRequestDto,
      ),
      getPassHoldingsRequestDto.orderType,
    )
  }

  @ApiEndpoint({
    summary: 'Updates a pass',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A pass was updated',
    role: RoleEnum.GENERAL,
  })
  @Patch('pass-info/:passId')
  async updatePass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
    @Body() updatePassDto: UpdatePassRequestDto,
  ): Promise<void> {
    await this.passService.updatePass(req.user.id, passId, updatePassDto)
  }

  @ApiEndpoint({
    summary: 'Register create pass payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Create pass payin was registered',
    role: RoleEnum.GENERAL,
  })
  @Post('buy/create')
  async registerBuyPass(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.passService.registerBuyPass(
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
    role: RoleEnum.GENERAL,
  })
  @Post('buy/create/data')
  async registerBuyPassData(
    @Req() req: RequestWithUser,
    @Body() createPassHolderDto: CreatePassHolderRequestDto,
  ): Promise<PayinDataDto> {
    return await this.passService.registerBuyPassData(
      req.user.id,
      createPassHolderDto.passId,
    )
  }

  @ApiEndpoint({
    summary: 'Register renew pass payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Renew pass payin was registered',
    role: RoleEnum.GENERAL,
  })
  @Post('buy/renew')
  async registerRenewPass(
    @Req() req: RequestWithUser,
    @Body() renewPassHolderDto: RenewPassHolderRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.passService.registerRenewPass(
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
    role: RoleEnum.GENERAL,
  })
  @Post('buy/renew/data')
  async registerRenewPassData(
    @Req() req: RequestWithUser,
    @Body() renewPassHolderDto: RenewPassHolderRequestDto,
  ): Promise<PayinDataDto> {
    return await this.passService.registerRenewPassData(
      req.user.id,
      renewPassHolderDto.passHolderId,
    )
  }

  @ApiEndpoint({
    summary: 'Add pass subscription',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'Pass subscription was added',
    role: RoleEnum.GENERAL,
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
    role: RoleEnum.GENERAL,
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
    role: RoleEnum.GENERAL,
  })
  @Get('unpin/:passId')
  async unpinPass(
    @Req() req: RequestWithUser,
    @Param('passId') passId: string,
  ): Promise<boolean> {
    return await this.passService.unpinPass(req.user.id, passId)
  }

  @ApiEndpoint({
    summary: 'Get passholders of a pass or user',
    responseStatus: HttpStatus.OK,
    responseType: GetPassHoldersResponseDto,
    responseDesc: 'A pass was unpinned',
    role: RoleEnum.GENERAL,
  })
  @Get('passholders')
  async getPassHolders(
    @Req() req: RequestWithUser,
    @Body() getPassHoldersRequest: GetPassHoldersRequestDto,
  ): Promise<GetPassHoldersResponseDto> {
    return new GetPassHoldersResponseDto(
      await this.passService.getPassHolders(req.user.id, getPassHoldersRequest),
      getPassHoldersRequest.orderType,
    )
  }
}
