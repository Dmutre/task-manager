import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/database/entities/user.entity';

export const AllowedRoles = (...roles: UserRole[]) =>
  SetMetadata('roles', roles);
