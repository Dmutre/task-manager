import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from '../../database/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create(data: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      user: { id: user.id },
    });
    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  update(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = this.taskRepository.findOneBy({ id });
    return this.taskRepository.save({
      ...task,
      ...data,
    });
  }

  async delete(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    return this.taskRepository.remove(task);
  }
}
