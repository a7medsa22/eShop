import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from './products/products.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ReviewsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>("DB_HOST"),
          port: config.get<number>("DB_PORT"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          database: config.get<string>("DB_DATABASE"),
          entities: [Product],
          synchronize: process.env.NODE_ENV !== 'production'
        }
      }

    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    })
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
