import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformEntityInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const entity = this.reflector.get('entity', context.getClass());
    console.log(entity);

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((d) => new entity(d));
        } else {
          return new entity(data);
        }
      }),
    );
  }
}
