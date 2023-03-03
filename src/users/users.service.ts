import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HashService } from 'src/helper/hash.services';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const hashPassword = await this.hashService.hashPassword(newUser.password);
    return this.userRepository.save({
      username: newUser.username,
      email: newUser.email,
      password: hashPassword,
    });
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
    });
  }

  findUsersById(id: number) {
    return this.userRepository.findByIds([id]);
  }
}
