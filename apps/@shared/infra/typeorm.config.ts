import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'tccdb',
  entities: [__dirname + '/../entities/*.entity.{ts,js}'],
  synchronize: true,
});
