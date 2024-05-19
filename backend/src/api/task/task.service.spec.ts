import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../../database/entities/task.entity';
import { User, UserRole } from '../../database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepositoryMock: Repository<Task>;

  const mockTask: Task = {
    id: '1',
    title: 'title',
    description: 'description',
    status: TaskStatus.OPEN,
    startDate: new Date(),
    endDate: new Date(),
    user: { id: '1' } as User,
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    emailApproved: true,
    role: UserRole.BOSS,
    username: 'TestUser',
  };

  const mockTaskRepository = {
    create: jest.fn().mockReturnValue(mockTask),
    save: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn().mockResolvedValue([mockTask]),
    findOneBy: jest.fn().mockResolvedValue(mockTask),
    remove: jest.fn().mockResolvedValue(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepositoryMock = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'title',
      description: 'description',
      startDate: new Date(),
      endDate: new Date(),
    };

    const result = await service.create(createTaskDto, mockUser);

    expect(taskRepositoryMock.create).toHaveBeenCalledWith({
      ...createTaskDto,
      user: { id: mockUser.id },
    });
    expect(taskRepositoryMock.save).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);
  });

  it('should return all tasks', async () => {
    const result = await service.findAll();
    expect(taskRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([mockTask]);
  });

  it('should return a single task', async () => {
    const result = await service.findOne('1');
    expect(taskRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(mockTask);
  });

  it('should update a task', async () => {
    const updateTaskDto: UpdateTaskDto = {
      status: TaskStatus.CLOSED,
    };

    const result = await service.update('1', updateTaskDto);
    expect(result).toEqual({ ...mockTask, status: TaskStatus.CLOSED });
  });

  it('should delete a task', async () => {
    const result = await service.delete('1');

    expect(taskRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(taskRepositoryMock.remove).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);
  });
});
