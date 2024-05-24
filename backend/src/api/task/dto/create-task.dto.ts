import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../database/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the task' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: 'Start date of the task' })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'End date of the task' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'User id' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
