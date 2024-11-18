import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { Nota } from './nota.entity';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@ApiTags('Notas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva nota' })
  @ApiBody({ type: CreateNotaDto })
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notasService.create(createNotaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notas' })
  findAll(): Promise<Nota[]> {
    return this.notasService.findAll();
  }

  @Get('title/search')
  @ApiOperation({ summary: 'Obtener las notas por coincidencia en el título' })
  @ApiQuery({
    name: 'title',
    type: 'string',
    description:
      'Palabra o frase para buscar coincidencias en los titulos de las notas',
    example: 'Ejemplo de título',
    required: true,
  })
  async findByTitle(@Query('title') title: string): Promise<Nota[]> {
    return this.notasService.findByTitle(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener la nota por su ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único de la nota',
    example: 1,
  })
  findOne(@Param('id') id: string): Promise<Nota> {
    return this.notasService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modificar una nota señalada por su ID' })
  @ApiBody({ type: UpdateNotaDto })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único de la nota',
    example: 1,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotaDto: UpdateNotaDto,
  ): Promise<Nota> {
    return this.notasService.update(+id, updateNotaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una nota señalada por su ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único de la nota',
    example: 1,
  })
  delete(@Param('id') id: string): Promise<void> {
    return this.notasService.remove(+id);
  }
}
