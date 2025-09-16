import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'catalogs' })
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  // Add real fields as you define them in DTOs/services
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
