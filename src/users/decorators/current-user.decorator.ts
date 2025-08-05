import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { CURRENT_USER_KEY } from "src/utils/constrant";
import { JwtPayloadType } from "src/utils/type";

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const payload: JwtPayloadType = request[CURRENT_USER_KEY]
    return payload
})

