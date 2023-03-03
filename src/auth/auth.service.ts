import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/helper/hash.services';
import { UsersService } from '../users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const checkIfCorrectPassword = await this.hashService.comparePassword(
        pass,
        user.password,
      );
      if (!checkIfCorrectPassword) {
        throw new UnauthorizedException('Incorrect password');
      }
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Email not found');
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roleId: user.role,
    };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload, { secret: 'test' }),
    };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
