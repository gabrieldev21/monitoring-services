import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 150, nullable: true, select: false })
  passwordHash?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  refreshTokenHash?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
