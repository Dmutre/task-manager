import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor () {
    super('User with such email already exists', HttpStatus.CONFLICT);
  }
}