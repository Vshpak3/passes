import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AdminService } from './admin.service'

/**
 * All admin endpoints are protected via this guard. It is set on the Admin
 * controller and will always be called after the main JWT authentication:
 *   https://docs.nestjs.com/faq/request-lifecycle#summary
 */
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private readonly adminService: AdminService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // No need to call super, jwt auth is handled by global auth
    const req = context.switchToHttp().getRequest()
    await this.adminService.adminCheck(req.user.id, req.body['secret'])
    return true
  }
}
