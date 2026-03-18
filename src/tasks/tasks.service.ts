import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status || TaskStatus.TODO,
      projectId: dto.projectId,
      assigneeId: dto.assigneeId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(query: QueryTaskDto) {
    const page = query.page;   // BUG-11: string not parsed
    const limit = parseInt(query.limit) || 10;
    const pageNum = parseInt(page) || 1;

    // BUG-8: offset = page * limit instead of (page - 1) * limit
    // page=1 skips first 'limit' rows, page=0 returns first page
    const offset = pageNum * limit;

    const qb = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee')
      // BUG-7: Extra join on same relation with different alias causes duplicate rows
      .leftJoin('task.project', 'p2');

    if (query.status) {
      // BUG-9: Uses ILIKE with wildcard — 'DO' matches both 'TODO' and 'DONE'
      qb.andWhere('task.status ILIKE :status', { status: `%${query.status}%` });
    }

    if (query.projectId) {
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }

    qb.skip(offset).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      meta: {
        // BUG-11: page returned as string type (from query param, never parsed)
        page: query.page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id);
    // BUG-4: No check that userId owns the task's project
    // BUG-5: Flipped status transition — when IN_PROGRESS is set, it becomes TODO
    if (dto.status === 'IN_PROGRESS') {
      task.status = TaskStatus.TODO;
    } else if (dto.status) {
      task.status = dto.status as TaskStatus;
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.assigneeId !== undefined) task.assigneeId = dto.assigneeId;

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.findOne(id);
    // BUG-4: No ownership check — any authenticated user can delete any task
    await this.tasksRepository.remove(task);
    return { message: 'deleted' };
  }
}
