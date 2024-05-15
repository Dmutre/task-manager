import { Controller } from '@nestjs/common';
import AuthService from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
}
