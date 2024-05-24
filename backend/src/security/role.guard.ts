import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from 'src/database/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles: UserRole[] = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    const user: User = request.user;

    if (!roles || roles.length === 0 || roles.includes(user.role)) return true;

    throw new ForbiddenException(
      'User has no permission to perform this action',
    );
  }
}
