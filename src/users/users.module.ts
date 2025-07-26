import { Module,forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './user.service';
import { ProductsModule } from 'src/products/products.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports:[forwardRef(()=> ReviewsModule)]
})
export class UsersModule {}
