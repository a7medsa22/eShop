import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { log } from "console";

@Injectable()
export class MailService{
constructor(private readonly mailerService:MailerService){}
    public async sendLoginEmail(email:string){
        try {
        const today= new Date().toLocaleString();
           await this.mailerService.sendMail({
            to:email,
            subject:`New Login Detected`,
            template:"login",
            context:{
                email,today},
           })
    } catch (error) {
        console.log(error)
        throw new RequestTimeoutException();
    }
    }
    public async sendVerifyEmailTempleate(email:string,link:string){
        try {
           await this.mailerService.sendMail({
            to:email,
            subject:`singup to your account`,
             template:"verify-email",
            context:{
                email,link},
           })
    } catch (error) {
        console.log(error)
        throw new RequestTimeoutException();
    }
    }

    public async sendResetPasswordEmail(email:string,resetLink:string){
        try {
            await this.mailerService.sendMail({
                to:email,
                subject:`Reset Password`,
                template:"resetPassword",
                context:{
                    email,resetLink},
            })
            
        } catch (error) {
         console.log(error);
         throw new RequestTimeoutException();
        }
    }
}