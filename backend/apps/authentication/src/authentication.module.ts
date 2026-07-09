import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule, RedisModule } from '@app/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { CommonConfigModule, AppConfigService, AuditInterceptor } from '@app/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CommonConfigModule,
    DatabaseModule,
    RedisModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [CommonConfigModule],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtAccessSecret,
        signOptions: {
          expiresIn: configService.jwtAccessExpiration as JwtSignOptions['expiresIn'],
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AuthenticationModule {}
