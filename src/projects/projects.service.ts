import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      name: dto.name,
      ownerId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { ownerId: userId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id);
    this.assertOwner(project, userId);
    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const project = await this.findOne(id);
    this.assertOwner(project, userId);
    await this.projectsRepository.remove(project);
    return { message: 'deleted' };
  }

  private assertOwner(project: Project, userId: string) {
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }
  }
}
