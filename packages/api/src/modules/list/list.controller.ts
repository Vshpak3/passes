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
import { AddListMembersRequestDto } from './dto/add-list-members.dto'
import { CreateListRequestDto } from './dto/create-list.dto'
import { GetListResponseDto } from './dto/get-list.dto'
import {
  GetListMembersRequestto,
  GetListMembersResponseDto,
} from './dto/get-list-members.dto'
import { GetListsResponseDto } from './dto/get-lists.dto'
import { RemoveListMembersRequestDto } from './dto/remove-list-members.dto'
import { ListService } from './list.service'

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({ summary: 'Creates List for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'List was created',
  })
  @Post()
  async createList(
    @Req() req: RequestWithUser,
    @Body() createListDto: CreateListRequestDto,
  ): Promise<void> {
    await this.listService.createList(req.user.id, createListDto)
  }

  @ApiOperation({ summary: 'Add ListMembers to a List' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'List Members added',
  })
  @Post('members')
  async addListMembers(
    @Req() req: RequestWithUser,
    @Body() addListMembersDto: AddListMembersRequestDto,
  ): Promise<void> {
    return this.listService.addListMembers(req.user.id, addListMembersDto, true)
  }

  @ApiOperation({ summary: 'Remove ListMembers from a List' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'List Members removed',
  })
  @Delete('members')
  async removeListMembers(
    @Req() req: RequestWithUser,
    @Body() removeListMembersDto: RemoveListMembersRequestDto,
  ): Promise<void> {
    return this.listService.removeListMembers(
      req.user.id,
      removeListMembersDto,
      true,
    )
  }

  @ApiOperation({ summary: 'Get list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListResponseDto,
    description: 'List was retrieved',
  })
  @Get(':listId')
  async getList(
    @Req() req: RequestWithUser,
    @Param('listId') listId: string,
  ): Promise<GetListResponseDto> {
    return await this.listService.getList(req.user.id, listId)
  }

  @ApiOperation({ summary: 'Get all lists for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListsResponseDto,
    description: 'Lists were retrieved',
  })
  @Get()
  async getLists(@Req() req: RequestWithUser): Promise<GetListsResponseDto> {
    return await this.listService.getListsForUser(req.user.id)
  }

  @ApiOperation({ summary: 'Get list members for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListMembersResponseDto,
    description: 'List members was retrieved',
  })
  @Post('members/')
  async getListMembers(
    @Req() req: RequestWithUser,
    @Body() getListMembersRequestDto: GetListMembersRequestto,
  ): Promise<GetListMembersResponseDto> {
    return {
      listMembers: await this.listService.getListMembers(
        req.user.id,
        getListMembersRequestDto,
      ),
    }
  }

  @ApiOperation({ summary: 'Delete list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'List was deleted',
  })
  @Delete(':listId')
  async deleteList(
    @Req() req: RequestWithUser,
    @Param('listId') listId: string,
  ): Promise<boolean> {
    return await this.listService.deleteList(req.user.id, listId)
  }
}
