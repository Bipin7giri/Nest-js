import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Role } from 'src/AllEntites';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HashService } from 'src/helper/hash.services';
import {
  FilterOperator,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private hashService: HashService,
  ) {}

  public findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'username', 'email'],
      relations: ['roleId'],
      nullSort: 'last',
      searchableColumns: ['username'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        email: [FilterOperator.GTE, FilterOperator.LTE],
      },
    });
  }

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const hashPassword = await this.hashService.hashPassword(
        newUser.password,
      );
      const roles = await this.roleRepository.findOne({
        where: {
          name: 'user',
        },
      });
      return this.userRepository.save({
        username: newUser.username,
        email: newUser.email,
        password: hashPassword,
        roleId: roles,
      });
    } catch (err) {
      throw new UnprocessableEntityException('email must be unique');
      console.log(err);
    }
  }

  getUsers() {
    return this.userRepository.find();
  }
  getUserByEmail(param) {
    return this.userRepository.findOne(param.email);
  }

  findOne(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        roleId: true,
      },
    });
  }

  findUsersById(id: number) {
    return this.userRepository.findByIds([id]);
  }

  async scriptDb() {
    const countIfuser = await this.roleRepository.count();
    console.log(countIfuser);
    if (countIfuser === 0) {
      const admin = new Role();
      admin.name = 'admin';
      admin.roles = ['admin'];
      const roles: any = await this.roleRepository.save({
        name: 'admin',
        roles: ['admin'],
      });
      await this.roleRepository.save({
        name: 'user',
        roles: ['user'],
      });
      console.log(roles);
      const adminCreated = await this.userRepository.save({
        name: 'admin',
        email: 'admin@example.com',
        roleId: roles,
        password:
          '$2a$12$DzW7DBrHUTYFRie7ycF8ouIubkmsrKzNcZs2bZ6mtWpY4FDYoTwhm',
      });
      console.log(adminCreated);
      return adminCreated;
    } else {
      throw new UnprocessableEntityException('Admin alreay exist');
    }
  }
}
