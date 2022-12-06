import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData, SeedUser } from './data/initialData';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    // @Injectable()
    private readonly _productsService: ProductsService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this._deleteTables();
    const user = await this._insertUsers(initialData.users);
    await this._insertNewProduct(user);
    return { statusCode: 200, message: 'Executed successfully!' };
  }

  private async _deleteTables() {
    this._productsService.deleteAllProducts();
    const queryBuilder = this._userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async _insertUsers(users: SeedUser[]) {
    const arrUsers = users.map((user) => {
      const { password, ...resUserDto } = user;

      return this._userRepository.create({
        ...resUserDto,
        password: bcrypt.hashSync(password, 10),
      });
    });

    const usersDb = await this._userRepository.save(arrUsers);
    return usersDb[0];
  }

  private async _insertNewProduct(user: User) {
    this._productsService.deleteAllProducts();
    const products = initialData.products;
    const promisesInsertProduct = products.map(
      async (product) => await this._productsService.create(product, user),
    );

    await Promise.all(promisesInsertProduct);
    return true;
  }
}
