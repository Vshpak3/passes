import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { AddListMembersRequestDto } from './dto/add-list-members.dto'
import { CreateListRequestDto } from './dto/create-list.dto'
import { EditListNameRequestDto } from './dto/edit-list-name.dto'
import { GetListResponseDto } from './dto/get-list.dto'
import {
  GetListMembersRequestDto,
  GetListMembersResponseDto,
} from './dto/get-list-members.dto'
import { GetListsResponseDto } from './dto/get-lists.dto'
import { RemoveListMembersRequestDto } from './dto/remove-list-members.dto'
import { ListService } from './list.service'

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiEndpoint({
    summary: 'Creates List for a user',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'List was created',
  })
  @Post('create')
  async createList(
    @Req() req: RequestWithUser,
    @Body() createListDto: CreateListRequestDto,
  ): Promise<void> {
    await this.listService.createList(req.user.id, createListDto)
  }

  @ApiEndpoint({
    summary: 'Add ListMembers to a List',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'List Members added',
  })
  @Post('add-members')
  async addListMembers(
    @Req() req: RequestWithUser,
    @Body() addListMembersDto: AddListMembersRequestDto,
  ): Promise<void> {
    return this.listService.addListMembers(req.user.id, addListMembersDto, true)
  }

  @ApiEndpoint({
    summary: 'Remove ListMembers from a List',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'List Members removed',
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

  @ApiEndpoint({
    summary: 'Get list for user',
    responseStatus: HttpStatus.OK,
    responseType: GetListResponseDto,
    responseDesc: 'List was retrieved',
  })
  @Get('list-info/:listId')
  async getList(
    @Req() req: RequestWithUser,
    @Param('listId') listId: string,
  ): Promise<GetListResponseDto> {
    return await this.listService.getList(req.user.id, listId)
  }

  @ApiEndpoint({
    summary: 'Get all lists for user',
    responseStatus: HttpStatus.OK,
    responseType: GetListsResponseDto,
    responseDesc: 'Lists were retrieved',
  })
  @Get('lists-info')
  async getLists(@Req() req: RequestWithUser): Promise<GetListsResponseDto> {
    return new GetListsResponseDto(
      await this.listService.getListsForUser(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Get list members for user',
    responseStatus: HttpStatus.OK,
    responseType: GetListMembersResponseDto,
    responseDesc: 'List members was retrieved',
  })
  @Post('members')
  async getListMembers(
    @Req() req: RequestWithUser,
    @Body() getListMembersRequestDto: GetListMembersRequestDto,
  ): Promise<GetListMembersResponseDto> {
    return {
      listMembers: await this.listService.getListMembers(
        req.user.id,
        getListMembersRequestDto,
      ),
    }
  }

  @ApiEndpoint({
    summary: 'Delete list for user',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'List was deleted',
  })
  @Delete('list-info/:listId')
  async deleteList(
    @Req() req: RequestWithUser,
    @Param('listId') listId: string,
  ): Promise<boolean> {
    return await this.listService.deleteList(req.user.id, listId)
  }

  @ApiEndpoint({
    summary: 'Edit list name',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'List name was edited',
  })
  @Patch('list-info')
  async editListName(
    @Req() req: RequestWithUser,
    @Body() editListNameRequestDto: EditListNameRequestDto,
  ): Promise<boolean> {
    return await this.listService.editListName(
      req.user.id,
      editListNameRequestDto,
    )
  }
}
