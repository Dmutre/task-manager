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
import { JwtGuard } from '../../security/jwt.guard';
import { User, UserRole } from '../../database/entities/user.entity';
import { Task } from '../../database/entities/task.entity';
import { TaskResponse } from './response/task.response';
import { RoleGuard } from 'src/security/role.guard';
import { AllowedRoles } from 'src/security/decorators/role.decorator';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(UserRole.BOSS)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Create task' })
  create(
    @Body() body: CreateTaskDto,
    @Req() request: { user: User },
  ): Promise<Task> {
    return this.taskService.create(body, request.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: [TaskResponse] })
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(
    @Req() request,
  ): Promise<Task[]> {
    return this.taskService.findAllUsersTask(request.user.id);
  }

  @Get('/boss')
  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(UserRole.BOSS)
  getAllBossTasks (
    @Req() request
  ) {
    return this.taskService.getAllTasks(request.user.id)
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Get task by id' })
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Update task' })
  update(@Param('id') id: string, @Body() body: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, body);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(UserRole.BOSS)
  @ApiOkResponse({ type: TaskResponse })
  @ApiOperation({ summary: 'Delete task' })
  delete(@Param('id') id: string): Promise<Task> {
    return this.taskService.delete(id);
  }
}
