import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

/** Interface for class types **/
interface ClassConstructorType {
  new (...args: any[]): unknown;
}

/** Create a custom decorator for serialization for ease of use **/
export function Serialize(dto: ClassConstructorType) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/** Use any DTO to intercept/filter out any outgoing response **/
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    /** Run something before a request is handled by the request handler **/

    return handler.handle().pipe(
      map((data: any) => {
        /** Run something before a response is sent out **/
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
