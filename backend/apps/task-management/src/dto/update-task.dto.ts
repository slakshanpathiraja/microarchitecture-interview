import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Implement Authentication Guard (Updated)', required: false })
  title?: string;

  @ApiProperty({ example: 'Updated description.', required: false })
  description?: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, required: false })
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, required: false })
  status?: TaskStatus;

  @ApiProperty({ example: 'user-uuid-456', required: false })
  assignedUserId?: string;

  @ApiProperty({ example: 'new-assignee@example.com', required: false })
  assignedUserEmail?: string;

  @ApiProperty({ example: '2026-11-30T23:59:59.000Z', required: false })
  deadline?: Date;
}
