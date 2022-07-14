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

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import {
  CircleNotificationDto,
  CirclePaymentNotificationDto,
} from './dto/circle-notification.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { CreateBankDto } from './dto/create-bank.dto'
import { CreateCardAndExtraDto } from './dto/create-card.dto'
import { CreateCardPaymentDto } from './dto/create-card-payment.dto'
import { StatusDto } from './dto/status.dto'
import { CardEntity } from './entities/card.entity'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get encryption key' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'encryption key was returned',
  })
  @Get('key')
  async getEncryptionKey(): Promise<string> {
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
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CreateCardAndExtraDto,
  ): Promise<StatusDto> {
    return this.paymentService.createCard(
      req.user.id,
      createCardAndExtraDto.createCardDto,
      createCardAndExtraDto.fourDigits,
    )
  }

  @ApiOperation({ summary: 'Check card status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'return status of card',
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
    type: CardEntity,
    description: 'A default card was returned',
  })
  @UseGuards(JwtAuthGuard)
  @Get('default')
  async getDefault(@Req() req: RequestWithUser): Promise<CardEntity | null> {
    return this.paymentService.getDefault(req.user.id)
  }

  @ApiOperation({ summary: 'Set default card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A card was set as default',
  })
  @Post('card/default/:circleCardId')
  @UseGuards(JwtAuthGuard)
  async setDefault(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<boolean> {
    return this.paymentService.setDefault(req.user.id, circleCardId)
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
    type: [CardEntity],
    description: 'Cards were returned',
  })
  @Get('cards')
  @UseGuards(JwtAuthGuard)
  async getCards(@Req() req: RequestWithUser): Promise<Array<CardEntity>> {
    return this.paymentService.getCards(req.user.id)
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
    @Req() req: RequestWithUser,
    @Body() createCardPaymentDto: CreateCardPaymentDto,
  ): Promise<StatusDto> {
    return this.paymentService.makeCardPayment(
      req.user.id,
      createCardPaymentDto,
    )
  }

  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusDto,
    description: 'return status of payment',
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
    description: 'return depositable address for crypto payment',
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
    description: 'return status of bank',
  })
  @Get('bank/wire/status/:id')
  @UseGuards(JwtAuthGuard)
  async checkWireBankStatus(@Param('id') id: string): Promise<StatusDto> {
    return this.paymentService.checkWireBankStatus(id)
  }

  // endpoint only called by circle can call to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  // TODO: handle payout notifications (and card/bank if available)
  @ApiOperation({ summary: 'Circle notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'recieve updates from circle',
  })
  @Post('circle/notification')
  @Head('circle/notification')
  async recieveNotifications(
    @Body() circleNotificationDto: CircleNotificationDto,
  ) {
    if (circleNotificationDto.notificationType == 'payments') {
      const circlePaymentNotificationDto =
        circleNotificationDto as CirclePaymentNotificationDto
      return this.paymentService.procesPaymentUpdate(
        circlePaymentNotificationDto.payment,
      )
    }
  }
}
