import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    // Primero, revisar si el nombre de usuario ya existe
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    // Segundo, emitir la excepción correspondiente si el usuario ya existe
    if (userFound) {
      throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }
    // Tercero, En caso de no existir registramos el usuario
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser = this.userRepository.create({
      username: user.username,
      password: hashedPassword,
    });
    return this.userRepository.save(createUser);
  }
}
