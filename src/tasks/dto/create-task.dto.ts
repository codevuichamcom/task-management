import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login screen', description: 'The task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Detailed description of the work' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: 'a3f1c2d4-89ab-4cde-b012-3456789abcde', description: 'UUID of the project' })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({ example: 'a3f1c2d4-89ab-4cde-b012-3456789abcde' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
