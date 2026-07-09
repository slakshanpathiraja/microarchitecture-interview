import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: false })
  lastName?: string;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user', required: false })
  email?: string;
}
