import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mails.service";

@Module({
    imports:[MailerModule.forRootAsync({
        inject:[ConfigService],
        useFactory:(config:ConfigService)=>{
            return{
                transport:{
                    host:config.get<string>("SMTP_HOST"),
                    port:config.get<number>("SMTP_PORT"),
                    secure:false, // https in production mood
                    auth:{
                        user:config.get<string>("SMTP_USER"),
                        pass:config.get<string>("SMTP_PASS"),
                    }
                }
            }
        }
    })],
    providers:[MailService],
    exports:[MailService]
})
export class MailsModule {}