import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../database/entities/task.entity';

export class TaskResponse {
  @ApiProperty({ description: 'Task id' })
  id: string;

  @ApiProperty({ description: 'Task title' })
  title: string;

  @ApiProperty({ description: 'Task description' })
  description?: string;

  @ApiProperty({ description: 'Task status' })
  status: TaskStatus;

  @ApiProperty({ description: 'Task start date' })
  startDate?: Date;

  @ApiProperty({ description: 'Task end date' })
  endDate?: Date;
}
