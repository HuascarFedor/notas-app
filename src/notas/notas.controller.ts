import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { Nota } from './nota.entity';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notasService.create(createNotaDto);
  }

  @Get()
  findAll(): Promise<Nota[]> {
    return this.notasService.findAll();
  }

  @Get('title/search')
  async findByTitle(@Query('title') title: string): Promise<Nota[]> {
    return this.notasService.findByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Nota> {
    return this.notasService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotaDto: UpdateNotaDto,
  ): Promise<Nota> {
    return this.notasService.update(+id, updateNotaDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.notasService.remove(+id);
  }
}
