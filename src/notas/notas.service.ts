import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nota } from './nota.entity';
import { Repository } from 'typeorm';
import { CreateNotaDto } from './dto/create-nota.dto';

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
}
