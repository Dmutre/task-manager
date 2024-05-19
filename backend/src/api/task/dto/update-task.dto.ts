import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../database/entities/task.entity';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
