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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { EthService } from '../eth/eth.service'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletDto,
  CreateWalletDto,
} from './dto/create-wallet.dto'
import { WalletDto } from './dto/wallet.dto'
import { WalletResponseDto } from './dto/wallet-response.dto'
import { Chain } from './enum/chain.enum'
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthService,
  ) {}

  @ApiOperation({ summary: 'Get user custodial wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WalletDto,
    description: 'User custodial wallet returned',
  })
  @Get('/custodial')
  async getUserCustodialWallet(
    @Req() req: RequestWithUser,
  ): Promise<WalletDto> {
    return new WalletDto(
      await this.walletService.getUserCustodialWallet(req.user.id),
    )
  }

  @ApiOperation({ summary: 'Creates authenticated wallet for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateWalletDto,
    description: 'Wallet was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletService.create(req.user.id, createWalletDto)
    if (wallet.chain == Chain.ETH) {
      return this.ethService.refreshNftsForWallet(req.user.id, wallet.id)
    }
    return new WalletResponseDto(wallet)
  }

  @ApiOperation({ summary: 'Removes authenticated wallet for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet was deleted',
  })
  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.walletService.remove(req.user.id, id)
  }

  @ApiOperation({ summary: 'Creates wallet auth message to sign' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthWalletResponseDto,
    description: 'Wallet Auth Message created',
  })
  @Post('auth')
  async auth(
    @Req() req: RequestWithUser,
    @Body() authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    return this.walletService.auth(req.user.id, authWalletRequestDto)
  }

  @ApiOperation({ summary: 'Get wallets for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [WalletDto],
    description: 'Wallets were retrieved',
  })
  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Array<WalletDto>> {
    const wallets = await this.walletService.getWalletsForUser(req.user.id)
    return wallets.map((wallet) => new WalletDto(wallet))
  }

  @ApiOperation({ summary: 'Refresh tokens owned by a wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WalletResponseDto,
    description: 'Wallet tokens were updated',
  })
  @Post('/refresh/:id')
  async refresh(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<WalletResponseDto> {
    return this.ethService.refreshNftsForWallet(req.user.id, id)
  }

  @ApiOperation({ summary: 'Creates unchecked wallet for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateWalletDto,
    description: 'Unchecked wallet was created',
  })
  @Post('/unauthenticated')
  async createUnauthenticated(
    @Req() req: RequestWithUser,
    @Body() createUnauthenticatedWalletDto: CreateUnauthenticatedWalletDto,
  ): Promise<void> {
    await this.walletService.createUnauthenticated(
      req.user.id,
      createUnauthenticatedWalletDto,
    )
  }
}
