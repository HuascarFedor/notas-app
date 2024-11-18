import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    //Primero, revisar si el nombre de usuario ya existe
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    //Segundo, emitir la excepcion correspondiente si el usuario ya existe
    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    //Tercero, en caso de superar el control se registra el usuario
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser = this.userRepository.create({
      username: user.username,
      password: hashedPassword,
    });
    return this.userRepository.save(createUser);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
