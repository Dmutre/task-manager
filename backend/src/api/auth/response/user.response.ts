import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/database/entities/user.entity';

export class UserResponse {
  @ApiProperty({ description: 'User id' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ description: 'Boss id of user, can be null' })
  bossId?: string;
}
