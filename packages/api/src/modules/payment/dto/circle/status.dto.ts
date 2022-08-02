import { ApiProperty } from '@nestjs/swagger'

export class StatusDto {
  constructor(id: string, status: string) {
    this.id = id
    this.status = status
  }
  @ApiProperty()
  id: string
  @ApiProperty()
  status: string
}
