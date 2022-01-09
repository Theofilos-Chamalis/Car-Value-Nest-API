import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  /** ExecutionContext = wrapper of the incoming request **/
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) return false;
    return request.currentUser.admin;
  }
}
