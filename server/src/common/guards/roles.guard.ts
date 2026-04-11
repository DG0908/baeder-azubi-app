import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole } from '@prisma/client';
import { ALLOW_KEY } from '../decorators/allow.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Public() routes bypass all guards — no auth or role check needed
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const isExplicitlyAllowed = this.reflector.getAllAndOverride<boolean>(ALLOW_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    // If neither @Roles() nor @Allow() is set → deny by default
    if (!requiredRoles && !isExplicitlyAllowed) {
      throw new ForbiddenException('Access denied by security policy.');
    }

    // @Allow() grants access to any authenticated user
    if (isExplicitlyAllowed && !requiredRoles) {
      return true;
    }

    // @Roles() check
    if (requiredRoles && requiredRoles.length > 0) {
      const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
      const user = request.user;

      if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient permissions.');
      }
    }

    return true;
  }
}
