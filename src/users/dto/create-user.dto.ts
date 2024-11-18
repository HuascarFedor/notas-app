import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 15)
  @IsAlphanumeric(undefined, {
    message: 'El nombre de usuario debe contener solo caracteres alfanuméricos',
  })
  @ApiProperty({ description: 'Nombre de usuario' })
  username: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).{7,}$/, {
    message:
      'La contraseña debe contener al menos 7 caracteres, incluyendo una letra mayúscula, un dígito y un carácter especial.',
  })
  @ApiProperty({ description: 'Contraseña' })
  password: string;
}
