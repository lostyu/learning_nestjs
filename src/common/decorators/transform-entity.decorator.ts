import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { TransformEntityInterceptor } from '../interceptors/transform-entity.interceptor';

export const TransformEntity = (entity: any) =>
  applyDecorators(
    SetMetadata('entity', entity),
    UseInterceptors(TransformEntityInterceptor),
  );
