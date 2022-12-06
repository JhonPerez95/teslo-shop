import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/initialData';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    // @Injectable()
    private readonly _productsService: ProductsService,
  ) {}
  async runSeed(user: User) {
    await this._insertNewProduct(user);
    return { statusCode: 200, message: 'Executed successfully!' };
  }

  private async _insertNewProduct(user: User) {
    this._productsService.deleteAllProducts();
    const products = initialData.products;
    const promisesInsertProduct = products.map(
      async (product) => await this._productsService.create(product, user),
    );

    await promisesInsertProduct;
    return true;
  }
}
