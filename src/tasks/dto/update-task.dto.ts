import { IsString, IsOptional } from 'class-validator';
// BUG-2: Missing @IsEnum(TaskStatus) on status field
// Any string value accepted, TypeORM will throw DB error instead of clean 400

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  // No @IsEnum(TaskStatus) here — intentional bug
  status?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
