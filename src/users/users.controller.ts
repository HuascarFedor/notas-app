import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
  }
}
