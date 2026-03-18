import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  // BUG-1: Missing @IsNotEmpty() — empty title accepted (no global ValidationPipe anyway)
  // SWAGGER-MISMATCH-2: Swagger documents this field as "taskName" but actual field is "title".
  // QA sending { "taskName": "..." } will get 201 with null title in DB.
  @ApiProperty({ name: 'taskName', example: 'Implement login screen', description: 'The task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Detailed description of the work' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  // SWAGGER-MISMATCH-3: Swagger shows projectId as type number (integer),
  // but actual implementation expects a UUID string.
  // QA sending a numeric value will hit a DB error, not a 400.
  @ApiProperty({ type: Number, example: 42, description: 'ID of the project (integer)' })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({ example: 'a3f1c2d4-89ab-4cde-b012-3456789abcde' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
