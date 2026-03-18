import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTaskDto {
  @ApiPropertyOptional({ example: 1, type: Number, description: 'Page number (1-indexed)' })
  page?: string; // BUG-11: kept as string, not parsed to number

  @ApiPropertyOptional({ example: 10, type: Number })
  limit?: string;

  // SWAGGER-MISMATCH-5: Documented as "statusFilter" but actual query param is "status".
  // QA using ?statusFilter=TODO will get unfiltered results (param silently ignored).
  @ApiPropertyOptional({
    name: 'statusFilter',
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    example: 'TODO',
    description: 'Filter tasks by status. Use "statusFilter" param.',
  })
  status?: string;

  @ApiPropertyOptional({ example: 'a3f1c2d4-89ab-4cde-b012-3456789abcde' })
  projectId?: string;
}
