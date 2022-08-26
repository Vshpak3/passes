import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CollectionService } from './collection.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { GetCollectionResponseDto } from './dto/get-collection.dto'
import { UpdateCollectionRequestDto } from './dto/update-collection.dto'

@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Creates a collection' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCollectionResponseDto,
    description: 'A collection was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createPassDto: CreateCollectionDto,
  ): Promise<CreateCollectionDto> {
    return this.collectionService.create(req.user.id, createPassDto)
  }

  @ApiOperation({ summary: 'Gets a collection by creator username' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCollectionResponseDto,
    description: 'A collection was retrieved',
  })
  @Get('/creator/:username')
  async findByCreatorUsername(
    @Param('username') username: string,
  ): Promise<GetCollectionResponseDto> {
    return this.collectionService.findOneByCreatorUsername(username)
  }

  @ApiOperation({ summary: 'Gets a collection' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCollectionResponseDto,
    description: 'A collection was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetCollectionResponseDto> {
    return this.collectionService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a collection' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCollectionResponseDto,
    description: 'A collection was updated',
  })
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePassDto: UpdateCollectionRequestDto,
  ) {
    return this.collectionService.update(req.user.id, id, updatePassDto)
  }
}
