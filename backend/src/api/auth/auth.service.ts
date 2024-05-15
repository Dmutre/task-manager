import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userRepo.findOneBy({ email });

    if (!user) throw new UnauthorizedException('User is not authorized');

    if (!user.emailApproved)
      throw new UnauthorizedException('Email is not approved');

    delete user.password;
    return user;
  }

  async findUser(id: string): Promise<User> {
    return await this.userRepo.findOneBy({ id });
  }
}
