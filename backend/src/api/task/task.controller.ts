import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../security/JwtGuard';
import { User } from '../../database/entities/user.entity';
import { Task } from '../../database/entities/task.entity';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() body: CreateTaskDto,
    @Req() req: { user: User },
  ): Promise<Task> {
    return this.taskService.create(body, req.user);
  }

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() body: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string): Promise<Task> {
    return this.taskService.delete(id);
  }
}
