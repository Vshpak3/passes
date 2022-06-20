import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('subscription')
@Controller('api/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'TODO' })
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Get()
  findAll() {
    return this.subscriptionService.findAll()
  }

  @ApiOperation({ summary: 'TODO' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id)
  }

  @ApiOperation({ summary: 'TODO' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id)
  }
}
