import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { SubscriptionService } from './subscription.service'

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Creates a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateSubscriptionDto,
    description: 'A subscription was created',
  })
  @Post()
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<CreateSubscriptionDto> {
    return this.subscriptionService.create(createSubscriptionDto)
  }

  @ApiOperation({ summary: 'Gets a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateSubscriptionDto,
    description: 'A subscription was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateSubscriptionDto> {
    return this.subscriptionService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A subscription was updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto)
  }

  @ApiOperation({ summary: 'Deletes a subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A subscription was deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id)
  }
}
