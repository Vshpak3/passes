import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreateListDto } from './dto/create-list.dto'
import { GetListDto } from './dto/get-list.dto'
import { GetListsDto } from './dto/get-lists.dto'
import { ListMembersDto } from './dto/list-members.dto'
import { ListService } from './list.service'

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({ summary: 'Creates List for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateListDto,
    description: 'List was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createListDto: CreateListDto,
  ): Promise<GetListDto> {
    return await this.listService.create(req.user.id, createListDto)
  }

  @ApiOperation({ summary: 'Add ListMembers to a List' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'List Members added',
  })
  @Post('/member/:id')
  async addListMembers(
    @Req() req: RequestWithUser,
    @Param('id') listId: string,
    @Body() addListMembersDto: ListMembersDto,
  ): Promise<void> {
    return this.listService.addListMembers(
      req.user.id,
      listId,
      addListMembersDto,
    )
  }

  @ApiOperation({ summary: 'Remove ListMembers from a List' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'List Members removed',
  })
  @Delete('/member/:id')
  async removeListMembers(
    @Req() req: RequestWithUser,
    @Param('id') listId: string,
    @Body() removeListMembersDto: ListMembersDto,
  ): Promise<void> {
    return this.listService.removeListMembers(
      req.user.id,
      listId,
      removeListMembersDto,
    )
  }

  @ApiOperation({ summary: 'Get list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListDto,
    description: 'List was retrieved',
  })
  @Get(':id')
  async find(
    @Req() req: RequestWithUser,
    @Param('id') listId: string,
    @Query('cursor') cursor: string,
  ): Promise<GetListDto> {
    return await this.listService.getList(req.user.id, listId, cursor)
  }

  @ApiOperation({ summary: 'Get all lists for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListsDto,
    description: 'Lists were retrieved',
  })
  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query('cursor') cursor: string,
  ): Promise<GetListsDto> {
    return await this.listService.getListsForUser(req.user.id, cursor)
  }

  @ApiOperation({ summary: 'Delete list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'List was deleted',
  })
  @Delete(':id')
  async delete(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.listService.deleteList(req.user.id, id)
  }
}
