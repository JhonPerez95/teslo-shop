import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  exports: [ProductsService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
  providers: [ProductsService],
})
export class ProductsModule {}
