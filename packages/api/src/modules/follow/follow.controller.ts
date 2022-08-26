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
import { CreateFollowingRequestDto } from './dto/create-following.dto'
import { GetFansResponseDto } from './dto/get-fan.dto'
import { GetFollowingResponseDto } from './dto/get-following.dto'
import { SearchFanRequestDto } from './dto/search-fan.dto'
import { FollowService } from './follow.service'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: 'Creates a follow' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateFollowingRequestDto,
    description: 'A follow was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createFollowingDto: CreateFollowingRequestDto,
  ): Promise<GetFollowingResponseDto> {
    return this.followService.create(req.user.id, createFollowingDto)
  }

  @ApiOperation({ summary: 'Gets a following' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateFollowingRequestDto,
    description: 'A following was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetFollowingResponseDto> {
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
  ): Promise<GetFollowingResponseDto> {
    return this.followService.remove(req.user.id, id)
  }

  @ApiOperation({ summary: 'Search for followers by query' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetFansResponseDto,
    description: 'A list of followers was returned',
  })
  @Post('/search')
  async searchFans(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFanRequestDto,
  ): Promise<GetFansResponseDto> {
    return new GetFansResponseDto(
      await this.followService.searchByQuery(req.user.id, searchFanDto),
    )
  }
}
