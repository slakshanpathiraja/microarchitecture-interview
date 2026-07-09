import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthenticatedUser } from '@app/common';

@Injectable()
export class ProjectManagementService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  getHello(): string {
    return 'Project Management service is online';
  }

  async createProject(createProjectDto: CreateProjectDto, user: AuthenticatedUser): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      creatorId: user.sub,
      creatorEmail: user.email,
    });
    return this.projectRepository.save(project);
  }

  async getProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.getProjectById(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.getProjectById(id);
    await this.projectRepository.remove(project);
  }
}
