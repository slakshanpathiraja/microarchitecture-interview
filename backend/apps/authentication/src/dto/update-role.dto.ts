import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@app/common';

export class UpdateRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.MANAGER,
    description: 'The new role to assign to the user',
  })
  role!: UserRole;
}
