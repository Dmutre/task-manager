import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  value: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;

  @Column({ type: 'timestamp', default: new Date() })
  createdAt: Date;
}
