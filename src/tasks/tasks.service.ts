import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    await this.ensureProjectExists(dto.projectId);
    await this.ensureAssigneeExists(dto.assigneeId);

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
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;
    const statusFilter = query.statusFilter ?? query.status;

    const qb = this.tasksRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .orderBy('task.createdAt', 'ASC');

    if (statusFilter) {
      qb.andWhere('task.status = :status', { status: statusFilter });
    }

    if (query.projectId) {
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }

    qb.skip(offset).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      meta: {
        page,
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
    const task = await this.findOneForAuthorization(id);
    this.assertCanMutate(task, userId);
    await this.ensureAssigneeExists(dto.assigneeId);

    if (dto.status) task.status = dto.status;
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.assigneeId !== undefined) task.assigneeId = dto.assigneeId;

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.findOneForAuthorization(id);
    this.assertCanMutate(task, userId);
    await this.tasksRepository.remove(task);
    return { message: 'deleted' };
  }

  private async ensureProjectExists(projectId: string) {
    const project = await this.projectsRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  private async ensureAssigneeExists(assigneeId?: string) {
    if (!assigneeId) return;

    const user = await this.usersRepository.findOne({ where: { id: assigneeId } });
    if (!user) {
      throw new NotFoundException('Assignee not found');
    }
  }

  private async findOneForAuthorization(id: string): Promise<Task & { project: Project }> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task as Task & { project: Project };
  }

  private assertCanMutate(task: Task & { project: Project }, userId: string) {
    const isProjectOwner = task.project?.ownerId === userId;
    const isAssignee = task.assigneeId === userId;

    if (!isProjectOwner && !isAssignee) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}
