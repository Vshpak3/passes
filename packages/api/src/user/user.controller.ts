import { Controller, Get } from '@nestjs/common';
import { User } from './user';

@Controller('users')
export class UserController {
  constructor() {}

  @Get()
  listUsers(): User[] {
    return [];
  }
}
