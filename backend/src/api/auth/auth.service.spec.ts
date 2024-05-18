import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../database/entities/user.entity';
import { Token } from '../../database/entities/token.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import JwtConfiguration from '../../config/jwt-config';
import FrontendConfiguration from '../../config/frontend-config';
import { MailService } from '../../mail/mail.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtServiceMock: JwtService;
  let userRepositoryMock: Repository<User>;
  let tokenRepositoryMock: Repository<Token>;
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    emailApproved: true,
    role: UserRole.BOSS,
    username: 'TestUser',
  };
  const expiredToken = {
    id: '2',
    value: 'expired_token',
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: getRepositoryToken(Token),
          useValue: {
            findOne: jest.fn().mockResolvedValue(expiredToken),
            findOneBy: jest.fn().mockResolvedValue(expiredToken),
            create: jest.fn().mockReturnValue(expiredToken),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: JwtConfiguration,
          useValue: {},
        },
        {
          provide: FrontendConfiguration,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValue('token'),
            verify: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtServiceMock = module.get<JwtService>(JwtService);
    userRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
    tokenRepositoryMock = module.get<Repository<Token>>(
      getRepositoryToken(Token),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser(
      mockUser.email,
      mockUser.password,
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw a BadRequestException', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await expect(
      service.validateUser(mockUser.email, mockUser.password),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw an UnauthorizedException', async () => {
    jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await expect(
      service.validateUser(mockUser.email, mockUser.password),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return user', async () => {
    const user = await service.findUser('1');
    expect(user).toEqual(mockUser);
  });

  it('should create user', async () => {
    jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockUser.password);

    const tokens = await service.createUser(mockUser);
    expect(await tokens.accessToken).toEqual('token');
    expect(await tokens.refreshToken).toEqual('token');
  });

  it('should throw UnauthorizedException if user is not found during email verification', async () => {
    jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValue(null);

    await expect(
      service.requestEmailVerification({ email: 'test@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw BadRequestException if user email is already approved during email verification', async () => {
    const existingUser = { ...mockUser, emailApproved: true };
    jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValue(existingUser);

    await expect(
      service.requestEmailVerification({ email: 'test@example.com' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if token is invalid during email verification', async () => {
    jest.spyOn(tokenRepositoryMock, 'findOne').mockResolvedValue(null);

    await expect(
      service.verifyEmail({ token: 'invalid_token' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if token has expired during email verification', async () => {
    jest.spyOn(tokenRepositoryMock, 'findOne').mockResolvedValue(expiredToken);

    await expect(
      service.verifyEmail({ token: 'expired_token' }),
    ).rejects.toThrow(BadRequestException);
  });
});
