import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/utils/user.entity";

export const Roles = (...roles:UserType[])=> SetMetadata('roles',roles)
    