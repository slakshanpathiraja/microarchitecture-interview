import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjectManagementService } from './project-management.service';
import { JwtAuthGuard, Authorization, AuthenticatedUser, AuditLog, AuditActionType } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectManagementController {
  constructor(private readonly projectManagementService: ProjectManagementService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.PROJECT_CREATION,
    details: (req, res) => `Created project: ${res.name} (ID: ${res.id})`,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.projectManagementService.createProject(createProjectDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  async getProjects(@Authorization() user: AuthenticatedUser) {
    return this.projectManagementService.getProjects();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async getProjectById(
    @Param('id') id: string,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.projectManagementService.getProjectById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.USER_ACTION,
    details: (req) => `Updated project ID: ${req.params.id}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project information' })
  @ApiResponse({ status: 200, description: 'Project successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.projectManagementService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.USER_ACTION,
    details: (req) => `Deleted project ID: ${req.params.id}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async deleteProject(
    @Param('id') id: string,
    @Authorization() user: AuthenticatedUser,
  ) {
    await this.projectManagementService.deleteProject(id);
    return { message: 'Project successfully deleted' };
  }
}
