import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre de usuario' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Contraseña' })
  password: string;
}
