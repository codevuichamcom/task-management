import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  // SWAGGER-MISMATCH-6: Swagger shows full object with ownerId and createdAt.
  // Actual service returns only { id, name } — ownerId and createdAt missing (BUG-12).
  @ApiResponse({ status: 201, description: 'Project created', schema: {
    example: { id: 'uuid', name: 'Alpha Project', ownerId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' },
  }})
  create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get my projects' })
  @ApiResponse({ status: 200, description: 'List of projects owned by the current user', schema: {
    example: [{ id: 'uuid', name: 'Alpha Project', ownerId: 'uuid', createdAt: '2026-01-01T00:00:00.000Z' }],
  }})
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project and all its tasks' })
  @ApiResponse({ status: 200, description: 'Project deleted', schema: {
    example: { message: 'deleted' },
  }})
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id);
  }
}
