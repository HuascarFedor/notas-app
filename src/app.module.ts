import { Module } from '@nestjs/common';
import { NotasModule } from './notas/notas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './notas/nota.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notas_db',
      entities: [Nota],
      synchronize: true,
    }),
    NotasModule,
  ],
})
export class AppModule {}
