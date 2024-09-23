import { IsOptional, IsString } from 'class-validator';

export class UpdateNotaDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
