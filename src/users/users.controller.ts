import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUsers(@Request() req) {
    return this.userService.getUsers();
  }

  @Get('id/:id')
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUsersById(id);
  }
  @Post('register')
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @UsePipes(ValidationPipe)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    console.log(req.user);
    return this.authService.login(req.user);
    return req.user;
  }
}
