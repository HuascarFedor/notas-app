import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotaDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Título de la nota', required: false })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Contenido de la nota', required: false })
  content?: string;
}
