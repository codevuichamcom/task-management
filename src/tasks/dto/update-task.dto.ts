import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// BUG-2: Missing @IsEnum(TaskStatus) on status field
// Any string value accepted, TypeORM will throw DB error instead of clean 400

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    example: 'IN_PROGRESS',
    description: 'New status for the task',
  })
  @IsOptional()
  // No @IsEnum(TaskStatus) here — intentional bug
  status?: string;

  // SWAGGER-MISMATCH-4: Shown as required (@ApiProperty, no Optional marker).
  // Actual code marks it @IsOptional() — omitting it is fine.
  // QA may expect 400 when assigneeId is missing — actual: 200.
  @ApiProperty({ example: 'a3f1c2d4-89ab-4cde-b012-3456789abcde', description: 'Required. UUID of the assignee.' })
  @IsOptional()
  @IsString()
  assigneeId?: string;
}
