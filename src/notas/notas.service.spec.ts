import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './notas.service';
import { Repository } from 'typeorm';
import { Nota } from './nota.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockNotaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
});

const mockNote = { id: 1, title: 'Test Note', content: 'Test Content' };

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('NotasService', () => {
  let service: NotasService;
  let repository: MockRepository<Nota>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        {
          provide: getRepositoryToken(Nota),
          useValue: mockNotaRepository(),
        },
      ],
    }).compile();

    service = module.get<NotasService>(NotasService);
    repository = module.get<MockRepository<Nota>>(getRepositoryToken(Nota));
  });

  it('should create a note', async () => {
    jest.spyOn(repository, 'save').mockResolvedValue(mockNote as Nota);

    // trabaja el metodo del servicio
    const result = await service.create({
      title: 'Test Note',
      content: 'Test Content',
    });

    expect(result).toEqual(mockNote);

    expect(repository.save).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
  });

  it('should retrieve all notes', async () => {
    const mockNotes = [
      { id: 1, title: 'Test Note 1', content: 'Test Content 1' },
      { id: 2, title: 'Test Note 2', content: 'Test Content 2' },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(mockNotes as Nota[]);

    // trabaja el metodo del servicio
    const result = await service.findAll();

    expect(result).toEqual(mockNotes);

    expect(repository.find).toHaveBeenCalled();
  });

  it('should retrieve a note by id', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockNote as Nota);

    // trabaja el metodo del servicio
    const result = await service.findOne(1);

    expect(result).toEqual(mockNote);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw a NotFoundException id the note does not exist', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    // trabaja el metodo del servicio
    try {
      await service.findOne(1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('La nota con id 1 no existe');
      expect(error.getStatus()).toBe(404);
    }

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});
