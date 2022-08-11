import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { AddListMemberDto } from './dto/add-list-member.dto'
import { CreateListDto } from './dto/create-list.dto'
import { GetListDto } from './dto/get-list.dto'
import { GetListsDto } from './dto/get-lists.dto'
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
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createListDto: CreateListDto,
  ): Promise<GetListDto> {
    return await this.listService.create(req.user.id, createListDto)
  }

  @ApiOperation({ summary: 'Add ListMember to a List' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'List was created',
  })
  @Post('/member')
  @UseGuards(JwtAuthGuard)
  async addListMember(
    @Req() req: RequestWithUser,
    @Body() addListMemberDto: AddListMemberDto,
  ): Promise<void> {
    return this.listService.addListMember(req.user.id, addListMemberDto)
  }

  @ApiOperation({ summary: 'Remove ListMember from a List' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'ListMember was removed',
  })
  @Delete('/member')
  @UseGuards(JwtAuthGuard)
  async removeListMember(
    @Req() req: RequestWithUser,
    @Body() addListMemberDto: AddListMemberDto,
  ): Promise<boolean> {
    return this.listService.removeListMember(req.user.id, addListMemberDto)
  }

  @ApiOperation({ summary: 'Get list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListDto,
    description: 'List was retrieved',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async find(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<GetListDto> {
    return await this.listService.getList(req.user.id, id)
  }

  @ApiOperation({ summary: 'Get all lists for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListsDto,
    description: 'Lists were retrieved',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser): Promise<GetListsDto> {
    return await this.listService.getListsForUser(req.user.id)
  }

  @ApiOperation({ summary: 'Delete list for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'List was deleted',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.listService.deleteList(req.user.id, id)
  }
}
