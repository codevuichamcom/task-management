export class QueryTaskDto {
  page?: string;   // BUG-11: kept as string, not parsed to number
  limit?: string;
  status?: string;
  projectId?: string;
}
