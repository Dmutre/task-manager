import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import AuthService from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { TokenResponse } from './response/token.response';
import { MessageResponse } from './response/message.response';
import { EmailDTO } from './dto/email.dto';
import { TokenDTO } from './dto/token.dto';
import { LogInDTO } from './dto/log-in.dto';
import { Request } from 'express';
import { UserResponse } from './response/user.response';
import { JwtGuard } from 'src/security/JwtGuard';

@ApiTags('Authorization')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({ summary: 'Registrate user' })
  async registrateUser(
    @Body() data: CreateUserDTO,
    @Res({ passthrough: true }) response,
  ) {
    const tokens = await this.authService.createUser(data);
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return { access_token: tokens.accessToken };
  }

  @Post('/login')
  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({ summary: 'Log in user' })
  async loginUser(
    @Body() data: LogInDTO,
    @Res({ passthrough: true }) response,
  ) {
    const tokens = await this.authService.loginUser(data);
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return { access_token: tokens.accessToken };
  }

  @Post('/email/request-verification')
  @ApiOkResponse({ type: MessageResponse })
  @ApiOperation({ description: 'Request mail to verify user email' })
  requestEmailVerification(@Body() data: EmailDTO) {
    return this.authService.requestEmailVerification(data);
  }

  @Post('/email/verify')
  @ApiOkResponse({ type: MessageResponse })
  @ApiOperation({
    description: 'Endpoint to send the token from email and verify user email',
  })
  verifyEmail(@Body() data: TokenDTO) {
    return this.authService.verifyEmail(data);
  }

  @Post('/refresh')
  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({ summary: 'Endpoint for refreshing token' })
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response,
  ) {
    const tokens = await this.authService.refreshTokens(
      request.cookies['refresh_token'],
    );
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return { access_token: tokens.accessToken };
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  @ApiOkResponse({ type: UserResponse })
  @ApiOperation({ description: 'Get information about user' })
  getMe(@Req() request) {
    return request.user;
  }
}
