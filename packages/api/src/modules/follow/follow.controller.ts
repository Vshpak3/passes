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
import { CreateFollowingDto } from './dto/create-following.dto'
import { GetFollowingDto } from './dto/get-following.dto'
import { FollowService } from './follow.service'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: 'Creates a follow' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateFollowingDto,
    description: 'A follow was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createFollowingDto: CreateFollowingDto,
  ): Promise<GetFollowingDto> {
    return this.followService.create(req.user.id, createFollowingDto)
  }

  @ApiOperation({ summary: 'Gets a following' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateFollowingDto,
    description: 'A following was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetFollowingDto> {
    return this.followService.findOne(id)
  }

  @ApiOperation({ summary: 'Deletes a following' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A following was deleted',
  })
  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<GetFollowingDto> {
    return this.followService.remove(req.user.id, id)
  }
}
