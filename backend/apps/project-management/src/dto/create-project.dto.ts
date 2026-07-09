import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Microservices Redesign' })
  name!: string;

  @ApiProperty({ example: 'Migrate the legacy monolith to a microservices architecture.', required: false })
  description?: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.PLANNING, required: false })
  status?: ProjectStatus;
}
