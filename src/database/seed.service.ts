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

    const hash = async (pw: string) => bcrypt.hash(pw, 10);
    const savedUsers = await this.usersRepo.save([
      this.usersRepo.create({
        email: 'admin@test.com',
        password: await hash('Admin123!'),
        role: UserRole.ADMIN,
      }),
      this.usersRepo.create({
        email: 'alice@test.com',
        password: await hash('Alice123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'bob@test.com',
        password: await hash('Bob123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'charlie@test.com',
        password: await hash('Charlie123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'diana@test.com',
        password: await hash('Diana123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'eric@test.com',
        password: await hash('Eric123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'fiona@test.com',
        password: await hash('Fiona123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'george@test.com',
        password: await hash('George123!'),
        role: UserRole.USER,
      }),
      this.usersRepo.create({
        email: 'helen@test.com',
        password: await hash('Helen123!'),
        role: UserRole.USER,
      }),
    ]);

    const users = Object.fromEntries(savedUsers.map((user) => [user.email, user])) as Record<string, User>;

    const savedProjects = await this.projectsRepo.save([
      this.projectsRepo.create({ name: 'Alpha Project', ownerId: users['alice@test.com'].id }),
      this.projectsRepo.create({ name: 'Beta Project', ownerId: users['alice@test.com'].id }),
      this.projectsRepo.create({ name: 'Gamma Project', ownerId: users['bob@test.com'].id }),
      this.projectsRepo.create({ name: 'Delta Project', ownerId: users['charlie@test.com'].id }),
      this.projectsRepo.create({ name: 'Epsilon Ops', ownerId: users['alice@test.com'].id }),
      this.projectsRepo.create({ name: 'Zeta Mobile', ownerId: users['bob@test.com'].id }),
      this.projectsRepo.create({ name: 'Omega Finance', ownerId: users['diana@test.com'].id }),
      this.projectsRepo.create({ name: 'Sigma Analytics', ownerId: users['charlie@test.com'].id }),
      this.projectsRepo.create({ name: 'Phoenix Revamp', ownerId: users['eric@test.com'].id }),
      this.projectsRepo.create({ name: 'Sandbox Empty', ownerId: users['fiona@test.com'].id }),
      this.projectsRepo.create({ name: 'Legacy Cleanup', ownerId: users['george@test.com'].id }),
    ]);

    const projects = Object.fromEntries(savedProjects.map((project) => [project.name, project])) as Record<string, Project>;

    const createTask = (
      title: string,
      description: string,
      status: TaskStatus,
      projectName: string,
      assigneeEmail: string | null,
    ) => this.tasksRepo.create({
      title,
      description,
      status,
      projectId: projects[projectName].id,
      assigneeId: assigneeEmail ? users[assigneeEmail].id : null,
    });

    const tasks = [
      createTask('Design login screen', 'Create wireframes', TaskStatus.DONE, 'Alpha Project', 'alice@test.com'),
      createTask('Implement auth API', 'JWT login endpoint', TaskStatus.IN_PROGRESS, 'Alpha Project', 'bob@test.com'),
      createTask('Write unit tests', 'Coverage for auth module', TaskStatus.TODO, 'Alpha Project', 'alice@test.com'),
      createTask('Review login copy', 'Validate text and error wording', TaskStatus.TODO, 'Alpha Project', null),
      createTask('Setup CI/CD pipeline', 'GitHub Actions', TaskStatus.TODO, 'Beta Project', 'admin@test.com'),
      createTask('Database schema review', 'Review ERD with team', TaskStatus.IN_PROGRESS, 'Beta Project', 'charlie@test.com'),
      createTask('API documentation', 'Swagger docs for v1 endpoints', TaskStatus.TODO, 'Beta Project', null),
      createTask('API documentation', 'Add auth and task examples', TaskStatus.DONE, 'Beta Project', 'alice@test.com'),
      createTask('Frontend integration', 'Connect React to API', TaskStatus.TODO, 'Gamma Project', 'alice@test.com'),
      createTask('Performance testing', 'Load test endpoints', TaskStatus.DONE, 'Gamma Project', 'bob@test.com'),
      createTask('Fix task filters', 'Reproduce and narrow filter issues', TaskStatus.IN_PROGRESS, 'Gamma Project', 'diana@test.com'),
      createTask('Prepare demo checklist', 'Smoke checklist for sprint demo', TaskStatus.TODO, 'Gamma Project', null),
      createTask('Security audit', 'Check for vulnerabilities', TaskStatus.TODO, 'Delta Project', 'charlie@test.com'),
      createTask('Deploy to staging', 'Docker deployment', TaskStatus.IN_PROGRESS, 'Delta Project', 'bob@test.com'),
      createTask('Create regression suite', 'Prioritize critical APIs', TaskStatus.DONE, 'Delta Project', 'charlie@test.com'),
      createTask('Plan monitoring alerts', 'Define alert thresholds', TaskStatus.TODO, 'Delta Project', 'eric@test.com'),
      createTask('Batch import spec', 'Document import rules', TaskStatus.TODO, 'Epsilon Ops', 'diana@test.com'),
      createTask('Batch import verifier', 'Cross-check imported task totals', TaskStatus.IN_PROGRESS, 'Epsilon Ops', 'alice@test.com'),
      createTask('Backfill owner mapping', 'Map legacy owners to new IDs', TaskStatus.DONE, 'Epsilon Ops', 'george@test.com'),
      createTask('Prepare rollback script', 'Database fallback plan', TaskStatus.TODO, 'Epsilon Ops', null),
      createTask('Mobile push sync', 'Investigate delayed notifications', TaskStatus.IN_PROGRESS, 'Zeta Mobile', 'bob@test.com'),
      createTask('Offline mode checklist', 'Core flows for no-network mode', TaskStatus.TODO, 'Zeta Mobile', 'fiona@test.com'),
      createTask('Crash log review', 'Analyze top 20 crash signatures', TaskStatus.DONE, 'Zeta Mobile', 'eric@test.com'),
      createTask('Accessibility sweep', 'Review color contrast and labels', TaskStatus.TODO, 'Zeta Mobile', null),
      createTask('Fraud rule review', 'Validate rule matrix with finance team', TaskStatus.IN_PROGRESS, 'Omega Finance', 'diana@test.com'),
      createTask('Ledger reconciliation', 'Compare posted balances', TaskStatus.DONE, 'Omega Finance', 'charlie@test.com'),
      createTask('Settlement retry flow', 'Verify duplicate retry handling', TaskStatus.TODO, 'Omega Finance', 'alice@test.com'),
      createTask('P95 latency report', 'Summarize load test findings', TaskStatus.TODO, 'Omega Finance', 'admin@test.com'),
      createTask('Warehouse snapshot check', 'Verify nightly snapshot counts', TaskStatus.DONE, 'Sigma Analytics', 'charlie@test.com'),
      createTask('Dashboard KPI mapping', 'Cross-check source metrics', TaskStatus.IN_PROGRESS, 'Sigma Analytics', 'diana@test.com'),
      createTask('Anomaly threshold tuning', 'Adjust outlier detection rules', TaskStatus.TODO, 'Sigma Analytics', 'eric@test.com'),
      createTask('Revenue drilldown QA', 'Validate monthly drilldown totals', TaskStatus.TODO, 'Sigma Analytics', null),
      createTask('Refactor task module', 'Split service responsibilities', TaskStatus.IN_PROGRESS, 'Phoenix Revamp', 'eric@test.com'),
      createTask('Refactor task module', 'Move shared validation helpers', TaskStatus.TODO, 'Phoenix Revamp', 'bob@test.com'),
      createTask('Migration dry run', 'Test migration on staging clone', TaskStatus.DONE, 'Phoenix Revamp', 'diana@test.com'),
      createTask('Hotfix release notes', 'Draft notes for release train', TaskStatus.TODO, 'Phoenix Revamp', 'fiona@test.com'),
      createTask('Cleanup stale jobs', 'Remove old scheduler records', TaskStatus.TODO, 'Legacy Cleanup', 'george@test.com'),
      createTask('Cleanup stale jobs', 'Verify idempotent cleanup reruns', TaskStatus.IN_PROGRESS, 'Legacy Cleanup', 'alice@test.com'),
      createTask('Archive old attachments', 'Move files to cold storage', TaskStatus.DONE, 'Legacy Cleanup', 'bob@test.com'),
      createTask('Legacy permission audit', 'Review outdated permission grants', TaskStatus.TODO, 'Legacy Cleanup', null),
    ];

    await this.tasksRepo.save(tasks);

    console.log(`Database seeded successfully (${savedUsers.length} users, ${savedProjects.length} projects, ${tasks.length} tasks)`);
  }
}
