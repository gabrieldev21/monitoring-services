import { Catalog } from 'apps/ms-catalog/src/modules/catalog/entities/catalog.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Catalog, (catalog) => catalog.orders, { eager: true })
  @JoinTable({ name: 'order_products' })
  products: Catalog[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
