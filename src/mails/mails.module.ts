import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mails.service";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { join } from "path";
import { strict } from "assert";

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
                    
                },
                defaults:{
                    from:config.get<string>("SMTP_FROM"),
                },
                template:{
                    dir: join(process.cwd(), 'src', 'mails', 'templates'), // 👈 خليها على src
                    adapter: new HandlebarsAdapter(),
                    options:{
                        strict:true,
                    }
                
                }
            }
        }
        ,
    }),],
    providers:[MailService],
    exports:[MailService]
})
export class MailsModule {}