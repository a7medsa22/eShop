import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewService{
    public getAll() {
        return [
            { id: 1, name: "hamada", rate: 4 },
            { id: 2, name: "Nada", rate: 3.5 }
        ]
    }
}