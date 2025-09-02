import {
    Injectable,
    BadRequestException,
    NotFoundException,
    Inject,
    forwardRef
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
import { UsersService } from "./user.service";
import { resetPasswordDto } from "./dtos/user.resetPassword";

@Injectable()
export class AuthProvider {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
         @Inject(forwardRef(() => UsersService))
        private userService:UsersService,
        private mailService:MailService,
        private config:ConfigService

    ) { }

     /**
     * create new register account
     * @param registerDto UserRegisterDto
     * @returns JWT Token
     */
        public async register(registerDto: UserRegisterDto){
            const { username, email, password } = registerDto;
            const user = await this.userRepository.findOne({ where: { email } })
            if (user) throw new BadRequestException('email already exists')
    
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
    
            let newUser = this.userRepository.create({
                username,
                email,
                password: hashPassword,
                verificationToken:randomBytes(32).toString('hex'),
            });
            await this.userRepository.save(newUser);
               const link = `${this.config.get<string>("BASE_URL2")}/api/users/verify/${newUser.id}/${newUser.verificationToken}`
          await this.mailService.sendVerifyEmailTempleate(newUser.email,link);
            return { message:"Verification token has been sent to your email" };
        }

        /**
         * login user account
         * @param loginDto userLoginDto
         * @returns JWT Token
         */
            public async login(loginDto: userLoginDto) {
                const { email, password } = loginDto
                const user = await this.userRepository.findOne({ where: { email } })
                if (!user) throw new BadRequestException("Invalid email or password");
        
                const isPasswordMatch = await bcrypt.compare(password, user.password)
                if (!isPasswordMatch) throw new BadRequestException("Invalid email or password");
        
                if(!user.isAccountVerified){
                    let verify = user.verificationToken;
                    if(verify === null){
                     user.verificationToken = randomBytes(32).toString('hex');
                     const resulte = await this.userRepository.save(user);
                     verify = resulte.verificationToken
                    }
                 const link = `${this.config.get<string>("BASE_URL2")}/api/users/verify/${user.id}/${verify}`
                 await this.mailService.sendVerifyEmailTempleate(user.email,link);
                      return { message:"Verification token has been sent to your email" };
        
                }
        
                const accessToken = await this.createToken({ id: user.id, userType: user.userType })
                return { accessToken };
            }

         public async verifyEmail(userId:number,token: string) {
          const user = await this.userService.getCurrentUser(userId);
           if(user.verificationToken === null) 
            throw new BadRequestException("User is already verified");
           if(user.verificationToken !== token) 
            throw new BadRequestException("Invalid Token"); 

           
           user.verificationToken = null;
            user.isAccountVerified = true;
            await this.userRepository.save(user);
            return {message: "Email verified successfully,please login to continue"};
    }

       // send reset link
    public async sendResetPasswordLink(email:string){
        const user = await this.findUserByEmail(email);
        if(!user) throw new NotFoundException("User not found");
       
        const token = randomBytes(32).toString('hex');
        user.resetPasswordToken = token
        user.resetPasswordExpires = new Date (Date.now() + 3600000)
     await this.userRepository.save(user);

        const link = `${this.config.get<string>("BASE_URL2")}/api/users/reset-password/?token=${token}`
        await this.mailService.sendResetPasswordEmail(user.email,link);
        return {message: "Reset password link has been sent to your email" };
    }
   
    public async getResetPasswordLink(userId:number,token:string){
        const user = await this.userService.getCurrentUser(userId);
        if(user.resetPasswordToken  === null || user.resetPasswordToken !== token){
            throw new BadRequestException("Invalid Token");
        }  
        return {message: "password reset link now available,can you change your password now"};
    }

      //reset password
    public async resetPassword(token:string,newPassword:string){
        const user = await this.userRepository.findOne({where:{resetPasswordToken:token}});

        if(!user|| !user.resetPasswordExpires || user.resetPasswordExpires.getTime() <  Date.now()){
           throw new BadRequestException("Invalid or expired reset token");
       }  

       const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword,salt);
       user.resetPasswordToken = null;
       user.resetPasswordExpires = null;
       await this.userRepository.save(user);
       return {message: "Password reset successfully,please login to continue"};       
    }
         
          
        
    public async findUserByEmail(email:string){
        const user = await this.userRepository.findOne({where:{email}});
        if(!user) throw new NotFoundException("User not found");

        return user;
    }
        
   
            
    /**
 * create token account
 * @param payload JwtPayloadType
 * @returns string
 */
    private createToken(payload: JwtPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload)
    }



}