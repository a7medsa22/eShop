import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Modules
import { UsersModule } from '../src/users/users.module';
import { ProductsModule } from '../src/products/products.module';
import { ReviewsModule } from '../src/reviews/reviews.module';
import { CartModule } from '../src/cart/cart.module';

// Entities
import { Product } from '../src/products/entities/products.entity';
import { User } from '../src/users/entities/user.entity';
import { Review } from '../src/reviews/entities/review.entity';
import { Cart } from '../src/cart/entities/cart.entity';

// Guards / Interceptors
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    // Config (fake / minimal)
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),

    // SQLite In-Memory DB
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Product, User, Review, Cart],
      synchronize: true,
      dropSchema: true,
    }),

    // Feature Modules (نفس الحقيقي)
    UsersModule,
    ProductsModule,
    ReviewsModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // تعطيل الـ Throttling في التست
    {
      provide: APP_GUARD,
      useValue: {
        canActivate: () => true,
      },
    },
  ],
})
export class TestAppModule {}
