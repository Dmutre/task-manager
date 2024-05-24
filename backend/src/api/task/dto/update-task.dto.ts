import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../database/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Status of the task' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
