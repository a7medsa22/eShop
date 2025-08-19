import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { JwtModule } from '@nestjs/jwt';
import { ProductResolver } from './products.resolver';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        TypeOrmModule.forFeature([Product]), UsersModule, JwtModule
    ],
    exports: [ProductsService]
})
export class ProductsModule { }
