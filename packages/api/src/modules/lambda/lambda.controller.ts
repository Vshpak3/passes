import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LambdaService } from './lambda.service'

@ApiTags('lambda')
@Controller('lambda')
export class LambdaController {
  constructor(private readonly lambdaService: LambdaService) {}

  @ApiOperation({ summary: 'Create Address' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: String,
    description: 'address created',
  })
  @Post('create/address/:keyId')
  async getEncryptionKey(@Param('keyId') keyId: string): Promise<string> {
    return await this.lambdaService.blockchainSignCreateAddress(keyId)
  }

  @ApiOperation({ summary: 'Get public Address' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'address returned',
  })
  @Get('public/address/:keyId')
  async getPublicAddress(@Param('keyId') keyId: string): Promise<string> {
    return await this.lambdaService.blockchainSignGetPublicAddress(keyId)
  }

  @ApiOperation({ summary: 'Sign message' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'signed message returned',
  })
  @Post('sign/message/:keyId')
  async signMessage(
    @Param('keyId') keyId: string,
    @Body() message: Uint8Array,
  ): Promise<string> {
    return await (
      await this.lambdaService.blockchainSignSignMessage(keyId, message)
    ).toString()
  }
}
