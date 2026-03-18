import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto, ownerId: string): Promise<any> {
    const project = this.projectsRepository.create({
      name: dto.name,
      ownerId,
    });
    const saved = await this.projectsRepository.save(project);
    // BUG-12: Only returns id and name. Missing ownerId and createdAt per spec.
    return { id: saved.id, name: saved.name };
  }

  async findAll(userId: string): Promise<Project[]> {
    // BUG-3: Fetches ALL projects, no WHERE owner_id = userId filter
    // Any user can see all projects in the system
    return this.projectsRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id);
    // BUG-3: No ownership check. Any user can update any project.
    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const project = await this.findOne(id);
    // BUG-3: No ownership check.
    // BUG-6: Only deletes project row. Tasks with this projectId remain orphaned.
    await this.projectsRepository.remove(project);
    return { message: 'deleted' };
  }
}
