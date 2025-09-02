import {
    Injectable,
    BadRequestException,
    NotFoundException
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "./dtos/user.register";
import * as bcrypt from "bcryptjs";
import { userLoginDto } from "./dtos/user.login";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JwtPayloadType } from "src/utils/type";
import { join } from "path";
import { unlinkSync } from "fs";
import { MailService } from "src/mails/mails.service";
import { randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private config:ConfigService,
        private authProvider:AuthProvider,

    ) { }
 
    /**
     * get current user by id account       
     * @param id number
     * @returns User
     */
    public async getCurrentUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("user Not Found")
        return user;
    }
    /**
     * get all user account
     * @param id number
     * @returns User[]
     */
    public async getAllCurrentUser(): Promise<User[]> {
        const user = await this.userRepository.find()
        if (!user) throw new BadRequestException("user Not Found");
        return user;
    }

    public async setprofileImage(userId:number,ProfileImage:string){
        const user = await this.getCurrentUser(userId)
         if(user.nameProfileImage === null) 
            user.nameProfileImage = ProfileImage
       else{
        this.removeProfileIamge(userId)
        user.nameProfileImage = ProfileImage
       }
         return await this.userRepository.save(user);
    }

    public async getProfileImage(userId:number){
        const user = await this.getCurrentUser(userId)
        return {url: process.env.BASE_URL + user.nameProfileImage};
    
    }

    public async removeProfileIamge(userId:number){
        const user = await this.getCurrentUser(userId);
      if (!user.nameProfileImage)
         throw new BadRequestException("profile image not found");

      const imagePath = join(process.cwd() , `./image/users/${user.nameProfileImage}`);
      unlinkSync(imagePath);
      user.nameProfileImage = '';

      return await this.userRepository.save(user);
    }
    public async resetPassword(){
        return this.authProvider.hashPassword
        
    }
   
}