import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement Authentication Guard' })
  title!: string;

  @ApiProperty({ example: 'Create JwtAuthGuard and AuthorizationGuard.', required: false })
  description?: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM, required: false })
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO, required: false })
  status?: TaskStatus;

  @ApiProperty({ example: 'user-uuid-123', required: false })
  assignedUserId?: string;

  @ApiProperty({ example: 'assignee@example.com', required: false })
  assignedUserEmail?: string;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  deadline?: Date;
}
