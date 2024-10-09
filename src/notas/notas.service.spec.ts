import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './notas.service';
import { Repository } from 'typeorm';
import { Nota } from './nota.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, NotFoundException } from '@nestjs/common';

const mockNotaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  it('should retrieve notes by title', async () => {
    const mockNotes = [
      { id: 1, title: 'Test Note', content: 'Test Content' },
      { id: 2, title: 'Another Test Note', content: 'Another Test Content' },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(mockNotes as Nota[]);

    // trabaja el metodo del servicio
    const result = await service.findByTitle('Test');

    expect(result).toEqual(mockNotes);

    expect(repository.find).toHaveBeenCalledWith({
      where: {
        title: expect.objectContaining({
          _type: 'like',
          _value: '%Test%',
        }),
      },
    });
  });

  it('should update a note', async () => {
    const updatedNote = { ...mockNote, title: 'Updated Note' };

    jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedNote as Nota);

    // trabaja el metodo del servicio
    const result = await service.update(1, {
      title: 'Updated Note',
      content: 'Updated Content',
    });

    expect(result).toEqual(updatedNote);

    expect(repository.update).toHaveBeenCalledWith(1, {
      title: 'Updated Note',
      content: 'Updated Content',
    });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if the note to update does not exist', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue({ affected: 0 } as any);

    // trabaja el metodo del servicio
    try {
      await service.update(1, {
        title: 'Non-existing Note',
        content: 'Non-existing Content',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('La nota con id 1 no existe');
      expect(error.getStatus()).toBe(404);
    }

    expect(repository.update).toHaveBeenCalledWith(1, {
      title: 'Non-existing Note',
      content: 'Non-existing Content',
    });
  });

  it('should remove a note', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    // trabaja el metodo del servicio
    try {
      await service.remove(1);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('La nota con id 1 ha sido eliminada');
      expect(error.getStatus()).toBe(200);
    }

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if the note to remove does not exist', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

    // trabaja el metodo del servicio
    try {
      await service.remove(1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('La nota con id 1 no existe');
      expect(error.getStatus()).toBe(404);
    }

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
