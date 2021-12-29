import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { UsersService } from '../users.service';

/** Retrieve the userId through the session cookie of an incoming request and enrich it so that
 *  it is handled by the current-user decorator after. **/
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }

    return handler.handle();
  }
}
