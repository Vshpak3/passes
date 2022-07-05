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

import { RequestWithUser } from '../../types'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { GetSubscriptionDto } from './dto/get-subscription.dto'
import { SubscriptionService } from './subscription.service'

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Creates a subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateSubscriptionDto,
    description: 'A subscription was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<GetSubscriptionDto> {
    return this.subscriptionService.create(req.user.id, createSubscriptionDto)
  }

  @ApiOperation({ summary: 'Gets a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateSubscriptionDto,
    description: 'A subscription was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetSubscriptionDto> {
    return this.subscriptionService.findOne(id)
  }

  // TODO: Do we need this? Can only disable subscriptions, same as DELETE endpoint
  // @ApiOperation({ summary: 'Updates a subscription' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: undefined,
  //   description: 'A subscription was updated',
  // })
  // @Patch(':id')
  // async update(
  //   @Req() req: RequestWithUser,
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ): Promise<GetSubscriptionDto> {
  //   return this.subscriptionService.update(
  //     req.user.id,
  //     id,
  //     updateSubscriptionDto,
  //   )
  // }

  @ApiOperation({ summary: 'Deletes a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A subscription was deleted',
  })
  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<GetSubscriptionDto> {
    return this.subscriptionService.remove(req.user.id, id)
  }
}
