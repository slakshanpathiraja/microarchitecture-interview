import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({ example: 'user-uuid-123' })
  assignedUserId!: string;

  @ApiProperty({ example: 'assignee@example.com' })
  assignedUserEmail!: string;
}
