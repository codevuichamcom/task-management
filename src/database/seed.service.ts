import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task, TaskStatus } from '../tasks/entities/task.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.usersRepo.count();
    if (count > 0) return; // Skip if already seeded

    // Create users
    const hash = async (pw: string) => bcrypt.hash(pw, 10);

    const admin = await this.usersRepo.save(this.usersRepo.create({
      email: 'admin@test.com',
      password: await hash('Admin123!'),
      role: UserRole.ADMIN,
    }));
    const alice = await this.usersRepo.save(this.usersRepo.create({
      email: 'alice@test.com',
      password: await hash('Alice123!'),
      role: UserRole.USER,
    }));
    const bob = await this.usersRepo.save(this.usersRepo.create({
      email: 'bob@test.com',
      password: await hash('Bob123!'),
      role: UserRole.USER,
    }));
    const charlie = await this.usersRepo.save(this.usersRepo.create({
      email: 'charlie@test.com',
      password: await hash('Charlie123!'),
      role: UserRole.USER,
    }));

    // Create projects
    const alphaProject = await this.projectsRepo.save(this.projectsRepo.create({
      name: 'Alpha Project',
      ownerId: alice.id,
    }));
    const betaProject = await this.projectsRepo.save(this.projectsRepo.create({
      name: 'Beta Project',
      ownerId: alice.id,
    }));
    const gammaProject = await this.projectsRepo.save(this.projectsRepo.create({
      name: 'Gamma Project',
      ownerId: bob.id,
    }));
    const deltaProject = await this.projectsRepo.save(this.projectsRepo.create({
      name: 'Delta Project',
      ownerId: charlie.id,
    }));

    // Create tasks
    await this.tasksRepo.save([
      this.tasksRepo.create({ title: 'Design login screen', description: 'Create wireframes', status: TaskStatus.DONE, projectId: alphaProject.id, assigneeId: alice.id }),
      this.tasksRepo.create({ title: 'Implement auth API', description: 'JWT login endpoint', status: TaskStatus.IN_PROGRESS, projectId: alphaProject.id, assigneeId: bob.id }),
      this.tasksRepo.create({ title: 'Write unit tests', description: 'Coverage for auth module', status: TaskStatus.TODO, projectId: alphaProject.id, assigneeId: alice.id }),
      this.tasksRepo.create({ title: 'Setup CI/CD pipeline', description: 'GitHub Actions', status: TaskStatus.TODO, projectId: betaProject.id, assigneeId: admin.id }),
      this.tasksRepo.create({ title: 'Database schema review', description: 'Review ERD with team', status: TaskStatus.IN_PROGRESS, projectId: betaProject.id, assigneeId: charlie.id }),
      this.tasksRepo.create({ title: 'API documentation', description: 'Swagger docs', status: TaskStatus.TODO, projectId: betaProject.id, assigneeId: null }),
      this.tasksRepo.create({ title: 'Frontend integration', description: 'Connect React to API', status: TaskStatus.TODO, projectId: gammaProject.id, assigneeId: alice.id }),
      this.tasksRepo.create({ title: 'Performance testing', description: 'Load test endpoints', status: TaskStatus.DONE, projectId: gammaProject.id, assigneeId: bob.id }),
      this.tasksRepo.create({ title: 'Security audit', description: 'Check for vulnerabilities', status: TaskStatus.TODO, projectId: deltaProject.id, assigneeId: charlie.id }),
      this.tasksRepo.create({ title: 'Deploy to staging', description: 'Docker deployment', status: TaskStatus.IN_PROGRESS, projectId: deltaProject.id, assigneeId: bob.id }),
    ]);

    console.log('Database seeded successfully');
  }
}
