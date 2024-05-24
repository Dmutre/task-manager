import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { In, Repository } from 'typeorm';
import { Task } from '../../database/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  create(data: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      user: { id: data.userId },
    });
    return this.taskRepository.save(task);
  }

  findAllUsersTask(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  async getAllTasks (bossId: string) {
    const boss = await this.userRepo.findOneBy({ id: bossId })

    if(!boss)
      throw new NotFoundException();

    const employees: User[] = await this.userRepo.find({ where: { boss: boss } });

    const employeeIds = employees.map(employee => employee.id);

    const tasks = await this.taskRepository.find({ where: { user: { id: In(employeeIds) } } });

    return tasks;
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    task.status = data.status;
    return this.taskRepository.save(task);
  }

  async delete(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    return this.taskRepository.remove(task);
  }
}
