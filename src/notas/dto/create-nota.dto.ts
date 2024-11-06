import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotaDto {
  @IsString()
  @IsNotEmpty({ message: 'The title is required' })
  @ApiProperty({ description: 'Título de la nota' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'The content is required' })
  @ApiProperty({ description: 'Contenido de la nota' })
  content: string;
}
