import { Module } from '@nestjs/common';
import { NotasModule } from './notas/notas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './notas/nota.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notas_db',
      entities: [Nota, User],
      synchronize: true,
    }),
    NotasModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
