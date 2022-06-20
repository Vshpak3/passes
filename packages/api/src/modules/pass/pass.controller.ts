import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PassService } from './pass.service'
import { CreatePassDto } from './dto/create-pass.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('pass')
@Controller('api/pass')
export class PassController {
  constructor(private readonly passService: PassService) {}

  @ApiOperation({ summary: 'TODO' })
  @Post()
  create(@Body() createPassDto: CreatePassDto) {
    return this.passService.create(createPassDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Get()
  findAll() {
    return this.passService.findAll()
  }

  @ApiOperation({ summary: 'TODO' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passService.findOne(+id)
  }

  @ApiOperation({ summary: 'TODO' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePassDto: UpdatePassDto) {
    return this.passService.update(+id, updatePassDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passService.remove(+id)
  }
}
