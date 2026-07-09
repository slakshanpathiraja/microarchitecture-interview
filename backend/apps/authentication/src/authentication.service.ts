import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AppConfigService, UserRole } from '@app/common';
import { RedisService } from '@app/db';
import * as bcrypt from 'bcrypt';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly redisService: RedisService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'password'> }> {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    // Save refresh token to Redis
    await this.redisService.set(
      `refresh_token:${user.id}`,
      tokens.refreshToken,
      this.parseExpirationToSeconds(this.appConfigService.jwtRefreshExpiration),
    );

    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'password'> }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    // Save refresh token to Redis
    await this.redisService.set(
      `refresh_token:${user.id}`,
      tokens.refreshToken,
      this.parseExpirationToSeconds(this.appConfigService.jwtRefreshExpiration),
    );

    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'password'> }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.appConfigService.jwtRefreshSecret,
      });

      const userId = payload.sub;
      const storedToken = await this.redisService.get(`refresh_token:${userId}`);

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newTokens = await this.generateTokens(user);
      const { password: _, ...userWithoutPassword } = user;

      // Update refresh token in Redis
      await this.redisService.set(
        `refresh_token:${user.id}`,
        newTokens.refreshToken,
        this.parseExpirationToSeconds(this.appConfigService.jwtRefreshExpiration),
      );

      return {
        ...newTokens,
        user: userWithoutPassword,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.appConfigService.jwtRefreshSecret,
      });
      await this.redisService.delete(`refresh_token:${payload.sub}`);
    } catch {
      // Ignore errors if token is already expired or invalid
    }
  }

  async getProfile(token: string): Promise<Omit<User, 'password'>> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.jwtAccessSecret,
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password: _, ...profile } = user;
      return profile;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async getProfileById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({ where: { email: updateProfileDto.email } });
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateProfileDto.email;
    }

    if (updateProfileDto.firstName !== undefined) {
      user.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      user.lastName = updateProfileDto.lastName;
    }

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...profile } = savedUser;
    return profile;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Object.values(UserRole).includes(role)) {
      throw new ConflictException('Invalid user role');
    }

    user.role = role;
    const savedUser = await this.userRepository.save(user);
    const { password: _, ...profile } = savedUser;
    return profile;
  }

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password: _, ...profile }) => profile);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpiration as JwtSignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpiration as JwtSignOptions['expiresIn'],
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private parseExpirationToSeconds(expiration: string | number): number {
    if (typeof expiration === 'number') {
      return expiration;
    }
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60; // 7 days default
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 7 * 24 * 60 * 60;
    }
  }
}
