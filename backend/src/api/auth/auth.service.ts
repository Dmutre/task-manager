import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserAlreadyExistsException } from '../../utils/exceptions/UserAlreadyExcistException';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import JwtConfiguration from '../../config/jwt-config';
import { EmailDTO } from './dto/email.dto';
import * as uuid from 'uuid';
import { Token } from '../../database/entities/token.entity';
import FrontendConfiguration from '../../config/frontend-config';
import { MailService } from '../../mail/mail.service';
import { TokenDTO } from './dto/token.dto';
import { HOUR } from '../../utils/consts';
import { LogInDTO } from './dto/log-in.dto';
import { JwtPayload } from '../../security/JwtPayload';
import { Tokens } from '../../utils/types/tokens.type';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfiguration,
    private readonly frontendConfig: FrontendConfiguration,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userRepo.findOneBy({ email });

    if (!user) throw new UnauthorizedException('User is not authorized');

    if (!user.emailApproved)
      throw new UnauthorizedException('Email is not approved');

    if (!(await this.comparePasswords(password, user.password)))
      throw new BadRequestException('Email or password is wrong');

    delete user.password;
    return user;
  }

  private comparePasswords(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async findUser(id: string): Promise<User> {
    return await this.userRepo.findOneBy({ id });
  }

  private async userExists(email: string): Promise<boolean> {
    return !!(await this.userRepo.findOneBy({ email }));
  }

  async createUser(data: CreateUserDTO) {
    if (await this.userExists(data.email)) {
      throw new UserAlreadyExistsException();
    }

    data.password = await this.hashPassword(data.password);

    const user = this.userRepo.create(data);
    await this.userRepo.save(user);

    return this.getTokens(user);
  }

  private getTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      createdAt: Date.now(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.jwtConfig.jwt_refresh_ttl,
      }),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 7;
    return bcrypt.hash(password, salt);
  }

  async requestEmailVerification(data: EmailDTO) {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) throw new UnauthorizedException();

    if (user.emailApproved)
      throw new BadRequestException('User email is already epproved');

    const tokenValue = uuid.v4();
    const token = this.tokenRepo.create({ value: tokenValue, user });
    await this.tokenRepo.save(token);

    await this.mailService.send({
      to: user.email,
      subject: 'Email verify',
      message: 'Follow the link to verify your email',
      link: `${this.frontendConfig.url}/verify/${token.value}`,
    });

    return {
      message:
        'We send you the confirmation email. Please wait and confirm your email',
    };
  }

  async verifyEmail(data: TokenDTO) {
    const token = await this.tokenRepo.findOne({
      where: { value: data.token },
      relations: ['user'],
    });

    if (!token) throw new BadRequestException('Invalid token');

    if (Date.now() - token.createdAt.getTime() > HOUR)
      throw new BadRequestException(
        'Token has expired, repeat the email verification request process',
      );

    await this.userRepo.update(token.user.id, { emailApproved: true });
    await this.tokenRepo.delete(token);

    return {
      message:
        'Your email has been successfuly verified. You can login in our app',
    };
  }

  async loginUser(data: LogInDTO) {
    const user = await this.userRepo.findOneBy({ email: data.email });

    if (!user) throw new UnauthorizedException();

    if (!user.emailApproved)
      throw new UnauthorizedException('Email is not verified');

    if (!(await this.comparePasswords(data.password, user.password)))
      throw new BadRequestException('Invalid email or password');

    return this.getTokens(user);
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) throw new UnauthorizedException();

    const payload: JwtPayload = await this.verifyToken(refreshToken);
    const user: User = await this.findUser(payload.sub);

    if (!user) throw new UnauthorizedException();

    return this.getTokens(user);
  }
}
