import { Controller, Get, Post, Put, Patch, Body, Param, HttpCode, HttpStatus, Headers, UnauthorizedException, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, AuthorizationGuard, Authorize, UserRole, Authorization, AuthenticatedUser, AuditLog, AuditActionType } from '@app/common';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('register')
  @AuditLog({ action: AuditActionType.USER_ACTION, details: (req) => `User registered with email: ${req.body.email}` })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered. Access and refresh tokens returned.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('login')
  @AuditLog({ action: AuditActionType.LOGIN, details: 'User logged in successfully' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in user and retrieve tokens' })
  @ApiResponse({ status: 200, description: 'Successfully logged in. Access and refresh tokens returned.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken, user } = await this.authenticationService.login(loginDto);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authenticationService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  async logout(
    @Body('refreshToken') refreshToken: string,
  ) {
    await this.authenticationService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.GENERAL_USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile from access token' })
  @ApiResponse({ status: 200, description: 'Profile data retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  async getProfile(
    @Authorization() user: AuthenticatedUser,
  ) {
    return this.authenticationService.getProfileById(user.sub);
  }

  @Put('profile')
  @AuditLog({ action: AuditActionType.USER_ACTION, details: 'User updated profile' })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.GENERAL_USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile completely (PUT)' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async updateProfilePut(
    @Authorization() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authenticationService.updateProfile(user.sub, updateProfileDto);
  }

  @Patch('profile')
  @AuditLog({ action: AuditActionType.USER_ACTION, details: 'User updated profile' })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.GENERAL_USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile partially (PATCH)' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async updateProfilePatch(
    @Authorization() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authenticationService.updateProfile(user.sub, updateProfileDto);
  }

  @Patch('users/:id/role')
  @ApiTags('admin')
  @AuditLog({ action: AuditActionType.USER_ACTION, details: (req) => `Admin updated user ${req.params.id} role to ${req.body.role}` })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a user's role (Admin only)" })
  @ApiResponse({ status: 200, description: 'Role successfully updated.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 403, description: 'Access denied: administrator role required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.authenticationService.updateUserRole(userId, updateRoleDto.role);
  }

  @Get('users')
  @ApiTags('admin')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 403, description: 'Access denied: administrator role required.' })
  async getUsers() {
    return this.authenticationService.getUsers();
  }
}
