import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nota } from './nota.entity';
import { Like, Repository } from 'typeorm';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private notasRepository: Repository<Nota>,
  ) {}

  create(createNoteDto: CreateNotaDto): Promise<Nota> {
    const newNota = this.notasRepository.create(createNoteDto);
    return this.notasRepository.save(newNota);
  }

  findAll(): Promise<Nota[]> {
    return this.notasRepository.find();
  }

  findOne(id: number): Promise<Nota> {
    return this.notasRepository.findOneBy({ id }).then((nota) => {
      if (!nota) {
        throw new NotFoundException(`La nota con id ${id} no existe`);
      }
      return nota;
    });
  }

  async findByTitle(title: string): Promise<Nota[]> {
    return this.notasRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async update(id: number, updateNotaDto: UpdateNotaDto): Promise<Nota> {
    const updateResult = await this.notasRepository.update(id, updateNotaDto);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`La nota con id ${id} no existe`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.notasRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`La nota con id ${id} no existe`);
    }
    throw new HttpException(
      `La nota con id ${id} ha sido eliminada`,
      HttpStatus.OK,
    );
  }
}
