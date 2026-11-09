import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CoupleId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request & { coupleId?: string }>();
    return request.coupleId || (request.headers['x-couple-id'] as string);
  },
);
