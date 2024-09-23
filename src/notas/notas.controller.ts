import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { Nota } from './nota.entity';

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
}
