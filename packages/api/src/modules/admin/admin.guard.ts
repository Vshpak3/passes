import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'

import { UserDto } from '../user/dto/user.dto'
// import { UserService } from '../user/user.service'

const ADMIN_EMAIL = '@passes.com'

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  private env: string
  private secret: string

  constructor(
    private readonly configService: ConfigService, // private readonly userService: UserService,
  ) {
    super()
    this.secret = this.configService.get('admin.secret') as string
    this.env = this.configService.get('infra.env') as string
  }

  async adminCheck(id: string, secret: string): Promise<UserDto> {
    const reqUser = {} as UserDto //await this.userService.findOne({ id })

    // Skip admin check in local development
    if (this.env === 'dev') {
      return reqUser
    }

    if (!reqUser.email.endsWith(ADMIN_EMAIL) || secret !== this.secret) {
      throw new BadRequestException('Invalid request')
    }
    return reqUser
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // No need to call super, jwt auth is handled by global auth
    const req = context.switchToHttp().getRequest()
    await this.adminCheck(req.user.id, req.body['secret'])
    return true
  }
}
