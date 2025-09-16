import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'apps/ms-auth/src/modules/auth/entities/auth.entity';
import { Catalog } from 'apps/ms-catalog/src/modules/catalog/entities/catalog.entity';
import { Notification } from 'apps/ms-notification/src/modules/notification/entities/notification.entity';
import { Order } from 'apps/ms-order/src/modules/order/entities/order.entity';

export const TypeOrmConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'tccdb',
  entities: [Order, Auth, Catalog, Notification],
  synchronize: true,
});
