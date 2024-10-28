import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as request from 'supertest';

import { Nota } from './notas/nota.entity';
import { NotasModule } from './notas/notas.module';
import { CreateNotaDto } from './notas/dto/create-nota.dto';
import { UpdateNotaDto } from './notas/dto/update-nota.dto';

describe('Notas Acceptance', () => {
  let app: INestApplication;
  let notasRepository: Repository<Nota>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NotasModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'notas_db_test',
          entities: [Nota],
          synchronize: true,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    notasRepository = moduleFixture.get<Repository<Nota>>(
      getRepositoryToken(Nota),
    );
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  afterEach(async () => {
    await notasRepository.query('DELETE FROM nota');
  });
  it('Debería crear una nota y retornarla en la respuesta', async () => {
    const nuevaNota: CreateNotaDto = {
      title: 'Nota de prueba',
      content: 'Contenido de la nota de prueba',
    };

    const respuestaCrear = await request(app.getHttpServer())
      .post('/notas')
      .send(nuevaNota);

    expect(respuestaCrear.status).toBe(201);
    expect(respuestaCrear.body.title).toEqual(nuevaNota.title);
    expect(respuestaCrear.body.content).toEqual(nuevaNota.content);
  });
  it('Debería obtener todas las notas', async () => {
    const respuestaObtener = await request(app.getHttpServer()).get('/notas');

    expect(respuestaObtener.status).toBe(200);
    expect(Array.isArray(respuestaObtener.body)).toBeTruthy();
  });
  it('Debería buscar una nota por ID', async () => {
    const nuevaNota = await notasRepository.save({
      title: 'Nota de ejemplo',
      content: 'Contenido de ejemplo',
    });

    const respuestaBuscar = await request(app.getHttpServer()).get(
      `/notas/${nuevaNota.id}`,
    );

    expect(respuestaBuscar.status).toBe(200);
    expect(respuestaBuscar.body.title).toEqual(nuevaNota.title);
  });
  it('Debería lanzar NotFoundException al no encontrar una nota por ID', async () => {
    const notaInexistente = 999;
    try {
      await request(app.getHttpServer()).get(`/notas/${notaInexistente}`);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La nota con id ${notaInexistente} no existe`);
    }
  });
  it('Deberia actualizar una noyta existente', async () => {
    const nuevaNota = await notasRepository.save({
      title: 'Nota para actualizar',
      content: 'Contenido de nota para actualizar',
    });
    const nuevaData: UpdateNotaDto = {
      title: 'Nota actualizada',
      content: 'Contenido de nota actualizada',
    };

    const respuestaActualizar = await request(app.getHttpServer())
      .put(`/notas/${nuevaNota.id}`)
      .send(nuevaData);

    expect(respuestaActualizar.status).toBe(200);
    expect(respuestaActualizar.body.title).toEqual(nuevaData.title);
    expect(respuestaActualizar.body.content).toEqual(nuevaData.content);
  });
  it('Debería lanzar NotFoundException al no encontrar una nota para modificar', async () => {
    const notaInexistente = 999;
    try {
      const nuevaData: UpdateNotaDto = {
        title: 'Nota actualizada',
        content: 'Contenido de nota actualizada',
      };
      await request(app.getHttpServer())
        .put(`/notas/${notaInexistente}`)
        .send(nuevaData);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La nota con id ${notaInexistente} no existe`);
    }
  });
  it('Debería eliminar una nota existente', async () => {
    const nuevaNota = await notasRepository.save({
      title: 'Nota para eliminar',
      content: 'Contenido de nota para eliminar',
    });
    const respuestaEliminar = await request(app.getHttpServer()).delete(
      `/notas/${nuevaNota.id}`,
    );
    expect(respuestaEliminar.status).toBe(200);
  });
  it('Debería lanzar NotFoundException al no encontrar una nota para eliminar', async () => {
    const notaInexistente = 999;
    const respuestaEliminar = await request(app.getHttpServer()).delete(
      `/notas/${notaInexistente}`,
    );
    expect(respuestaEliminar.status).toBe(404);
  });
});
