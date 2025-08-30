import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService{
constructor(private readonly mailerService:MailerService){}
    public async sendLoginEmail(email:string){
        try {
        const today= new Date()
           await this.mailerService.sendMail({
            to:email,
            from:`<no-body@mail-nestJS-app.com>`,
            subject:`Log in `,
            html:
            `
             <div>
             <h2>Hi ${email}</h2>
             <p>You Logged in to your account in ${today.toDateString()} at ${today.toLocaleTimeString()}</p>
             </div>
            
            `
           })
    } catch (error) {
        console.log(error)
        throw new RequestTimeoutException();
    }
    }
}