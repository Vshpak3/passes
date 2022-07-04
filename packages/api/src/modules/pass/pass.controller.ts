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

import { CreatePassDto } from './dto/create-pass.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassService } from './pass.service'

@ApiTags('pass')
@Controller('pass')
export class PassController {
  constructor(private readonly passService: PassService) {}

  @ApiOperation({ summary: 'Creates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePassDto,
    description: 'A pass was created',
  })
  @Post()
  async create(@Body() createPassDto: CreatePassDto): Promise<CreatePassDto> {
    return this.passService.create(createPassDto)
  }

  @ApiOperation({ summary: 'Gets a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePassDto,
    description: 'A pass was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreatePassDto> {
    return this.passService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A pass was updated',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePassDto: UpdatePassDto) {
    return this.passService.update(id, updatePassDto)
  }

  @ApiOperation({ summary: 'Deletes a pass' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A pass was deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.passService.remove(id)
  }
}
