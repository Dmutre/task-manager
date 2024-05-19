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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../security/JwtGuard';
import { User } from '../../database/entities/user.entity';
import { Task } from '../../database/entities/task.entity';
import { TaskResponse } from './response/task.response';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Create task' })
  create(
    @Body() body: CreateTaskDto,
    @Req() request: { user: User },
  ): Promise<Task> {
    return this.taskService.create(body, request.user);
  }

  @Get()
  @ApiOkResponse({ type: [TaskResponse] })
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Get task by id' })
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Update task' })
  update(@Param('id') id: string, @Body() body: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Delete task' })
  delete(@Param('id') id: string): Promise<Task> {
    return this.taskService.delete(id);
  }
}
