import { Test, TestingModule } from '@nestjs/testing';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';

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
});
