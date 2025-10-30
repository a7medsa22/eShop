import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Modules
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';

// Entities
import { Product } from './products/entities/products.entity';
import { User } from './users/entities/user.entity';
import { Review } from './reviews/entities/review.entity';
import { UploadsModule } from './uploads/uploads.module';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CartModule } from './cart/cart.module';
import { ProductsService } from './products/products.service';
import { Cart } from './cart/entities/cart.entity';
@Module({
  imports: [
    // Config Module (Global)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
      ThrottlerModule.forRoot([
 
         {
        
         ttl:600000, //10 Minutes
         limit:10 // 10 Requests in 10 minutes
        },
        ]),

    // Database Connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Product, User, Review,Cart],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),


    // Feature Modules
    UsersModule,
    ProductsModule,
    ReviewsModule,
    UploadsModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard,
    },

  ],
})
export class AppModule {}
