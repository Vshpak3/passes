import {
  Body,
  Controller,
  Get,
  Head,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RealIP } from 'nestjs-real-ip'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { CardEntityDto } from './dto/circle/card.entity.dto'
import { CircleNotificationDto } from './dto/circle/circle-notification.dto'
import { CreateAddressDto } from './dto/circle/create-address.dto'
import { CreateBankDto } from './dto/circle/create-bank.dto'
import { CreateCardAndExtraDto } from './dto/circle/create-card.dto'
import { CreateCardPaymentDto } from './dto/circle/create-card-payment.dto'
import { EncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { StatusDto } from './dto/circle/status.dto'
import { DefaultProviderDto } from './dto/default-provider.dto'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
  -------------------------------------------------------------------------------
  SECTION: CIRCLE
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Get circle encryption key' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EncryptionKeyDto,
    description: 'Encryption key was returned',
  })
  @Get('key')
  async getCircleEncryptionKey(): Promise<EncryptionKeyDto> {
    return this.paymentService.getCircleEncryptionKey()
  }

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StatusDto,
    description: 'A card was created',
  })
  @Post('card/create')
  @UseGuards(JwtAuthGuard)
  async createCircleCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CreateCardAndExtraDto,
  ): Promise<StatusDto> {
    return this.paymentService.createCircleCard(
      ip,
      req.user.id,
      createCardAndExtraDto.createCardDto,
      createCardAndExtraDto.fourDigits,
    )
  }

  @ApiOperation({ summary: 'Check card status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'Return status of card',
  })
  @Get('card/status/:id')
  @UseGuards(JwtAuthGuard)
  async checkCircleCardStatus(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkCircleCardStatus(id)
  }

  @ApiOperation({ summary: 'Deletes a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A card was deleted',
  })
  @Post('card/delete/:circleCardId')
  @UseGuards(JwtAuthGuard)
  async deleteCircleCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<boolean> {
    return await this.paymentService.deleteCircleCard(req.user.id, circleCardId)
  }

  @ApiOperation({ summary: 'Get cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CardEntityDto],
    description: 'Cards were returned',
  })
  @Get('cards')
  @UseGuards(JwtAuthGuard)
  async getCircleCards(
    @Req() req: RequestWithUser,
  ): Promise<Array<CardEntityDto>> {
    return (await this.paymentService.getCircleCards(req.user.id)).map(
      (entity) => new CardEntityDto(entity),
    )
  }

  @ApiOperation({ summary: 'Make card payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'A card payment was created',
  })
  @Post('pay')
  @UseGuards(JwtAuthGuard)
  async update(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardPaymentDto: CreateCardPaymentDto,
  ): Promise<StatusDto> {
    return this.paymentService.makeCircleCardPayment(
      ip,
      req.user.id,
      createCardPaymentDto,
    )
  }

  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'Return status of payment',
  })
  @Get('status/:id')
  @UseGuards(JwtAuthGuard)
  async checkCirclePaymentStatus(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkCirclePaymentStatus(id)
  }

  @ApiOperation({ summary: 'Get crypto address' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'Return depositable address for crypto payment',
  })
  @Get('address')
  @UseGuards(JwtAuthGuard)
  async getCircleAddress(
    @Req() req: RequestWithUser,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<string> {
    return this.paymentService.getCircleAddress(req.user.id, createAddressDto)
  }

  @ApiOperation({ summary: 'Create wire bank account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StatusDto,
    description: 'A wire bank account was created',
  })
  @Post('bank/wire/create')
  @UseGuards(JwtAuthGuard)
  async createCircleWireBankAccount(
    @Req() req: RequestWithUser,
    @Body() createBankDto: CreateBankDto,
  ): Promise<StatusDto> {
    return this.paymentService.createCircleWireBankAccount(
      req.user.id,
      createBankDto,
    )
  }

  @ApiOperation({ summary: 'Check wire bank status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'Return status of bank',
  })
  @Get('bank/wire/status/:id')
  @UseGuards(JwtAuthGuard)
  async checkWireBankStatus(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkCircleWireBankStatus(id)
  }

  // endpoint only called by circle to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  // TODO: handle payout notifications (and card/bank if available)
  @ApiOperation({ summary: 'Circle notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Recieve updates from circle',
  })
  @Post('circle/notification')
  async recieveNotifications(
    @Body()
    circleNotificationDto: CircleNotificationDto,
  ) {
    if (circleNotificationDto.clientId === undefined) {
      return true
    }
    return this.paymentService.processCircleUpdate(circleNotificationDto)
  }

  // endpoint only called by circle to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  // TODO: handle payout notifications (and card/bank if available)
  @ApiOperation({ summary: 'Circle notifications register' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Register updates from circle',
  })
  @Head('circle/notification')
  async registerNotifications(): Promise<boolean> {
    return true
  }

  /*
  -------------------------------------------------------------------------------
  SECTION: GENERIC
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Set default payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A payin method was set as default',
  })
  @Post('payin/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultPayin(
    @Req() req: RequestWithUser,
    @Body() defaultProviderDto: DefaultProviderDto,
  ): Promise<boolean> {
    return await this.paymentService.setDefaultPayin(
      req.user.id,
      defaultProviderDto.provider,
      defaultProviderDto.providerAccountType,
      defaultProviderDto.providerAccountId,
    )
  }

  @ApiOperation({ summary: 'Get default payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DefaultProviderDto,
    description: 'Return default payin method',
  })
  @Get('payin/default')
  @UseGuards(JwtAuthGuard)
  async getDefaultPayin(
    @Req() req: RequestWithUser,
  ): Promise<DefaultProviderDto> {
    return await this.paymentService.getDefaultPayin(req.user.id)
  }
}
