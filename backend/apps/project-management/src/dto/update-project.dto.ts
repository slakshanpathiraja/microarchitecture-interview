import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Microservices Redesign (Updated)', required: false })
  name?: string;

  @ApiProperty({ example: 'Updated project description.', required: false })
  description?: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE, required: false })
  status?: ProjectStatus;
}
