import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskManagementService } from './task-management.service';
import { JwtAuthGuard, Authorization, AuthenticatedUser, AuditLog, AuditActionType } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskManagementController {
  constructor(private readonly taskManagementService: TaskManagementService) {}

  @Get('hello')
  @UseGuards(JwtAuthGuard)
  getHello(@Authorization() user: AuthenticatedUser): string {
    return this.taskManagementService.getHello();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.taskManagementService.createTask(createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  async getTasks(@Authorization() user: AuthenticatedUser) {
    return this.taskManagementService.getTasks();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async getTaskById(
    @Param('id') id: string,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.taskManagementService.getTaskById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.TASK_UPDATE,
    details: (req) => `Updated task ID: ${req.params.id}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.taskManagementService.updateTask(id, updateTaskDto);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.TASK_UPDATE,
    details: (req) => `Assigned task ID: ${req.params.id} to user ${req.body.assignedUserEmail}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({ status: 200, description: 'Task successfully assigned.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async assignTask(
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.taskManagementService.assignTask(id, assignTaskDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.TASK_UPDATE,
    details: (req) => `Updated status of task ID: ${req.params.id} to ${req.body.status}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task workflow status' })
  @ApiResponse({ status: 200, description: 'Task status successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.taskManagementService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({
    action: AuditActionType.USER_ACTION,
    details: (req) => `Deleted task ID: ${req.params.id}`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async deleteTask(
    @Param('id') id: string,
    @Authorization() user: AuthenticatedUser,
  ) {
    await this.taskManagementService.deleteTask(id);
    return { message: 'Task successfully deleted' };
  }
}
