import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskBatchDto } from './dto/create-task-batch.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('batch')
  @ApiOperation({ summary: 'Create multiple tasks in one batch request' })
  @ApiResponse({ status: 200, description: 'Batch processed', schema: {
    example: {
      total: 3,
      createdCount: 2,
      failedCount: 1,
      results: [
        {
          index: 0,
          clientRef: 'row-001',
          ok: true,
          taskId: 'uuid',
          title: 'Batch import row 1',
          projectId: 'uuid',
          status: 'TODO',
        },
        {
          index: 1,
          clientRef: 'row-002',
          ok: false,
          error: 'Project not found',
        },
      ],
    },
  }})
  createBatch(@Body() dto: CreateTaskBatchDto, @Request() req) {
    return this.tasksService.createBatch(dto, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created', schema: {
    example: {
      id: 'uuid',
      title: 'Implement login screen',
      description: 'Create the login UI',
      status: 'TODO',
      projectId: 'uuid',
      assigneeId: 'uuid',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  }})
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with pagination and optional status filter' })
  @ApiResponse({ status: 200, description: 'Paginated task list', schema: {
    example: {
      data: [{ id: 'uuid', title: 'Implement login screen', status: 'TODO', projectId: 'uuid' }],
      meta: { page: 1, limit: 10, total: 25 },
    },
  }})
  findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted', schema: {
    example: { message: 'deleted' },
  }})
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}
