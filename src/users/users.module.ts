import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../utils/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { Reflector } from '@nestjs/core';

@Module({
    controllers: [UsersController],
    providers: [UsersService, AuthGuard, AuthRoleGuard],
    exports :[UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions: {
                        expiresIn: config.get<string>('JWT_EXPIRED_IN')
                    }
                }
            }
        })
    ]
})
export class UsersModule { }
