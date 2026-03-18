import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  // Response example uses "taskName" and numeric projectId — matches SWAGGER-MISMATCH-2/3 in DTO
  @ApiResponse({ status: 201, description: 'Task created', schema: {
    example: {
      id: 'uuid',
      taskName: 'Implement login screen',
      description: 'Create the login UI',
      status: 'TODO',
      projectId: 42,
      assigneeId: 'uuid',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  }})
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with pagination and optional status filter' })
  // meta.page shown as number here; actual response returns it as string (BUG-11)
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
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted', schema: {
    example: { message: 'deleted' },
  }})
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id);
  }
}
