import { Module,forwardRef } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';

@Module({
    controllers: [ProductsController],
    providers: [ProductService],
    exports: [ProductService],
    imports: [
        forwardRef(() => UsersModule),
        TypeOrmModule.forFeature([Product]),
    
        ],
})
export class ProductsModule {}
