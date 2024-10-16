import { Repository } from 'typeorm';
import { NotasService } from './notas.service';
import { Nota } from './nota.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('Notas Integration (NotasService)', () => {
  let service: NotasService;
  let repository: Repository<Nota>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'notas_test',
          entities: [Nota],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Nota]),
      ],
      providers: [NotasService],
    }).compile();
    service = module.get<NotasService>(NotasService);
    repository = module.get<Repository<Nota>>(getRepositoryToken(Nota));
  });

  afterAll(async () => {
    const connection = repository.manager.connection;
    if (connection.isInitialized) {
      await connection.destroy();
    }
  });

  afterEach(async () => {
    await repository.query('DELETE FROM nota;');
  });

  it('Deberia crear una nueva nota en la base de datos', async () => {
    const nuevaNota = {
      title: 'Nota de prueba',
      content: 'Contenido de prueba',
    };

    const notaCreada = await service.create(nuevaNota);
    expect(notaCreada).toHaveProperty('id');
    expect(notaCreada.title).toEqual(nuevaNota.title);
    expect(notaCreada.content).toEqual(nuevaNota.content);

    const notasEnBaseDatos = await repository.findOneBy({ id: notaCreada.id });
    expect(notasEnBaseDatos).toBeDefined();
    expect(notasEnBaseDatos.title).toEqual(nuevaNota.title);
    expect(notasEnBaseDatos.content).toEqual(nuevaNota.content);
  });
});
