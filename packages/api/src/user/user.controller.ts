import { Controller, Get } from '@nestjs/common'

import type { User } from './user'

@Controller('users')
export class UserController {
  constructor() {}

  @Get()
  listUsers(): User[] {
    return []
  }
}
