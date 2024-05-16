import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Token } from './token.entity';

export enum UserRole {
  BOSS = 'BOSS',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'bool', default: false })
  emailApproved: boolean;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @ManyToOne(() => User, (user) => user.children, { nullable: true })
  boss: User;

  @OneToMany(() => User, (user) => user.boss)
  children: User[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
