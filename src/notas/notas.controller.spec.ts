import { Test, TestingModule } from '@nestjs/testing';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { NotFoundException } from '@nestjs/common';

const mockNota = { id: 1, title: 'Test Note', content: 'Test Content' };

describe('NotasController', () => {
  let controller: NotasController;
  let service: NotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotasController],
      providers: [
        {
          provide: NotasService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNota),
            findAll: jest.fn().mockResolvedValue([mockNota]),
            findByTitle: jest.fn().mockResolvedValue([mockNota]),
            findOne: jest.fn().mockResolvedValue(mockNota),
            update: jest.fn().mockResolvedValue(mockNota),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<NotasController>(NotasController);
    service = module.get<NotasService>(NotasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a note', async () => {
    const createNotaDto: CreateNotaDto = {
      title: 'Test Note',
      content: 'Test Content',
    };

    const result = await controller.create(createNotaDto);
    expect(result).toEqual(mockNota);
    expect(service.create).toHaveBeenCalledWith(createNotaDto);
  });

  it('should find all notes', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockNota]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find notes by title', async () => {
    const title = 'Test Note';
    const result = await controller.findByTitle(title);
    expect(result).toEqual([mockNota]);
    expect(service.findByTitle).toHaveBeenCalledWith(title);
  });

  it('should find a note by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockNota);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when note is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('should update a note', async () => {
    const updateNotaDto: UpdateNotaDto = {
      title: 'Updated Test Note',
      content: 'Updated Test Content',
    };

    const result = await controller.update('1', updateNotaDto);
    expect(result).toEqual(mockNota);
    expect(service.update).toHaveBeenCalledWith(1, updateNotaDto);
  });

  it('should throw NotFoundException when updating a non-existing note', async () => {
    jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
    const updateNotaDto: UpdateNotaDto = {
      title: 'Non-existent Note',
      content: 'Non-existent Content',
    };
    await expect(controller.update('999', updateNotaDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a note', async () => {
    const result = await controller.delete('1');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting a non-existing note', async () => {
    jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
    await expect(controller.delete('999')).rejects.toThrow(NotFoundException);
  });
});
