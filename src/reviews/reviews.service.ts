import { Injectable,Inject,forwardRef } from "@nestjs/common";
import { UsersService } from "src/users/user.service";

@Injectable()
export class ReviewService {
    constructor(@Inject(forwardRef( () => UsersService))
    private readonly userService: UsersService
    ){}

    public getAll() {
        return [
            { id: 1, name: "hamada", rate: 4 },
            { id: 2, name: "Nada", rate: 3.5 }
        ]
    }
}