import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/helper/hash.services';
// import { AuthService } from 'src/services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwtConstant';
import { LocalStrategy } from 'src/auth/local.strategy';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.modules';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashService,
    AuthService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UsersModule {}
