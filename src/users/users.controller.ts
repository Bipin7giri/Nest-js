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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AdminAuto,
  CreateUserDto,
  LoginDto,
} from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
// import { Role } from './entities/user.entity';
import { Role } from '../constants/roles.enum';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from './entities/user.entity';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/paginate')
  public findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query);
  }

  @HasRoles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    return this.authService.login(req.user);
    return req.user;
  }

  @Post('/automigrate')
  async RunScript(@Body() autoMigrate: AdminAuto): Promise<any> {
    const key = 123456;
    if (autoMigrate.key === key) {
      await this.userService.scriptDb();
    } else {
      throw new UnauthorizedException();
    }
  }
}
