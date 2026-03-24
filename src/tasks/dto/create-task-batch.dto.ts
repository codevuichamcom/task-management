import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class CreateTaskBatchItemDto extends CreateTaskDto {
  @ApiPropertyOptional({
    example: 'row-001',
    description: 'Optional client-side reference echoed back in the batch result',
  })
  @IsOptional()
  @IsString()
  clientRef?: string;
}

export class CreateTaskBatchDto {
  @ApiProperty({
    type: [CreateTaskBatchItemDto],
    description: 'Tasks to create in a single batch request',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateTaskBatchItemDto)
  items: CreateTaskBatchItemDto[];
}
