import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../user.service";
import { UserType } from "src/users/entities/user.entity";
import { Request } from "express";
import { CURRENT_USER_KEY } from "src/utils/constrant";

@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
        private readonly userService: UsersService

    ) { }
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride<UserType[]>(
            'roles',
            [context.getHandler(), context.getClass()]
        )
        if (!roles || roles.length === 0) return false

        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) throw new UnauthorizedException('access denied')
        const [type, token] = authHeader.split(' ') ?? []
        if (token && type === 'Bearer') {
            try {
                const payload = await this.jwtService.verifyAsync(token,
                    { secret: this.configService.get<string>("JWT_SECRET") })
                const user = await this.userService.getCurrentUser(payload.id)
                if (user && roles.includes(user.userType)) {
                    request[CURRENT_USER_KEY] = user
                    return true
                }
            } catch (error) {
                throw new UnauthorizedException('access denied,Invalid token')
            }
        } else throw new UnauthorizedException('access denied')

        return false

    }
}