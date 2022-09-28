import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.metadata'
import { EthService } from '../eth/eth.service'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletRequestDto,
  CreateWalletRequestDto,
} from './dto/create-wallet.dto'
import { GetCustodialWalletRequestDto } from './dto/get-custodial-wallet.dto'
import { GetDefaultWalletRequestDto } from './dto/get-default-wallet.dto'
import {
  GetWalletResponseDto,
  GetWalletsResponseDto,
} from './dto/get-wallet.dto'
import { SetDefaultWalletRequestDto } from './dto/set-default-wallet.dto'
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthService,
  ) {}

  @ApiEndpoint({
    summary: 'Get user custodial wallet',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletResponseDto,
    responseDesc: 'User custodial wallet retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('custodial')
  async getUserCustodialWallet(
    @Req() req: RequestWithUser,
    @Body() getCustodialWalletRequestDto: GetCustodialWalletRequestDto,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getUserCustodialWallet(
      req.user.id,
      getCustodialWalletRequestDto.chain,
    )
  }

  @ApiEndpoint({
    summary: 'Get default wallet',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletResponseDto,
    responseDesc: 'Default wallet retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('find-default')
  async getDefaultWallet(
    @Req() req: RequestWithUser,
    @Body() getDefaultWalletRequestDto: GetDefaultWalletRequestDto,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getDefaultWallet(
      req.user.id,
      getDefaultWalletRequestDto.chain,
    )
  }

  @ApiEndpoint({
    summary: 'Set default wallet',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Default wallet set',
    role: RoleEnum.GENERAL,
  })
  @Post('set-default')
  async setDefaultWallet(
    @Req() req: RequestWithUser,
    @Body() setDefaultWalletRequestDto: SetDefaultWalletRequestDto,
  ): Promise<void> {
    await this.walletService.setDefaultWallet(
      req.user.id,
      setDefaultWalletRequestDto.walletId,
      setDefaultWalletRequestDto.chain,
    )
  }

  @ApiEndpoint({
    summary: 'Creates authenticated wallet for a user',
    responseStatus: HttpStatus.CREATED,
    responseType: Boolean,
    responseDesc: 'Wallet was created',
    role: RoleEnum.GENERAL,
  })
  @Post('authenticated')
  async createWallet(
    @Req() req: RequestWithUser,
    @Body() createWalletDto: CreateWalletRequestDto,
  ): Promise<boolean> {
    return await this.walletService.createWallet(req.user.id, createWalletDto)
  }

  @ApiEndpoint({
    summary: 'Removes wallet for a user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Wallet was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete('ownership/:walletId')
  async removeWallet(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<boolean> {
    return await this.walletService.removeWallet(req.user.id, walletId)
  }

  @ApiEndpoint({
    summary: 'Creates wallet auth message to sign',
    responseStatus: HttpStatus.CREATED,
    responseType: AuthWalletResponseDto,
    responseDesc: 'Wallet Auth Message created',
    role: RoleEnum.GENERAL,
  })
  @Post('auth')
  async authMessage(
    @Req() req: RequestWithUser,
    @Body() authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    return await this.walletService.authMessage(
      req.user.id,
      authWalletRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get wallets for user',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletsResponseDto,
    responseDesc: 'Wallets were retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('wallets')
  async getWallets(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletsResponseDto> {
    return new GetWalletsResponseDto(
      await this.walletService.getWalletsForUser(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Creates unchecked wallet for a user',
    responseStatus: HttpStatus.CREATED,
    responseType: CreateWalletRequestDto,
    responseDesc: 'Unchecked wallet was created',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('unauthenticated')
  async createUnauthenticatedWallet(
    @Req() req: RequestWithUser,
    @Body()
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletRequestDto,
  ): Promise<void> {
    await this.walletService.createUnauthenticatedWallet(
      req.user.id,
      createUnauthenticatedWalletDto,
    )
  }
}
