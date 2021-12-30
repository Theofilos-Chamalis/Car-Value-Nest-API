import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Get the currentUser from the request that we have enriched via the current-user interceptor and return it **/
export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.currentUser;
});
