import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/initialData';

@Injectable()
export class SeedService {
  constructor(
    // @Injectable()
    private readonly _productsService: ProductsService,
  ) {}
  async runSeed() {
    await this._insertNewProduct();
    return { statusCode: 200, message: 'Executed successfully!' };
  }

  private async _insertNewProduct() {
    this._productsService.deleteAllProducts();
    const products = initialData.products;
    const promisesInsertProduct = products.map(
      async (product) => await this._productsService.create(product),
    );

    await promisesInsertProduct;
    return true;
  }
}
