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
import { CircleCardEntity } from './entities/circle-card.entity'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get circle encryption key' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EncryptionKeyDto,
    description: 'Encryption key was returned',
  })
  @Get('key')
  async getEncryptionKey(): Promise<EncryptionKeyDto> {
    return this.paymentService.getEncryptionKey()
  }

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StatusDto,
    description: 'A card was created',
  })
  @Post('card/create')
  @UseGuards(JwtAuthGuard)
  async createCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CreateCardAndExtraDto,
  ): Promise<StatusDto> {
    return this.paymentService.createCard(
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
  async checkCardStatus(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkCardStatus(id)
  }

  //deprecated
  // @ApiOperation({ summary: 'Updates a card' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: Number,
  //   description: 'A card was updated',
  // })
  // @Post('update/:id')
  // @UseGuards(JwtAuthGuard)
  // async updateCard(
  //   @Req() req: RequestWithUser,
  //   @Param('id') id: string,
  //   @Body() updateCardDto: UpdateCardDto,
  // ): Promise<number> {
  //   return this.paymentService.updateCard(id, updateCardDto)
  // }

  @ApiOperation({ summary: 'Get default card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CardEntityDto,
    description: 'A default card was returned',
  })
  @UseGuards(JwtAuthGuard)
  @Get('default')
  async getDefaultCard(@Req() req: RequestWithUser): Promise<CardEntityDto> {
    const entity = await this.paymentService.getDefaultCard(req.user.id)
    if (entity == null) return new CardEntityDto()
    return new CardEntityDto(entity as CircleCardEntity)
  }

  @ApiOperation({ summary: 'Set default card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A card was set as default',
  })
  @Post('card/default/:circleCardId')
  @UseGuards(JwtAuthGuard)
  async setDefaultCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<boolean> {
    return this.paymentService.setDefaultCard(req.user.id, circleCardId)
  }

  @ApiOperation({ summary: 'Deletes a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A card was deleted',
  })
  @Post('card/delete/:circleCardId')
  @UseGuards(JwtAuthGuard)
  async deleteCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<boolean> {
    return this.paymentService.deleteCard(req.user.id, circleCardId)
  }

  @ApiOperation({ summary: 'Get cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CardEntityDto],
    description: 'Cards were returned',
  })
  @Get('cards')
  @UseGuards(JwtAuthGuard)
  async getCards(@Req() req: RequestWithUser): Promise<Array<CardEntityDto>> {
    return (await this.paymentService.getCards(req.user.id)).map(
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
    return this.paymentService.makeCardPayment(
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
  async remove(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkPaymentStatus(id)
  }

  @ApiOperation({ summary: 'Get crypto address' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'Return depositable address for crypto payment',
  })
  @Get('address')
  @UseGuards(JwtAuthGuard)
  async getAddress(
    @Req() req: RequestWithUser,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<string> {
    return this.paymentService.getAddress(req.user.id, createAddressDto)
  }

  @ApiOperation({ summary: 'Create wire bank account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StatusDto,
    description: 'A wire bank account was created',
  })
  @Post('bank/wire/create')
  @UseGuards(JwtAuthGuard)
  async createWireBankAccount(
    @Req() req: RequestWithUser,
    @Body() createBankDto: CreateBankDto,
  ): Promise<StatusDto> {
    return this.paymentService.createWireBankAccount(req.user.id, createBankDto)
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
    return this.paymentService.checkWireBankStatus(id)
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
}
