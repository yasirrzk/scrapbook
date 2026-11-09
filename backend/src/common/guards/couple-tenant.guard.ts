import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { validate as validateUuid } from 'uuid';
import { Request } from 'express';

@Injectable()
export class CoupleTenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const coupleIdHeader = request.headers['x-couple-id'];

    if (!coupleIdHeader || typeof coupleIdHeader !== 'string') {
      throw new BadRequestException(
        'Header "x-couple-id" is required for multi-tenant couple context',
      );
    }

    const coupleId = coupleIdHeader.trim();
    if (!validateUuid(coupleId)) {
      throw new BadRequestException(
        'Header "x-couple-id" must be a valid UUID',
      );
    }

    // Attach to request object
    (request as Request & { coupleId: string }).coupleId = coupleId;
    return true;
  }
}
