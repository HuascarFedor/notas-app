import { Repository } from 'typeorm';
import { NotasService } from './notas.service';
import { Nota } from './nota.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

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

  it('Deberia obtener todas las notas de la base de datos', async () => {
    await repository.query('DELETE FROM nota;');

    await repository.save([
      { title: 'Nota 1', content: 'Contenido 1' },
      { title: 'Nota 2', content: 'Contenido 2' },
    ]);

    const notas = await service.findAll();
    expect(notas.length).toBe(2);
    expect(notas[0].title).toBe('Nota 1');
    expect(notas[1].title).toBe('Nota 2');
  });

  it('Debería obtener una nota por ID', async () => {
    await repository.query('DELETE FROM nota;');

    const nuevaNota = await repository.save({
      title: 'Nota específica',
      content: 'Contenido específico',
    });

    const notaEncontrada = await service.findOne(nuevaNota.id);

    expect(notaEncontrada).toBeDefined();
    expect(notaEncontrada.title).toEqual('Nota específica');
    expect(notaEncontrada.content).toEqual('Contenido específico');
  });

  it('Debería lanzar NotFoundException al no encontrar una nota por ID', async () => {
    const notaInexistente = 999;
    try {
      await service.findOne(notaInexistente);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La nota con id ${notaInexistente} no existe`);
    }
  });

  it('Debería actualizar una nota existente', async () => {
    await repository.query('DELETE FROM nota;');

    const nuevaNota = await repository.save({
      title: 'Nota antes de actualizar',
      content: 'Contenido antes de actualizar',
    });

    const notaActualizada = await service.update(nuevaNota.id, {
      title: 'Nota actualizada',
      content: 'Contenido actualizado',
    });

    expect(notaActualizada).toBeDefined();
    expect(notaActualizada.title).toEqual('Nota actualizada');
    expect(notaActualizada.content).toEqual('Contenido actualizado');

    const notasEnBaseDatos = await repository.findOneBy({ id: nuevaNota.id });
    expect(notasEnBaseDatos).toBeDefined();
    expect(notasEnBaseDatos.title).toEqual(notaActualizada.title);
    expect(notasEnBaseDatos.content).toEqual(notaActualizada.content);
  });

  it('Debería lanzar NotFoundException al no encontrar una nota para modificar', async () => {
    const notaInexistente = 999;
    try {
      await service.update(notaInexistente, {
        title: 'Nota actualizada',
        content: 'Contenido actualizado',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La nota con id ${notaInexistente} no existe`);
    }
  });

  it('Debería eliminar una nota existente', async () => {
    await repository.query('DELETE FROM nota;');

    const nuevaNota = await repository.save({
      title: 'Nota para eliminar',
      content: 'Contenido para eliminar',
    });

    try {
      await service.remove(nuevaNota.id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.OK);
      expect(error.message).toBe(
        `La nota con id ${nuevaNota.id} ha sido eliminada`,
      );
    }

    const notaEliminada = await repository.findOneBy({ id: nuevaNota.id });
    expect(notaEliminada).toBeNull();
  });

  it('Debería lanzar NotFoundException al no encontrar una nota para eliminar', async () => {
    const notaInexistente = 999;
    try {
      await service.remove(notaInexistente);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La nota con id ${notaInexistente} no existe`);
    }
  });
});
